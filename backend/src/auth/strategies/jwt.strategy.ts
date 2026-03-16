// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../types/token.types';
import { AuthenticatedUser } from '../types/auth-request.types';

/**
 * Rcupre le secret JWT de manire scurise.
 * En production, une erreur est leve si le secret n'est pas dfini.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('[SECURITY] JWT_SECRET is not defined in production');
  }
  return secret || 'dev_jwt_secret_wapibei_2026';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Stratgie de validation de l'Access Token (AT).
   * Utilise pour protger les routes et identifier l'utilisateur actuel.
   */
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  /**
   * Valide le payload du Token et rcupre l'utilisateur complet depuis la base.
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        boutiqueName: true,
        kycStatus: true,
        province: true,
        commune: true,
        trustScore: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Account not verified');
    }

    if (user.role === 'VENDOR' && user.kycStatus !== 'APPROVED') {
      throw new ForbiddenException('Vendor KYC not approved');
    }

    return user;
  }
}

