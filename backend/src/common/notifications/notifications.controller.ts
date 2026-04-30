import { Controller, Get, Param, Patch, Post, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtRequest } from '../../auth/types/auth-request.types';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyNotifications(@Req() req: JwtRequest) {
    const userId = req.user.id;
    return this.notificationsService.getUserNotifications(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('read-all')
  async markAllAsRead(@Req() req: JwtRequest) {
    // Logique pour marquer tout comme lu si nécessaire
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribeToPush(@Req() req: JwtRequest, @Body() subscription: any) {
    return this.notificationsService.savePushSubscription(req.user.id, subscription);
  }
}
