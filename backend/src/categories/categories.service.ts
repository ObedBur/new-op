import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppCacheService } from '../common/services/app-cache.service';

const CATEGORIES_CACHE_KEY = 'categories:all';
const CATEGORIES_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private cache: AppCacheService,
  ) {}

  async findAll() {
    return this.cache.getOrSet(
      CATEGORIES_CACHE_KEY,
      CATEGORIES_TTL_MS,
      async () => {
        const categories = await this.prisma.category.findMany({
          include: {
            _count: {
              select: { products: true },
            },
          },
        });

        // To match frontend expected type 'productCount'
        return categories.map((cat) => ({
          ...cat,
          productCount: cat._count.products,
        }));
      },
    );
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }
}
