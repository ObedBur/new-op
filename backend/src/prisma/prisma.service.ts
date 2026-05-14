import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const databaseUrl = process.env.DATABASE_URL || '';
    const isAccelerate = databaseUrl.startsWith('prisma://');

    super({
      log: ['info', 'warn', 'error'],
      // Prisma v7 utilise le moteur "client" par défaut.
      // Pour Accelerate (prisma://), on passe l'URL comme accelerateUrl.
      // Pour PostgreSQL direct, on passe comme datasourceUrl.
      ...(isAccelerate
        ? { accelerateUrl: databaseUrl }
        : { datasourceUrl: databaseUrl }),
    });

    this.logger.log(
      `Mode Prisma: ${isAccelerate ? 'Accelerate' : 'Direct PostgreSQL'}`,
    );
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Prisma connecté');
    } catch (e) {
      this.logger.error('❌ Prisma connection failed', e);
      throw e;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}