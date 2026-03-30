import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { TokenPair, TokenGenerationOptions } from '../types/token.types';
export declare class TokenService {
    private readonly jwtService;
    private readonly prisma;
    private readonly logger;
    constructor(jwtService: JwtService, prisma: PrismaService);
    generateTokenPair(user: User, options?: TokenGenerationOptions): Promise<TokenPair>;
    saveRefreshToken(userId: string, token: string): Promise<void>;
    revokeRefreshToken(userId: string, token: string): Promise<boolean>;
    revokeAllRefreshTokens(userId: string): Promise<number>;
    refreshTokenPair(userId: string, refreshToken: string): Promise<TokenPair>;
    private generateAccessToken;
    private generateRefreshToken;
    private hashToken;
    private getSecret;
}
