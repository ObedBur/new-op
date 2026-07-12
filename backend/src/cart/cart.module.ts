import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartCronService } from './cart.cron';
import { EmailModule } from '../common/email/email.module';
import { NotificationsModule } from '../common/notifications/notifications.module';

@Module({
  imports: [PrismaModule, EmailModule, NotificationsModule],
  controllers: [CartController],
  providers: [CartService, CartCronService],
  exports: [CartService],
})
export class CartModule {}
