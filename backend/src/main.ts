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
  // On n'exite pas forcément ici si on veut voir d'autres logs, 
  // mais Prisma plantera de toute façon plus tard.
} else {
  console.log('[Bootstrap] DATABASE_URL est présente.');
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
// 
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: true,
      logger: true,
      bodyLimit: 50 * 1024 * 1024,
    })
  );

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
  await app.listen(port, '0.0.0.0');

  logger.log(`WapiBei est en ligne sur http://localhost:${port}`);
  const accessExpiry = process.env.JWT_ACCESS_EXPIRATION || '1h (default)';
  const refreshExpiry = process.env.JWT_REFRESH_EXPIRATION || '7d (default)';
  logger.log(`JWT Config: Access (${accessExpiry}), Refresh (${refreshExpiry})`);
}
bootstrap();