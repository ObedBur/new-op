import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { EmailModule } from './common/email/email.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SellersModule } from './sellers/sellers.module';
import { ContentModule } from './content/content.module';
import { OrdersModule } from './orders/orders.module';
import { CacheModule } from '@nestjs/cache-manager';
import { NotificationsModule } from './common/notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 600, 
      max: 1000,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'auth',
        ttl: 900000,
        limit: 5,
      }
    ]),
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
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
=======
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';
import { MailModule } from './mail/mail.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { ProvidersModule } from './providers/providers.module';
import { ServicesModule } from './services/services.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RequestsModule } from './requests/requests.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminDashboardModule } from './admin/dashboard/admin-dashboard.module';
import { AdminFinancialsModule } from './admin/financials/admin-financials.module';
import { UploadsModule } from './uploads/uploads.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL', 900000),
          limit: config.get('THROTTLE_LIMIT', 100),
        },
      ],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    RedisModule,
    RequestsModule,
    ProvidersModule,
    ServicesModule,
    NotificationsModule,
    PaymentsModule,
    AdminDashboardModule,
    AdminFinancialsModule,
    UploadsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule { }
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
