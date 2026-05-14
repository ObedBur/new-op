import * as dotenv from 'dotenv';
import * as path from 'path';

const envPaths = [
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), '.env.local')
];

console.log('[Bootstrap] Démarrage du script main.ts...');

for (const envPath of envPaths) {
  dotenv.config({ path: envPath });
  if (process.env.DATABASE_URL) {
    console.log(`[Bootstrap] DATABASE_URL chargée depuis ${envPath}`);
    break;
  }
}

if (!process.env.DATABASE_URL) {
  console.error('[Bootstrap] ERREUR : DATABASE_URL est absente de process.env');
} else {
  console.log('[Bootstrap] DATABASE_URL est présente.');
}

// === HANDLERS D'ERREURS GLOBAUX ===
// Doit être AVANT les imports NestJS pour capturer les crashs pendant le require()
process.on('uncaughtException', (err) => {
  console.error('[CRASH] UNCAUGHT EXCEPTION:', err.message);
  console.error('[CRASH] Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('[CRASH] UNHANDLED REJECTION:', reason?.message || reason);
  console.error('[CRASH] Stack:', reason?.stack);
  process.exit(1);
});

// S'exécute TOUJOURS, y compris après process.exit()
process.on('exit', (code) => {
  console.log(`[Bootstrap] Process terminé avec code: ${code}`);
});

// === IMPORTS NESTJS (avec logs entre chaque) ===
console.log('[1/7] Chargement @nestjs/core...');
import { NestFactory } from '@nestjs/core';
console.log('[2/7] Chargement @nestjs/common...');
import { ValidationPipe, Logger } from '@nestjs/common';
console.log('[3/7] Chargement AppModule...');
import { AppModule } from './app.module';
console.log('[4/7] Chargement @nestjs/platform-fastify...');
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
console.log('[5/7] Chargement @fastify/helmet...');
import helmet from '@fastify/helmet';
console.log('[6/7] Chargement GlobalExceptionFilter...');
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
console.log('[7/7] Tous les imports chargés avec succès !');

async function bootstrap() {
  console.log('[Bootstrap] Appel de NestFactory.create...');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: true,
      logger: true,
      bodyLimit: 50 * 1024 * 1024,
    })
  );
  console.log('[Bootstrap] NestFactory.create terminé.');

  // ============ PREFIXE GLOBAL ============
  app.setGlobalPrefix('api');

  // ============ FILTRE D'EXCEPTIONS GLOBAL ============
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ============ VALIDATION GLOBALE ============
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ============ CONFIGURATION CORS ============
  const isDev = process.env.NODE_ENV !== 'production';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  // Parser les origines autorisées
  const allowedOrigins = isDev
    ? true
    : [
      ...frontendUrl.split(',').map(url => url.trim()),
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  });

  // ============ SÉCURITÉ HTTP (Fastify version) ============
  // On place helmet APRÈS CORS pour éviter des conflits et on le desserre en dev
  await app.register(helmet, {
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  });

  // ============ SHUTDOWN HOOKS ============
  app.enableShutdownHooks();

  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 4000;
  console.log(`[Bootstrap] Tentative d'écoute sur le port ${port}...`);
  await app.listen(port, '0.0.0.0');

  logger.log(`WapiBei est en ligne sur http://localhost:${port}`);
  const accessExpiry = process.env.JWT_ACCESS_EXPIRATION || '1h (default)';
  const refreshExpiry = process.env.JWT_REFRESH_EXPIRATION || '7d (default)';
  logger.log(`JWT Config: Access (${accessExpiry}), Refresh (${refreshExpiry})`);
}

bootstrap().catch((err) => {
  console.error('[Bootstrap] ERREUR FATALE:', err);
  process.exit(1);
});