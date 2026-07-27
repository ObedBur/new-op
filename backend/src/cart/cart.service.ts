import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProductAvailability, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CartItemDto } from './dto/cart-item.dto';

// ─── Types locaux ────────────────────────────────────────────────────────────

/** Champs stock exposés aux méthodes de validation */
type ProductStock = {
  name: string;
  stockQuantity: number | null;
};

/** Champs stock d'un produit récupéré lors du merge */
type ProductStockEntry = {
  id: string;
  stockQuantity: number | null;
};

/**
 * CartItem avec son produit (sans vendeur).
 * Utilisé par clampCartToStock → on n'a besoin que du stock.
 */
type CartItemWithStock = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

// ─── Constantes de projection ────────────────────────────────────────────────

/** Champs du vendeur exposés dans la réponse panier */
const VENDOR_FIELDS: Prisma.UserSelect = {
  fullName: true,
  boutiqueName: true,
  isVerified: true,
  trustScore: true,
  phone: true,
};

/** Include Prisma réutilisé par findForUser */
const CART_ITEM_INCLUDE: Prisma.CartItemInclude = {
  product: {
    include: {
      user: { select: VENDOR_FIELDS },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // ══════════════════════════════════════════
  // LECTURE
  // ══════════════════════════════════════════

  async findForUser(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: CART_ITEM_INCLUDE,
    });
  }

  // ══════════════════════════════════════════
  // ÉCRITURE
  // ══════════════════════════════════════════

  async addItem(userId: string, dto: CartItemDto) {
    const product = await this.getAvailableProduct(dto.productId);

    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId: dto.productId } },
      select: { quantity: true },
    });

    const nextQuantity = (existing?.quantity ?? 0) + dto.quantity;
    this.assertStockSufficient(product, nextQuantity);

    await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId: dto.productId } },
      create: { userId, productId: dto.productId, quantity: dto.quantity },
      update: { quantity: nextQuantity },
    });

    return this.findForUser(userId);
  }

  async setQuantity(userId: string, productId: string, quantity: number) {
    const product = await this.getAvailableProduct(productId);
    this.assertStockSufficient(product, quantity);

    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { version: true },
    });

    // Création si le produit n'est pas encore dans le panier
    if (!existing) {
      await this.prisma.cartItem.create({
        data: { userId, productId, quantity },
      });
      return this.findForUser(userId);
    }

    // Mise à jour conditionnelle (optimistic locking) :
    // updateMany accepte userId + productId séparés, pas la clé composite.
    // Si la version a changé entre la lecture et l'écriture → 0 lignes affectées.
    const result = await this.prisma.cartItem.updateMany({
      where: { userId, productId, version: existing.version },
      data: {
        quantity,
        version: { increment: 1 },
      },
    });

    if (result.count === 0) {
      throw new ConflictException(
        'Le panier a été modifié par un autre appareil. Rechargez votre panier.',
      );
    }

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
    if (items.length === 0) return this.findForUser(userId);

    const deduped = this.deduplicateByProduct(items);
    const availableProducts = await this.fetchAvailableProducts(
      deduped.map((i) => i.productId),
    );
    const productMap = new Map(availableProducts.map((p) => [p.id, p]));

    const upsertOps = deduped
      .map((item) => this.buildMergeUpsert(userId, item, productMap))
      .filter((op): op is Prisma.PrismaPromise<unknown> => op !== null);

    if (upsertOps.length > 0) {
      await this.prisma.$transaction(upsertOps);
    }

    await this.clampCartToStock(userId);
    return this.findForUser(userId);
  }

  // ══════════════════════════════════════════
  // HELPERS PRIVÉS — Validation
  // ══════════════════════════════════════════

  private async getAvailableProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { user: true },
    });

    if (!product) {
      throw new NotFoundException('Produit introuvable.');
    }

    if (
      !product.isPublic ||
      product.availability === ProductAvailability.OUT_OF_STOCK
    ) {
      throw new BadRequestException(`"${product.name}" n'est plus disponible.`);
    }

    if (!product.user?.isActive || product.user.role !== UserRole.VENDOR) {
      throw new BadRequestException(
        `Le vendeur de "${product.name}" n'est pas disponible.`,
      );
    }

    return product;
  }

  private assertStockSufficient(product: ProductStock, quantity: number): void {
    if (quantity < 1) {
      throw new BadRequestException('La quantité doit être supérieure à zéro.');
    }

    const { stockQuantity } = product;
    const isLimitedStock =
      stockQuantity !== null && stockQuantity !== undefined;

    if (isLimitedStock && quantity > stockQuantity) {
      throw new BadRequestException(
        `Stock insuffisant pour "${product.name}". Disponible : ${stockQuantity}.`,
      );
    }
  }

  // ══════════════════════════════════════════
  // HELPERS PRIVÉS — Merge
  // ══════════════════════════════════════════

  /**
   * Fusionne les doublons d'un même produit dans la liste d'items invité.
   * Exemple : [{productId: "A", qty: 2}, {productId: "A", qty: 3}] → [{productId: "A", qty: 5}]
   */
  private deduplicateByProduct(items: CartItemDto[]): CartItemDto[] {
    const quantityByProduct = items.reduce((acc, item) => {
      acc.set(item.productId, (acc.get(item.productId) ?? 0) + item.quantity);
      return acc;
    }, new Map<string, number>());

    return Array.from(quantityByProduct.entries()).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      }),
    );
  }

  private async fetchAvailableProducts(
    productIds: string[],
  ): Promise<ProductStockEntry[]> {
    return this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        isPublic: true,
        availability: { not: ProductAvailability.OUT_OF_STOCK },
        user: { isActive: true, role: UserRole.VENDOR },
      },
      select: { id: true, stockQuantity: true },
    });
  }

  private buildMergeUpsert(
    userId: string,
    item: CartItemDto,
    productMap: Map<string, ProductStockEntry>,
  ): Prisma.PrismaPromise<unknown> | null {
    const product = productMap.get(item.productId);
    if (!product) return null;

    const quantity = this.capToStock(item.quantity, product.stockQuantity);
    if (quantity < 1) return null;

    return this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId: item.productId } },
      create: { userId, productId: item.productId, quantity },
      update: { quantity: { increment: quantity } },
    });
  }

  // ══════════════════════════════════════════
  // HELPERS PRIVÉS — Normalisation du stock
  // ══════════════════════════════════════════

  /**
   * Plafonne la quantité demandée au stock réel disponible.
   * Retourne la quantité inchangée si le produit n'a pas de limite de stock.
   */
  private capToStock(quantity: number, stockQuantity: number | null): number {
    if (stockQuantity === null || stockQuantity === undefined) return quantity;
    return Math.min(quantity, stockQuantity);
  }

  /**
   * Après un merge, supprime les items hors stock et recalibres
   * les quantités qui dépassent le stock actuel du produit.
   */
  private async clampCartToStock(userId: string): Promise<void> {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    const ops = items
      .map((item) => this.buildClampOperation(item))
      .filter((op): op is Prisma.PrismaPromise<unknown> => op !== null);

    if (ops.length > 0) {
      await this.prisma.$transaction(ops);
    }
  }

  private buildClampOperation(
    item: CartItemWithStock,
  ): Prisma.PrismaPromise<unknown> | null {
    const { product } = item;

    const isUnavailable =
      !product.isPublic ||
      product.availability === ProductAvailability.OUT_OF_STOCK ||
      product.stockQuantity === 0;

    if (isUnavailable) {
      return this.prisma.cartItem.delete({ where: { id: item.id } });
    }

    const { stockQuantity } = product;
    const exceedsStock =
      stockQuantity !== null &&
      stockQuantity !== undefined &&
      item.quantity > stockQuantity;

    if (exceedsStock) {
      return this.prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: stockQuantity },
      });
    }

    return null;
  }
}
