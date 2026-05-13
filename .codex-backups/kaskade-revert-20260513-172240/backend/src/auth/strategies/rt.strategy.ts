import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../types/token.types';
import { RefreshTokenPayload } from '../types/auth-request.types';

function getRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('[SECURITY] JWT_REFRESH_SECRET is not defined in production');
  }
  return secret || 'dev_refresh_secret_wapibei_2026';
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getRefreshSecret(),
      passReqToCallback: true, // Gardé à true pour récupérer le token brut
    });
  }

  /**
   * Version Fastify de la validation
   */
  validate(req: FastifyRequest, payload: JwtPayload): RefreshTokenPayload | null {
    // Dans Fastify, on n'utilise pas .get('authorization') mais .headers
    const authHeader = req.headers.authorization;

    if (!authHeader) return null;

    const refreshToken = authHeader.replace('Bearer', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}