import { Injectable, Logger } from '@nestjs/common';
import * as webpush from 'web-push';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebPushService {
  private readonly logger = new Logger(WebPushService.name);

  constructor(private configService: ConfigService) {
    const publicVapidKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateVapidKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const email = this.configService.get<string>('VAPID_EMAIL', 'mailto:admin@wapibei.com');

    if (publicVapidKey && privateVapidKey) {
      webpush.setVapidDetails(email, publicVapidKey, privateVapidKey);
      this.logger.log('WebPush VAPID details set successfully');
    } else {
      this.logger.warn('VAPID keys not found in config. WebPush will not work.');
    }
  }

  async sendNotification(subscription: any, payload: any) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
      return true;
    } catch (error: any) {
      this.logger.error('Error sending WebPush notification', error);
      // Si l'abonnement n'est plus valide (404 ou 410), on devrait le supprimer en base
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        return false; // Indique que l'abonnement doit être supprimé
      }
      return true;
    }
  }
}
