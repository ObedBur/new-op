import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductAvailability, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async findForUser(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        product: {
          include: {
            user: {
              select: {
                fullName: true,
                boutiqueName: true,
                isVerified: true,
                trustScore: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  async addItem(userId: string, dto: CartItemDto) {
    const product = await this.getAvailableProduct(dto.productId);
    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId: dto.productId } },
    });

    const nextQuantity = existing ? existing.quantity + dto.quantity : dto.quantity;
    this.assertQuantityAvailable(product, nextQuantity);

    await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId: dto.productId } },
      create: { userId, productId: dto.productId, quantity: dto.quantity },
      update: { quantity: nextQuantity },
    });

    return this.findForUser(userId);
  }

  async setQuantity(userId: string, productId: string, quantity: number) {
    const product = await this.getAvailableProduct(productId);
    this.assertQuantityAvailable(product, quantity);

    await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId, quantity },
      update: { quantity },
    });

    return this.findForUser(userId);
  }

  async removeItem(userId: string, productId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId, productId } });
    return this.findForUser(userId);
  }

  async clear(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return [];
  }

  async merge(userId: string, items: CartItemDto[]) {
    if (!items.length) return this.findForUser(userId);

    const groupedItems = Array.from(
      items.reduce((acc, item) => {
        acc.set(item.productId, (acc.get(item.productId) || 0) + item.quantity);
        return acc;
      }, new Map<string, number>()),
    ).map(([productId, quantity]) => ({ productId, quantity }));

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: groupedItems.map(item => item.productId) },
        isPublic: true,
        availability: { not: ProductAvailability.OUT_OF_STOCK },
        user: { isActive: true, role: UserRole.VENDOR },
      },
      select: { id: true, stockQuantity: true },
    });

    const productById = new Map(products.map(product => [product.id, product]));

    await this.prisma.$transaction(
      groupedItems
        .map(item => {
          const product = productById.get(item.productId);
          if (!product) return null;

          const cappedQuantity =
            product.stockQuantity !== null && product.stockQuantity !== undefined
              ? Math.min(item.quantity, product.stockQuantity)
              : item.quantity;

          if (cappedQuantity < 1) return null;

          return this.prisma.cartItem.upsert({
            where: { userId_productId: { userId, productId: item.productId } },
            create: { userId, productId: item.productId, quantity: cappedQuantity },
            update: { quantity: { increment: cappedQuantity } },
          });
        })
        .filter((operation): operation is NonNullable<typeof operation> => Boolean(operation)),
    );

    await this.clampUserCartToStock(userId);
    return this.findForUser(userId);
  }

  private async getAvailableProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { user: true },
    });

    if (!product) {
      throw new NotFoundException('Produit introuvable.');
    }

    if (!product.isPublic || product.availability === ProductAvailability.OUT_OF_STOCK) {
      throw new BadRequestException(`"${product.name}" n'est plus disponible.`);
    }

    if (!product.user?.isActive || product.user.role !== UserRole.VENDOR) {
      throw new BadRequestException(`Le vendeur de "${product.name}" n'est pas disponible.`);
    }

    return product;
  }

  private assertQuantityAvailable(product: { name: string; stockQuantity: number | null }, quantity: number) {
    if (quantity < 1) {
      throw new BadRequestException('La quantité doit être supérieure à zéro.');
    }

    if (
      product.stockQuantity !== null &&
      product.stockQuantity !== undefined &&
      quantity > product.stockQuantity
    ) {
      throw new BadRequestException(
        `Stock insuffisant pour "${product.name}". Disponible : ${product.stockQuantity}.`,
      );
    }
  }

  private async clampUserCartToStock(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    await this.prisma.$transaction(
      items
        .map(item => {
          if (
            !item.product.isPublic ||
            item.product.availability === ProductAvailability.OUT_OF_STOCK ||
            item.product.stockQuantity === 0
          ) {
            return this.prisma.cartItem.delete({ where: { id: item.id } });
          }

          if (
            item.product.stockQuantity !== null &&
            item.product.stockQuantity !== undefined &&
            item.quantity > item.product.stockQuantity
          ) {
            return this.prisma.cartItem.update({
              where: { id: item.id },
              data: { quantity: item.product.stockQuantity },
            });
          }

          return null;
        })
        .filter((operation): operation is NonNullable<typeof operation> => Boolean(operation)),
    );
  }
}
