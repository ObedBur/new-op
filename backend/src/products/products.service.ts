import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModerationService } from '../common/services/moderation.service';
import { AppCacheService } from '../common/services/app-cache.service';
import { NotificationsService } from '../common/notifications/notifications.service';

/**
 * Configuration des inclusions par défaut pour les requêtes de produits.
 */
const productInclude = {
  category: true,
  user: {
    select: {
      id: true,
      fullName: true,
      boutiqueName: true,
      isVerified: true,
      trustScore: true,
      phone: true,
      avatarUrl: true,
    },
  },
};

const HOME_PRODUCTS_TTL_MS = 3 * 60 * 1000;
@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private moderationService: ModerationService,
    private cache: AppCacheService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Récupère les offres promotionnelles du moment.
   * Filtre les produits marqués explicitement comme étant en solde.
   */
  async getDeals(limit = 6) {
    return this.cache.getOrSet(
      `products:deals:${limit}`,
      HOME_PRODUCTS_TTL_MS,
      () => {
        return this.prisma.product.findMany({
          where: {
            isOnSale: true,
            originalPrice: { not: null },
            isPublic: true,
          } as any,
          orderBy: { createdAt: 'desc' },
          take: limit,
          include: productInclude,
        });
      },
    );
  }

  /**
   * Récupère les nouveautés publiées au cours des 7 derniers jours.
   */
  async getNewArrivals(limit = 6) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.cache.getOrSet(
      `products:new-arrivals:${limit}`,
      HOME_PRODUCTS_TTL_MS,
      () => {
        return this.prisma.product.findMany({
          where: {
            createdAt: { gte: sevenDaysAgo },
            isPublic: true,
          } as any,
          orderBy: { createdAt: 'desc' },
          take: limit,
          include: productInclude,
        });
      },
    );
  }

  /**
   * Algorithme de recommandation personnalisé.
   * 1. Analyse les catégories les plus achetées par l'utilisateur.
   * 2. Si l'historique est vide, propose les produits des vendeurs les mieux notés (TrustScore).
   */
  async getRecommendations(userId?: string, limit = 6) {
    const cacheKey = `products:recommendations:${userId ?? 'guest'}:${limit}`;

    return this.cache.getOrSet(cacheKey, HOME_PRODUCTS_TTL_MS, async () => {
      if (userId) {
        // Trouver les catégories les plus achetées par l'utilisateur
        const userOrders = await this.prisma.order.findMany({
          where: { clientId: userId },
          include: { product: { select: { categoryId: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        });

        const categoryIds = [
          ...new Set(userOrders.map((o) => o.product.categoryId)),
        ];

        if (categoryIds.length > 0) {
          return this.prisma.product.findMany({
            where: {
              categoryId: { in: categoryIds },
              isPublic: true,
            } as any,
            orderBy: { totalSales: 'desc' },
            take: limit,
            include: productInclude,
          });
        }
      }

      // Fallback : produits de vendeurs les mieux notés
      return this.prisma.product.findMany({
        where: { isPublic: true } as any,
        orderBy: { user: { trustScore: 'desc' } },
        take: limit,
        include: productInclude,
      });
    });
  }

  /**
   * Récupère les produits les plus vendus sur la plateforme.
   */
  async getBestSellers(limit = 6) {
    return this.cache.getOrSet(
      `products:best-sellers:${limit}`,
      HOME_PRODUCTS_TTL_MS,
      () => {
        return this.prisma.product.findMany({
          where: {
            totalSales: { gt: 0 },
            isPublic: true,
          } as any,
          orderBy: { totalSales: 'desc' },
          take: limit,
          include: productInclude,
        });
      },
    );
  }

  /**
   * Recherche multicritère avec pagination et filtres géographiques (marché).
   */
  async findAll(query: {
    userId?: string;
    categoryId?: number;
    search?: string;
    market?: string;
    page?: number;
    limit?: number;
    onlyPublic?: boolean;
  }) {
    const {
      userId,
      categoryId,
      search,
      market,
      page = 1,
      limit = 50,
      onlyPublic,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(userId && { userId }),
      ...(categoryId && { categoryId }),
      ...(market && { market: market as any }),
      ...(onlyPublic !== undefined
        ? { isPublic: onlyPublic }
        : !userId && { isPublic: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    try {
      const items = await this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: productInclude,
      });

      const total = await this.prisma.product.count({ where });

      return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      this.logger.error(
        `Error in findAll: ${error?.message || error}`,
        error?.stack,
      );
      throw error;
    }
  }

  /**
   * Récupère TOUS les produits (publics ET brouillons) d'un vendeur spécifique.
   * Utilisé exclusivement par le tableau de bord vendeur.
   */
  async getVendorProducts(
    userId: string,
    opts?: {
      search?: string;
      categoryId?: number;
      page?: number;
      limit?: number;
    },
  ) {
    const { search, categoryId, page = 1, limit = 50 } = opts || {};
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  /**
   * Crée un nouveau produit après validation complète par les services de modération (IA).
   * Déclenche une notification broadcast aux abonnés si le produit est public.
   */
  async create(data: any, userId: string) {
    const imageUrl =
      data.image ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';

    await this.moderationService.fullValidation(
      data.name,
      data.description || '',
      Number(data.price),
      imageUrl,
    );

    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        categoryId: Number(data.categoryId),
        image: imageUrl,
        userId: userId,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        stockQuantity:
          data.stockQuantity !== undefined ? Number(data.stockQuantity) : 0,
        unit: data.unit || 'Pièce',
      } as any,
      include: { category: true },
    });

    if (product.isPublic) {
      // Exécution asynchrone pour ne pas ralentir la création
      this.notificationsService.broadcastNewProduct(product.id);
    }

    return product;
  }

  /**
   * Récupère un produit unique par son identifiant.
   */
  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
  }

  /**
   * Met à jour les informations d'un produit existant.
   * Une nouvelle validation de modération est déclenchée si l'image est modifiée.
   */
  async update(id: string, data: any, userId: string) {
    const product = await this.findOne(id);
    if (!product || product.userId !== userId) {
      throw new BadRequestException(
        "Produit introuvable ou vous n'êtes pas autorisé à le modifier.",
      );
    }

    if (data.image) {
      await this.moderationService.fullValidation(
        data.name || product.name,
        data.description || product.description,
        Number(data.price || product.price),
        data.image,
      );
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price && { price: Number(data.price) }),
        ...(data.categoryId && { categoryId: Number(data.categoryId) }),
        ...(data.image && { image: data.image }),
        ...(data.stockQuantity !== undefined && {
          stockQuantity: Number(data.stockQuantity),
        }),
        ...(data.unit && { unit: data.unit }),
        ...(data.availability && { availability: data.availability }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      } as any,
      include: { category: true },
    });

    if (!product.isPublic && updatedProduct.isPublic) {
      this.notificationsService.broadcastNewProduct(updatedProduct.id);
    }

    return updatedProduct;
  }

  /**
   * Publie un ensemble de produits en une seule opération.
   */
  async bulkPublish(ids: string[], userId: string) {
    const productsToNotify = await this.prisma.product.findMany({
      where: { id: { in: ids }, userId, isPublic: false },
      select: { id: true },
    });

    const result = await this.prisma.product.updateMany({
      where: { id: { in: ids }, userId },
      data: { isPublic: true } as any,
    });

    for (const product of productsToNotify) {
      this.notificationsService.broadcastNewProduct(product.id);
    }

    return result;
  }

  /**
   * Supprime un produit du catalogue.
   */
  async remove(id: string, userId: string) {
    const product = await this.findOne(id);
    if (!product || product.userId !== userId) {
      throw new BadRequestException(
        'Produit introuvable ou accès non autorisé.',
      );
    }

    return this.prisma.product.delete({ where: { id } });
  }

  /**
   * Fournit des suggestions de recherche basées sur les noms de produits publics.
   */
  async getSuggestions(query: string) {
    const products = await this.prisma.product.findMany({
      where: {
        isPublic: true,
        name: { contains: query, mode: 'insensitive' },
      } as any,
      select: { name: true, category: { select: { name: true } } },
      take: 20,
    });

    // Déduplication côté JS (distinct non supporté par Prisma Accelerate)
    const seen = new Set<string>();
    return products
      .filter((p) => {
        if (seen.has(p.name)) return false;
        seen.add(p.name);
        return true;
      })
      .slice(0, 8)
      .map((p) => ({
        text: p.name,
        category: p.category.name,
        type: 'product',
      }));
  }

  /**
   * Algorithme de comparaison de prix.
   * Analyse les produits similaires pour fournir des statistiques de marché (moyenne, min, max).
   */
  async compareProducts(search: string) {
    if (!search || search.trim().length < 2) {
      return { query: search, products: [] };
    }

    const products = await this.prisma.product.findMany({
      where: {
        isPublic: true,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      } as any,
      orderBy: { price: 'asc' },
      take: 20,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            fullName: true,
            boutiqueName: true,
            isVerified: true,
            trustScore: true,
            phone: true,
            city: true,
            province: true,
            avatarUrl: true,
          },
        },
      },
    });

    const prices = products.map((p) => p.price);
    const avgPrice =
      prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

    return {
      query: search,
      stats: {
        count: products.length,
        avgPrice: Math.round(avgPrice * 100) / 100,
        minPrice: prices.length > 0 ? Math.min(...prices) : 0,
        maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
      },
      products,
    };
  }
}
