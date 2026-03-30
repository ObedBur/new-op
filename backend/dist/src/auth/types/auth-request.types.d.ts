import { UserRole, KycStatus } from '@prisma/client';
import { JwtPayload } from './token.types';
import { FastifyRequest } from 'fastify';
export interface AuthenticatedUser {
    id: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    role: UserRole;
    boutiqueName: string | null;
    kycStatus: KycStatus;
    province: string | null;
    commune: string | null;
    trustScore: number;
    isVerified: boolean;
}
export interface RefreshTokenPayload extends JwtPayload {
    refreshToken: string;
}
export interface JwtRequest extends FastifyRequest {
    user: AuthenticatedUser;
}
export interface RefreshRequest extends FastifyRequest {
    user: RefreshTokenPayload;
}
