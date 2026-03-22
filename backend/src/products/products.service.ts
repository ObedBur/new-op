import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
  constructor(private prisma: PrismaService) {}

  // ====== ALGORITHME 1 : OFFRES DU MOMENT ======
  // Produits en promotion (isOnSale = true) avec réduction >= 15%
  async getDeals(limit = 6) {
    return this.prisma.product.findMany({
      where: {
        isOnSale: true,
        originalPrice: { not: null },
      },
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
      },
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
          where: { categoryId: { in: categoryIds } },
          orderBy: { totalSales: 'desc' },
          take: limit,
          include: productInclude,
        });
      }
    }

    // Fallback : produits de vendeurs les mieux notés
    return this.prisma.product.findMany({
      orderBy: { user: { trustScore: 'desc' } },
      take: limit,
      include: productInclude,
    });
  }

  // ====== ALGORITHME 4 : MEILLEURES VENTES ======
  // Triés par nombre de ventes décroissant
  async getBestSellers(limit = 6) {
    return this.prisma.product.findMany({
      where: { totalSales: { gt: 0 } },
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
  }) {
    const { userId, categoryId, search, market, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(userId && { userId }),
      ...(categoryId && { categoryId }),
      ...(market && { market: market as any }),
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

    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        categoryId: Number(data.categoryId),
        image: imageUrl,
        userId: userId,
      },
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
}
