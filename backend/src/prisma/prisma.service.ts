import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool, type PoolConfig } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * URLs que le driver `pg` ne doit pas utiliser (Accelerate / Prisma Data ≠ Postgres direct attendu par `pg`).
 */
function isDirectPostgresForPg(url: string): boolean {
  const t = url.trim().toLowerCase();
  if (!t.startsWith('postgres://') && !t.startsWith('postgresql://')) {
    return false;
  }
  if (t.includes('prisma-data.net')) return false;
  if (t.includes('accelerate')) return false;
  if (t.startsWith('prisma://') || t.startsWith('prisma+')) return false;
  return true;
}

function poolConfigFromUrl(connectionString: string): PoolConfig {
  const ssl =
    /\bsslmode=(require|verify-full|verify-ca)\b/i.test(connectionString) ||
    process.env.DATABASE_SSL === '1';
  return {
    connectionString,
    max: Number(process.env.PG_POOL_MAX || 10),
    ...(ssl ? { ssl: { rejectUnauthorized: false } } : {}),
  };
}

function resolveUrlForPgAdapter(): string | undefined {
  const candidates = [
    process.env.DATABASE_DIRECT_URL,
    process.env.DIRECT_DATABASE_URL,
    process.env.DATABASE_URL,
  ].filter((u): u is string => Boolean(u && u.trim()));
  return candidates.find(isDirectPostgresForPg);
}

type PrismaInit = {
  args: ConstructorParameters<typeof PrismaClient>[0] | undefined;
  mode: 'pg-adapter' | 'engine-default';
};

function buildPrismaInit(): PrismaInit {
  const urlForPg = resolveUrlForPgAdapter();

  if (urlForPg) {
    const pool = new Pool(poolConfigFromUrl(urlForPg));
    const adapter = new PrismaPg(pool as any);
    return { args: { adapter } as any, mode: 'pg-adapter' };
  }

  const fallbackUrl = process.env.DATABASE_URL;
  if (!fallbackUrl) {
    throw new Error('DATABASE_URL is required');
  }

  return {
    args: { datasources: { db: { url: fallbackUrl } } } as any,
    mode: 'engine-default'
  };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const init = buildPrismaInit();
    super(init.args as any);
    this.logger.log(
      init.mode === 'pg-adapter'
        ? 'Prisma: driver PostgreSQL (@prisma/adapter-pg)'
        : 'Prisma: moteur classique (sans adapter pg — ex. Accelerate)',
    );
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
