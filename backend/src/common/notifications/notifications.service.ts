import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { WebPushService } from './web-push.service';

/**
 * Service central de gestion des notifications.
 * Orchestre les notifications In-App, les emails transactionnels et les Push Web.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private webPushService: WebPushService,
  ) { }

  /**
   * Persiste une notification en base de données pour un utilisateur.
   * Retourne null en cas d'échec pour ne pas interrompre les flux métier critiques.
   */
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
      this.logger.log(`Notification créée pour l'utilisateur ${data.userId}: ${data.title}`);
      return notification;
    } catch (error) {
      this.logger.error(`Échec de la création de notification pour l'utilisateur ${data.userId}`, error);
      return null;
    }
  }

  /**
   * Marque une notification spécifique comme lue.
   */
  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Marque toutes les notifications d'un utilisateur comme lues en une seule opération.
   */
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Récupère les 50 dernières notifications d'un utilisateur.
   */
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Enregistre ou met à jour un abonnement Push Web pour un utilisateur et un appareil.
   * Utilise l'endpoint comme clé unique pour éviter les doublons.
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
   * Diffuse une notification multicanal (In-App, Email, Push) à tous les abonnés d'un vendeur
   * lorsqu'un nouveau produit est publié.
   * S'exécute de manière asynchrone pour ne pas bloquer la réponse API.
   */
  async broadcastNewProduct(productId: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          user: {
            select: { id: true, boutiqueName: true },
          },
        },
      });

      if (!product) return;

      const followers = await this.prisma.follow.findMany({
        where: { vendorId: product.userId },
        include: {
          follower: {
            select: { id: true, email: true, fullName: true },
          },
        },
      });

      this.logger.log(`Diffusion du produit "${product.name}" à ${followers.length} abonnés`);

      for (const follow of followers) {
        const follower = follow.follower;

        // Notification In-App
        await this.createNotification({
          userId: follower.id,
          title: 'Nouveau produit',
          message: `${product.user.boutiqueName} a publié : ${product.name}`,
          type: NotificationType.NEW_PRODUCT,
          metadata: {
            productId: product.id,
            productName: product.name,
            vendorId: product.userId,
            vendorName: product.user.boutiqueName || 'Un vendeur',
            url: `/products/${product.id}`,
          },
        });

        // Notification Email
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

        // Notification Push (sur tous les appareils enregistrés)
        await this.sendPushToUser(follower.id, {
          title: 'Nouveau produit',
          body: `${product.user.boutiqueName} a publié : ${product.name}`,
          data: { url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/products/${product.id}` },
        });
      }
    } catch (error) {
      this.logger.error(`Échec de la diffusion du produit ${productId}`, error);
    }
  }

  /**
   * Envoie une notification Push à un utilisateur sur tous ses appareils enregistrés.
   * Nettoie automatiquement les abonnements invalides (endpoint expiré).
   */
  async sendPushToUser(userId: string, payload: { title: string; body: string; icon?: string; data?: any }) {
    try {
      const subscriptions = await this.prisma.pushSubscription.findMany({
        where: { userId },
      });

      const pushPayload = {
        ...payload,
        icon: payload.icon || '/logo.png',
      };

      for (const sub of subscriptions) {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        };

        const success = await this.webPushService.sendNotification(pushSubscription, pushPayload);
        if (!success) {
          // Suppression de l'abonnement invalide pour éviter les tentatives futures
          await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
        }
      }
    } catch (error) {
      this.logger.error(`Échec de l'envoi push pour l'utilisateur ${userId}`, error);
    }
  }
}
