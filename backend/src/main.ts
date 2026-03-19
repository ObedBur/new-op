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

  // ============ SÉCURITÉ HTTP (Fastify version) ============
  // On utilise register() avec Fastify au lieu de app.use()
  await app.register(helmet);

  // ============ CONFIGURATION CORS ============
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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