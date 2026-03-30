import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ModerationService } from '../common/services/moderation.service';

const productInclude = {
  category: true,
  user: {
    select: {
      fullName: true,
      boutiqueName: true,
      isVerified: true,
      trustScore: true,
    },
  },
};

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private moderationService: ModerationService,
  ) {}

  // ====== ALGORITHME 1 : OFFRES DU MOMENT ======
  // Produits en promotion (isOnSale = true) avec réduction >= 15%
  async getDeals(limit = 6) {
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
  }

  // ====== ALGORITHME 2 : NOUVEAUTÉS ======
  // Produits publiés dans les 7 derniers jours, triés par date
  async getNewArrivals(limit = 6) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.product.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        isPublic: true,
      } as any,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: productInclude,
    });
  }

  // ====== ALGORITHME 3 : RECOMMANDATIONS ======
  // Basé sur les catégories les plus commandées par l'utilisateur
  // Fallback : produits de vendeurs les mieux notés
  async getRecommendations(userId?: string, limit = 6) {
    if (userId) {
      // Trouver les catégories les plus achetées par l'utilisateur
      const userOrders = await this.prisma.order.findMany({
        where: { clientId: userId },
        include: { product: { select: { categoryId: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      const categoryIds = [...new Set(userOrders.map(o => o.product.categoryId))];

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
  }

  // ====== ALGORITHME 4 : MEILLEURES VENTES ======
  // Triés par nombre de ventes décroissant
  async getBestSellers(limit = 6) {
    return this.prisma.product.findMany({
      where: { 
        totalSales: { gt: 0 },
        isPublic: true,
      } as any,
      orderBy: { totalSales: 'desc' },
      take: limit,
      include: productInclude,
    });
  }

  // ====== LISTE GÉNÉRALE ======
  async findAll(query: {
    userId?: string;
    categoryId?: number;
    search?: string;
    market?: string;
    page?: number;
    limit?: number;
    onlyPublic?: boolean;
  }) {
    const { userId, categoryId, search, market, page = 1, limit = 10, onlyPublic } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(userId && { userId }),
      ...(categoryId && { categoryId }),
      ...(market && { market: market as any }),
      ...(onlyPublic !== undefined ? { isPublic: onlyPublic } : !userId && { isPublic: true }),
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
        include: productInclude,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async create(data: any, userId: string) {
    let imageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
    if (data.image) {
      imageUrl = data.image;
    }

    // 1. Modération automatique complète (IA Texte + IA Image + Qualité)
    await this.moderationService.fullValidation(
      data.name, 
      data.description || '', 
      Number(data.price),
      imageUrl
    );

    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        categoryId: Number(data.categoryId),
        image: imageUrl,
        userId: userId,
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
      } as any,
      include: {
        category: true,
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
  }

  async update(id: string, data: any, userId: string) {
    const product = await this.findOne(id);
    if (!product || product.userId !== userId) {
      throw new BadRequestException({ message: "Produit non trouvé ou non autorisé." });
    }

    if (data.image) {
      await this.moderationService.fullValidation(
        data.name || product.name,
        data.description || product.description,
        Number(data.price || product.price),
        data.image
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price && { price: Number(data.price) }),
        ...(data.categoryId && { categoryId: Number(data.categoryId) }),
        ...(data.image && { image: data.image }),
        ...(data.stock !== undefined && { stock: Number(data.stock) }),
        ...(data.availability && { availability: data.availability }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      } as any,
      include: {
        category: true,
      }
    });
  }

  async bulkPublish(ids: string[], userId: string) {
    return this.prisma.product.updateMany({
      where: {
        id: { in: ids },
        userId: userId,
      },
      data: {
        isPublic: true,
      } as any,
    });
  }

  async remove(id: string, userId: string) {
    const product = await this.findOne(id);
    if (!product || product.userId !== userId) {
      throw new BadRequestException({ message: "Produit non trouvé ou non autorisé." });
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  // ====== COMPARATEUR DE PRIX ======
  // Recherche tous les produits ayant un nom "similaire" + regroupe par différents vendeurs
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

    // Calcul statistiques
    const prices = products.map((p) => p.price);
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      query: search,
      stats: {
        count: products.length,
        avgPrice: Math.round(avgPrice * 100) / 100,
        minPrice,
        maxPrice,
      },
      products,
    };
  }
}
