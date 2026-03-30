"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto = require("crypto");
const auth_constants_1 = require("../constants/auth.constants");
let TokenService = TokenService_1 = class TokenService {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(TokenService_1.name);
    }
    async generateTokenPair(user, options) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            kycStatus: user.kycStatus,
        };
        const [access_token, refresh_token] = await Promise.all([
            this.generateAccessToken(payload, options?.accessTokenExpiry),
            this.generateRefreshToken(payload, options?.refreshTokenExpiry),
        ]);
        return { access_token, refresh_token };
    }
    async saveRefreshToken(userId, token) {
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() + auth_constants_1.AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS);
        try {
            await this.prisma.refreshToken.create({
                data: {
                    userId,
                    tokenHash,
                    expiresAt,
                },
            });
            this.logger.debug(`Refresh token saved for user ${userId}`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to save refresh token: ${message}`);
            throw new common_1.HttpException('Failed to save refresh token', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async revokeRefreshToken(userId, token) {
        if (!token) {
            throw new common_1.HttpException('Refresh token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const tokenHash = this.hashToken(token);
        try {
            const result = await this.prisma.refreshToken.deleteMany({
                where: { userId, tokenHash },
            });
            if (result.count === 0) {
                this.logger.warn(`Token not found for user ${userId} during revocation`);
                return false;
            }
            this.logger.debug(`Refresh token revoked for user ${userId}`);
            return true;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to revoke token: ${message}`);
            throw new common_1.HttpException('Failed to revoke token', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async revokeAllRefreshTokens(userId) {
        try {
            const result = await this.prisma.refreshToken.deleteMany({
                where: { userId },
            });
            this.logger.debug(`${result.count} tokens revoked for user ${userId}`);
            return result.count;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to revoke all tokens: ${message}`);
            throw new common_1.HttpException('Failed to revoke tokens', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshTokenPair(userId, refreshToken) {
        if (!refreshToken) {
            throw new common_1.HttpException('Refresh token is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const tokenHash = this.hashToken(refreshToken);
        try {
            const storedToken = await this.prisma.refreshToken.findUnique({
                where: { tokenHash },
                include: { user: true },
            });
            if (!storedToken) {
                throw new common_1.HttpException('Session expire ou invalide', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (storedToken.expiresAt < new Date()) {
                await this.prisma.refreshToken.delete({ where: { id: storedToken.id } }).catch(() => { });
                throw new common_1.HttpException('Session expire', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (storedToken.userId !== userId) {
                throw new common_1.HttpException('Utilisateur invalide', common_1.HttpStatus.FORBIDDEN);
            }
            await this.prisma.refreshToken.deleteMany({
                where: { tokenHash },
            });
            const user = storedToken.user;
            const newTokens = await this.generateTokenPair(user);
            await this.saveRefreshToken(user.id, newTokens.refresh_token);
            return newTokens;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Token refresh failed: ${message}`);
            throw new common_1.HttpException('Erreur lors du rafrachissement', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateAccessToken(payload, expiresIn = process.env.JWT_ACCESS_EXPIRATION || auth_constants_1.AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY) {
        return this.jwtService.signAsync({ ...payload }, {
            secret: this.getSecret('JWT_ACCESS_SECRET'),
            expiresIn: expiresIn,
        });
    }
    async generateRefreshToken(payload, expiresIn = process.env.JWT_REFRESH_EXPIRATION || auth_constants_1.AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY) {
        const enhancedPayload = {
            ...payload,
            jti: crypto.randomBytes(16).toString('hex'),
        };
        return this.jwtService.signAsync({ ...enhancedPayload }, {
            secret: this.getSecret('JWT_REFRESH_SECRET'),
            expiresIn: expiresIn,
        });
    }
    hashToken(token) {
        if (!token)
            throw new Error('Cannot hash empty token');
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    getSecret(key) {
        const secret = process.env[key];
        if (process.env.NODE_ENV === 'production') {
            if (!secret || secret.length < auth_constants_1.AUTH_CONSTANTS.MIN_SECRET_LENGTH_PROD) {
                throw new Error(`Invalid or missing ${key} in production`);
            }
            return secret;
        }
        if (!secret) {
            return key === 'JWT_ACCESS_SECRET' ? auth_constants_1.AUTH_CONSTANTS.DEV_SECRETS.JWT_SECRET : auth_constants_1.AUTH_CONSTANTS.DEV_SECRETS.JWT_REFRESH_SECRET;
        }
        return secret;
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = TokenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], TokenService);
//# sourceMappingURL=token.service.js.map