import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HomepageContentDto } from './dto/homepage-content.dto';

/**
 * Service gérant la récupération du contenu statique et dynamique du frontend.
 */
@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Agrège les données pour la page d'accueil (Hero slides et étapes "Comment ça marche").
   * Utilise Promise.all pour paralléliser les requêtes vers la base de données.
   */
  async getHomepageContent(): Promise<HomepageContentDto> {
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
  }
}
