import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { NotificationsService } from './notifications.service';
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtRequest } from '../../auth/types/auth-request.types';
import { TestSmsDto } from './dto/test-sms.dto';

/**
 * Contrôleur gérant les notifications In-App et les abonnements aux notifications Push.
 */
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly smsService: SmsService,
  ) {}

  @Throttle({ global: { limit: 5, ttl: 60000 } })
  @Post('test-sms')
  async testSms(@Body() dto: TestSmsDto) {
    const result = await this.smsService.sendSms(dto.phone, dto.message);

    return {
      sent: result.sent,
      provider: result.provider,
      attempts: result.attempts ?? 0,
      durationMs: result.durationMs ?? 0,
      ...(result.messageId && { messageId: result.messageId }),
      ...(result.status && { status: result.status }),
      ...(result.reason && { reason: result.reason }),
      ...(result.providerErrorCode && { providerErrorCode: result.providerErrorCode }),
      ...(result.providerErrorMessage && { providerErrorMessage: result.providerErrorMessage }),
    };
  }

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
