import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { NotificationsService } from './notifications.service';
import { SmsService } from './sms/sms.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtRequest } from '../../auth/types/auth-request.types';
import { SendSmsDto } from './dto/send-sms.dto';
import { DevOnlyGuard } from '../guards/dev-only.guard';

/**
 * Contrôleur gérant les notifications In-App et les abonnements aux notifications Push.
 */
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly smsService: SmsService,
  ) {}

  /**
   * Endpoint de test pour envoyer un SMS.
   */
  @UseGuards(DevOnlyGuard, ThrottlerGuard)
  @Throttle({ global: { limit: 3, ttl: 60000 } })
  @Post('test-sms')
  @HttpCode(HttpStatus.OK)
  async testSms(@Body() dto: SendSmsDto) {
    const result = await this.smsService.sendSms(dto.phone, dto.message);

    return {
      sent: result.sent,
      provider: result.provider,
      attempts: result.attempts ?? 0,
      durationMs: result.durationMs ?? 0,
      ...(result.skipped && { skipped: result.skipped }),
      ...(result.reason && { reason: result.reason }),
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
