"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    getApiInfo() {
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
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map