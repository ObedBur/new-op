import { UserRole, KycStatus } from '@prisma/client';
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    kycStatus: KycStatus;
    jti?: string;
}
export interface TokenPair {
    access_token: string;
    refresh_token: string;
}
export interface RefreshTokenData {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
}
export interface TokenGenerationOptions {
    accessTokenExpiry?: string;
    refreshTokenExpiry?: string;
}
