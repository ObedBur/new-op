import { Controller, Get, Param, Patch, UseGuards, Req } from '@nestjs/common';
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
}
