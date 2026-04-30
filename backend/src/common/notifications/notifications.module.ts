import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { WebPushService } from './web-push.service';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Global()
@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, WebPushService],
  exports: [NotificationsService, WebPushService],
})
export class NotificationsModule {}
