import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import indispensable
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { EmailModule } from './common/email/email.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SellersModule } from './sellers/sellers.module';
import { ContentModule } from './content/content.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './common/notifications/notifications.module';

@Module({
  imports: [
    // Configuration pour charger le fichier .env
    ConfigModule.forRoot({
      isGlobal: true, // Rend les variables accessibles dans tous les modules sans ré-import
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      name: 'auth',
      ttl: 900,
      limit: 5,
    }]),
    PrismaModule,
    CommonModule,
    EmailModule,
    NotificationsModule,
    AuthModule,
    AdminModule,
    ProductsModule,
    CategoriesModule,
    SellersModule,
    ContentModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

