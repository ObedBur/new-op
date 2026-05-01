import { Controller, Get, Param, Patch, Post, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtRequest } from '../../auth/types/auth-request.types';

/**
 * Contrôleur gérant les notifications In-App et les abonnements aux notifications Push.
 */
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Récupère les 50 dernières notifications de l'utilisateur authentifié.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyNotifications(@Req() req: JwtRequest) {
    return this.notificationsService.getUserNotifications(req.user.id);
  }

  /**
   * Marque une notification spécifique comme lue.
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  /**
   * Marque toutes les notifications de l'utilisateur comme lues.
   */
  @UseGuards(JwtAuthGuard)
  @Patch('read-all')
  async markAllAsRead(@Req() req: JwtRequest) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  /**
   * Enregistre un abonnement aux notifications Push Web (Web Push API).
   */
  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribeToPush(@Req() req: JwtRequest, @Body() subscription: any) {
    return this.notificationsService.savePushSubscription(req.user.id, subscription);
  }
}
