<<<<<<< HEAD
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const url = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool as any);
    super({ adapter } as any);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
=======
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL')!;
    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
