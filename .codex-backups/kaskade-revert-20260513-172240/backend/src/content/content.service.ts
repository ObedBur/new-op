import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HomepageContentDto } from './dto/homepage-content.dto';
import { AppCacheService } from '../common/services/app-cache.service';

const HOMEPAGE_CONTENT_CACHE_KEY = 'content:homepage';
const HOMEPAGE_CONTENT_TTL_MS = 10 * 60 * 1000;

/**
 * Service gérant la récupération du contenu statique et dynamique du frontend.
 */
@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private cache: AppCacheService,
  ) {}

  /**
   * Agrège les données pour la page d'accueil (Hero slides et étapes "Comment ça marche").
   * Utilise Promise.all pour paralléliser les requêtes vers la base de données.
   */
  async getHomepageContent(): Promise<HomepageContentDto> {
    return this.cache.getOrSet(HOMEPAGE_CONTENT_CACHE_KEY, HOMEPAGE_CONTENT_TTL_MS, async () => {
      const [heroSlides, steps] = await Promise.all([
        this.prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
        this.prisma.howItWorksStep.findMany({ orderBy: { order: 'asc' } }),
      ]);

      return {
        heroSlides: heroSlides.map((s) => ({
          id: s.id,
          title: s.title,
          imageUrl: s.imageUrl,
          label: s.label,
        })),
        howItWorksSteps: steps.map((s) => ({
          id: s.id,
          icon: s.icon,
          title: s.title,
          description: s.description,
        })),
      };
    });
  }
}
