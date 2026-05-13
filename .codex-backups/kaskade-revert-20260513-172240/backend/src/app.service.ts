import { Injectable } from '@nestjs/common';

export interface ApiInfo {
  name: string;
  version: string;
  environment: string;
  status: string;
  timestamp: string;
  message: string;
  debug?: boolean;
  tips?: string[];
  database?: string;
  prismaStudio?: string;
  nextSteps?: string[];
}

@Injectable()
export class AppService {
  getApiInfo(): ApiInfo {
    const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    
    const baseInfo = {
      name: 'WapiBei API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      status: 'running',
      timestamp: new Date().toISOString(),
      message: isDev 
        ? ' API en mode dveloppement - OTP visible dans console'
        : ' API WapiBei oprationnelle',
    };

    if (isDev) {
      return {
        ...baseInfo,
        debug: true,
        tips: [
          ' Inscription: POST /auth/register',
          ' Connexion: POST /auth/login',
          ' Vrification: POST /auth/verify-otp',
          ' Renvoyer OTP: POST /auth/resend-otp',
          '  Voir utilisateurs: GET /auth/test-users (dev only)',
          '  Nettoyer DB: DELETE /auth/test-users (dev only)',
        ],
        database: process.env.DATABASE_URL?.includes('file:') 
          ? 'SQLite (fichier local)' 
          : 'PostgreSQL',
        prismaStudio: 'http://localhost:5555',
        nextSteps: [
          '1. Tester l\'inscription',
          '2. Vrifier OTP dans console',
          '3. Se connecter',
          '4. Explorer la DB avec Prisma Studio',
        ],
      };
    }

    return baseInfo;
  }

  getHealth() {
    return {
      status: 'healthy',
      service: 'WapiBei Marketplace API',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: 'connected',
      checks: {
        api: 'ok',
        database: 'ok',
        authentication: 'enabled',
      },
    };
  }
}

