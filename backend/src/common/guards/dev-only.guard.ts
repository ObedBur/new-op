import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';

/**
 * Guard qui bloque l'accès aux endpoints de debug en production.
 *
 * Comportement :
 * - NODE_ENV = 'production' → 403 Forbidden avec message explicite
 * - NODE_ENV = 'development' | 'test' | non défini → accès autorisé
 *
 * Usage : @UseGuards(DevOnlyGuard) sur tout endpoint de test/debug
 * qui ne doit jamais être exposé publiquement en production.
 *
 * Ce guard ne remplace pas JwtAuthGuard ; il peut être combiné avec lui.
 */
@Injectable()
export class DevOnlyGuard implements CanActivate {
  private readonly logger = new Logger(DevOnlyGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      const request = context.switchToHttp().getRequest<{ url?: string; ip?: string }>();
      this.logger.warn(
        `[DevOnlyGuard] Accès refusé à un endpoint de debug en production. ` +
          `URL: ${request?.url ?? 'unknown'} | IP: ${request?.ip ?? 'unknown'}`,
      );
      throw new ForbiddenException(
        'Cet endpoint est uniquement disponible en environnement de développement.',
      );
    }

    return true;
  }
}
