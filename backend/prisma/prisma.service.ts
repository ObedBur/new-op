import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Créer un pool de connexions PostgreSQL
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    // Créer l'adaptateur Prisma pour PostgreSQL
    const adapter = new PrismaPg(pool);
    
    // Initialiser PrismaClient avec l'adaptateur
    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Prisma connecté à la base de données avec adaptateur PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma déconnecté de la base de données');
  }
}