import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { EmailModule } from '../common/email/email.module';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsAppModule } from '../common/whatsapp/whatsapp.module';

@Module({
  imports: [PrismaModule, EmailModule, WhatsAppModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
