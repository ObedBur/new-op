import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { WebPushService } from './web-push.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../../auth/auth.module';
import { SmsService } from './sms/sms.service';
import { smsProviderFactory } from './sms/sms.factory';
import { MockSmsProvider } from './sms/providers/mock.provider';
import { TwilioSmsProvider } from './sms/providers/twilio.provider';
import { AfricastalkingSmsProvider } from './sms/providers/africastalking.provider';

@Global()
@Module({
  imports: [PrismaModule, EmailModule, AuthModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    WebPushService,
    NotificationsGateway,
    SmsService,
    MockSmsProvider,
    TwilioSmsProvider,
    AfricastalkingSmsProvider,
    smsProviderFactory,
  ],
  exports: [
    NotificationsService,
    WebPushService,
    NotificationsGateway,
    SmsService,
  ],
})
export class NotificationsModule {}
