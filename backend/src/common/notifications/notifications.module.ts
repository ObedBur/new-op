import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { WebPushService } from './web-push.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../../auth/auth.module';
import { SmsService } from './sms.service';

@Global()
@Module({
  imports: [PrismaModule, EmailModule, AuthModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, WebPushService, NotificationsGateway, SmsService],
  exports: [NotificationsService, WebPushService, NotificationsGateway, SmsService],
})
export class NotificationsModule {}
