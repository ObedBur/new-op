import { UserRole, KycStatus } from '@prisma/client';

/**
 * Payload du JWT contenu dans l'access token et le refresh token
 */
export interface JwtPayload {
  sub: string;           // User ID
  email: string;
  role: UserRole;
  kycStatus: KycStatus;
  jti?: string;          // JWT ID (uniquement pour refresh token)
}

/**
 * Paire de tokens retourne lors du login ou refresh
 */
export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

/**
 * Donnes du refresh token stock en base
 */
export interface RefreshTokenData {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Options pour la gnration de tokens
 */
export interface TokenGenerationOptions {
  accessTokenExpiry?: string;   // Ex: '1h', '30m'
  refreshTokenExpiry?: string;  // Ex: '7d', '30d'
}

