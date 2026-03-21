import * as dotenv from 'dotenv';
import * as path from 'path';

const envPaths = [
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), '.env.local')
];

for (const envPath of envPaths) {
  dotenv.config({ path: envPath });
  if (process.env.DATABASE_URL) break;
}

if (!process.env.DATABASE_URL) {
  process.exit(1);
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import helmet from '@fastify/helmet'; // Changement ici : version Fastify de helmet

async function bootstrap() {
  // Changement de NestExpressApplication vers NestFastifyApplication
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: true, // Équivalent de app.set('trust proxy', 1)
      logger: true,      // Active le logger ultra-rapide Pino
      bodyLimit: 50 * 1024 * 1024, // 50MB pour supporter les images Base64
    })
  );

  // ============ PREFIXE GLOBAL ============
  app.setGlobalPrefix('api');

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
  
  app.enableCors({
    origin: isDev ? true : [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
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

  // Important : Avec Fastify, il est conseillé d'écouter sur '0.0.0.0'
  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 WapiBei est en ligne sur http://localhost:${port}`);
  const accessExpiry = process.env.JWT_ACCESS_EXPIRATION || '1h (default)';
  const refreshExpiry = process.env.JWT_REFRESH_EXPIRATION || '7d (default)';
  console.log(`🔐 JWT Config: Access (${accessExpiry}), Refresh (${refreshExpiry})`);
}
bootstrap();