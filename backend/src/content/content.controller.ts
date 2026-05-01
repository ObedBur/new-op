import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ContentService } from './content.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

/**
 * Contrôleur gérant le contenu dynamique de la plateforme (CMS léger).
 * Fournit les données pour la page d'accueil, les bannières, et les étapes du guide.
 */
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  /**
   * Récupère l'ensemble du contenu nécessaire pour la page d'accueil.
   * Cette route est mise en cache pendant 1 heure pour optimiser les performances,
   * car ce contenu change rarement.
   */
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('homepage')
  async getHomepageContent() {
    return this.contentService.getHomepageContent();
  }
}
