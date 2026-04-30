import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType, Product } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { WebPushService } from './web-push.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private webPushService: WebPushService,
  ) {}

   // Crée une notification en base de données pour un utilisateur.
   
  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    metadata?: any;
  }) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: data.userId,
          title: data.title,
          message: data.message,
          type: data.type,
          metadata: data.metadata ?? {},
        },
      });
      this.logger.log(`Notification created for user ${data.userId}: ${data.title}`);
      return notification;
    } catch (error) {
      this.logger.error(`Failed to create notification for user ${data.userId}`, error);
      return null;
    }
  }

   // Marquer une notification comme lue.
  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

   // Récupérer les notifications d'un utilisateur.
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Enregistre un abonnement aux notifications push pour un utilisateur.
   */
  async savePushSubscription(userId: string, subscription: any) {
    return this.prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });
  }

  /**
   * Diffuse une notification à tous les abonnés d'un vendeur lorsqu'un nouveau produit est publié.
   */
  async broadcastNewProduct(productId: string) {
    try {
      // 1. Récupérer le produit avec les infos du vendeur
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          user: {
            select: {
              id: true,
              boutiqueName: true,
            },
          },
        },
      });

      if (!product) return;

      // 2. Trouver tous les abonnés du vendeur
      const followers = await this.prisma.follow.findMany({
        where: { vendorId: product.userId },
        include: {
          follower: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
      });

      this.logger.log(`Broadcasting new product ${product.name} to ${followers.length} followers`);

      // 3. Envoyer les notifications (In-App et Email)
      for (const follow of followers) {
        const follower = follow.follower;

        // --- Notification In-App ---
        await this.createNotification({
          userId: follower.id,
          title: 'Nouveau produit !',
          message: `${product.user.boutiqueName} a publié : ${product.name}`,
          type: NotificationType.NEW_PRODUCT,
          metadata: { productId: product.id },
        });

        // --- Notification Email ---
        if (follower.email) {
          await this.emailService.sendNewProductNotification({
            email: follower.email,
            customerName: follower.fullName,
            vendorName: product.user.boutiqueName || 'Un vendeur',
            productName: product.name,
            productImage: product.image || '',
            price: product.price,
            productLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/products/${product.id}`,
          });
        }

        // --- Notification Push ---
        const subscriptions = await this.prisma.pushSubscription.findMany({
          where: { userId: follower.id },
        });

        for (const sub of subscriptions) {
          const pushPayload = {
            title: 'Nouveau produit !',
            body: `${product.user.boutiqueName} a publié : ${product.name}`,
            icon: '/logo.png', // Chemin vers votre logo
            data: {
              url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/products/${product.id}`,
            },
          };

          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };

          const success = await this.webPushService.sendNotification(pushSubscription, pushPayload);
          if (!success) {
            // Nettoyage des abonnements expirés
            await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed to broadcast new product ${productId}`, error);
    }
  }
}
