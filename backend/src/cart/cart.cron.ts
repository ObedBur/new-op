import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../common/email/email.service';
import { NotificationsService } from '../common/notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class CartCronService {
  private readonly logger = new Logger(CartCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Tâche planifiée exécutée toutes les heures pour relancer les paniers abandonnés.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleAbandonedCarts() {
    this.logger.log('Lancement de la vérification des paniers abandonnés...');

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000);

    try {
      // Trouver les paniers modifiés il y a exactement entre 24h et 25h
      const abandonedCartItems = await this.prisma.cartItem.findMany({
        where: {
          updatedAt: {
            lte: twentyFourHoursAgo,
            gte: twentyFiveHoursAgo,
          },
        },
        include: {
          user: true,
        },
      });

      if (abandonedCartItems.length === 0) {
        return;
      }

      // Grouper par utilisateur
      const itemsByUser = new Map<string, typeof abandonedCartItems>();
      abandonedCartItems.forEach(item => {
        const existing = itemsByUser.get(item.userId) || [];
        existing.push(item);
        itemsByUser.set(item.userId, existing);
      });

      // Envoyer les relances
      for (const [userId, items] of itemsByUser.entries()) {
        const user = items[0].user;
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        // 1. Notification In-App
        await this.notificationsService.createNotification({
          userId: user.id,
          title: 'Panier en attente',
          message: `Vous avez laissé ${itemCount} article(s) dans votre panier ! Finalisez votre commande maintenant.`,
          type: NotificationType.GENERAL_ANNOUNCEMENT,
          metadata: {
            url: '/cart',
          },
        });

        // 2. Notification Email (si configuré)
        const cartLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart`;
        await this.emailService.sendAbandonedCart({
          email: user.email,
          name: user.fullName || 'Client',
          itemCount,
          cartLink,
        }).catch(err => this.logger.error(`Erreur email relance panier pour ${user.email}`, err));

        this.logger.log(`Relance panier envoyée à l'utilisateur ${user.id} (${itemCount} articles).`);
      }
    } catch (error) {
      this.logger.error('Erreur lors du traitement des paniers abandonnés', error);
    }
  }
}
