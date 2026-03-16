import { UserRole, KycStatus } from '@prisma/client';
import { JwtPayload } from './token.types';
import { FastifyRequest } from 'fastify';

// Interface représentant l'utilisateur tel que retourné par la JwtStrategy 
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

// Interface représentant le payload reçu par la RtStrategy (Refresh Token)
export interface RefreshTokenPayload extends JwtPayload {
  refreshToken: string;
}

// Interface étendue pour Fastify Request incluant les données de l'utilisateur 
export interface JwtRequest extends FastifyRequest {
  user: AuthenticatedUser;
}

// Interface étendue pour Fastify Request incluant le payload du Refresh Token 
export interface RefreshRequest extends FastifyRequest {
  user: RefreshTokenPayload;
}
