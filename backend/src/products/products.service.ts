import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

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
        include: {
          category: true,
          user: {
            select: {
              fullName: true,
              boutiqueName: true,
              isVerified: true,
              trustScore: true,
            },
          },
        },
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
    // data contains: name, description, price, categoryId, and optional image (base64 string)

    // Default mock image if no real image uploaded/handled
    let imageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';

    // Since images are now sent as base64 string directly in the payload
    if (data.image) {
      imageUrl = data.image; // Keep base64 string or convert later to cloud storage
    }

    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        categoryId: Number(data.categoryId),
        image: imageUrl,
        userId: userId,
        // Availability, city, country have defaults in schema if not provided
      },
      include: {
        category: true,
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            fullName: true,
            boutiqueName: true,
            isVerified: true,
            trustScore: true,
          },
        },
      },
    });
  }
}

