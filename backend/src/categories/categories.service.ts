import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// 
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    //  On transforme le nombre de produits en productCount pour que le frontend l'affiche
    return categories.map(cat => ({
      ...cat,
      productCount: cat._count.products
    }));
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true
      }
    });
  }
}

