import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, UserRole, KycStatus } from '@prisma/client';
import { ActivityDto } from './dto/activity.dto';

@Injectable()
export class AdminService {
  /**
   * Le service Admin gre les oprations rserves aux administrateurs :
   * gestion des utilisateurs, validation KYC et statistiques globales.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Rcupre la liste pagine et filtre de tous les utilisateurs
   */
  async getAllUsers(filters: {
    role?: string;
    kycStatus?: string;
    page: number;
    limit: number;
  }) {
    const where: Prisma.UserWhereInput = {};

    if (filters.role) {
      where.role = filters.role as UserRole;
    }

    if (filters.kycStatus) {
      where.kycStatus = filters.kycStatus as KycStatus;
    }

    const skip = (filters.page - 1) * filters.limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          boutiqueName: true,
          kycStatus: true,
          isVerified: true,
          trustScore: true,
          province: true,
          commune: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: filters.limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      success: true,
      data: users,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        pages: Math.ceil(total / filters.limit),
      },
    };
  }

  /**
   * Rcupre les dtails complets d'un utilisateur spcifique par son ID
   */
  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        boutiqueName: true,
        kycStatus: true,
        isVerified: true,
        trustScore: true,
        province: true,
        commune: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: user,
    };
  }

  /**
   * Supprime compltement un utilisateur et toutes ses donnes associes
   */
  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Delete RefreshTokens and Notifications
        await tx.refreshToken.deleteMany({ where: { userId } });
        await tx.notification.deleteMany({ where: { userId } });

        // 2. Identify products owned by this user
        const userProducts = await tx.product.findMany({
          where: { userId },
          select: { id: true }
        });
        const productIds = userProducts.map((p) => p.id);

        // 3. Delete Orders associated with user's products
        if (productIds.length > 0) {
          await tx.order.deleteMany({ where: { productId: { in: productIds } } });
        }

        // 4. Delete Orders where user is client or vendor directly
        await tx.order.deleteMany({
          where: { OR: [{ clientId: userId }, { vendorId: userId }] }
        });

        // 5. Delete Products owned by this user
        await tx.product.deleteMany({ where: { userId } });

        // 6. Delete the User
        await tx.user.delete({ where: { id: userId } });
      });

      return { success: true, message: 'User and associated data deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new BadRequestException('Failed to delete user due to a database constraint or error');
    }
  }

  /**
   * Approuve ou rejette le dossier KYC d'un vendeur
   */
  async updateKycStatus(userId: string, status: string, rejectionReason?: string) {
    // Valider le statut
    const validStatuses: string[] = Object.values(KycStatus);
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Vrifier que l'utilisateur existe et est un vendeur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'VENDOR') {
      throw new BadRequestException('Only vendors require KYC approval');
    }

    // Mettre  jour le statut
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: status as KycStatus,
        trustScore: status === 'APPROVED' ? user.trustScore + 30 : user.trustScore,
      },
    });

    console.log(` KYC ${status} for vendor: ${user.email}`);

    return {
      success: true,
      message: `KYC status updated to ${status}`,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        kycStatus: updatedUser.kycStatus,
        trustScore: updatedUser.trustScore,
      },
    };
  }

  /**
   * Rcupre la liste des vendeurs dont le KYC est en attente
   */
  async getPendingKyc() {
    const pendingVendors = await this.prisma.user.findMany({
      where: {
        role: UserRole.VENDOR,
        kycStatus: KycStatus.PENDING,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        boutiqueName: true,
        province: true,
        commune: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      count: pendingVendors.length,
      data: pendingVendors,
    };
  }

  /**
   * Calcule les statistiques globales de la plateforme
   * (utilisateurs, vendeurs, KYC, produits, ventes)
   */
  async getStats() {
    const [
      totalUsers,
      totalClients,
      totalVendors,
      verifiedUsers,
      totalProducts,
      salesAggregate,
      pendingKyc,
      approvedKyc,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.CLIENT } }),
      this.prisma.user.count({ where: { role: UserRole.VENDOR } }),
      this.prisma.user.count({ where: { isVerified: true } }),
      this.prisma.product.count(),
      this.prisma.order.aggregate({ _sum: { totalPrice: true } }),
      this.prisma.user.count({ where: { role: UserRole.VENDOR, kycStatus: KycStatus.PENDING } }),
      this.prisma.user.count({ where: { role: UserRole.VENDOR, kycStatus: KycStatus.APPROVED } }),
    ]);

    return {
      success: true,
      data: {
        users: {
          total: totalUsers,
          clients: totalClients,
          vendors: totalVendors,
          verified: verifiedUsers,
        },
        products: {
          total: totalProducts,
        },
        sales: {
          total: salesAggregate._sum.totalPrice || 0,
        },
        kyc: {
          pending: pendingKyc,
          approved: approvedKyc,
        },
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Récupère les activités récentes de la plateforme.
   * Les résultats sont fusionnés, triés par timestamp décroissant, et limités à 10.
   */
  async getRecentActivities(): Promise<{ success: boolean; data: ActivityDto[] }> {
    // ── 1. Dernières commandes ──────────────────────────────────────
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        customerName: true,
        totalPrice: true,
        createdAt: true,
      },
    });

    const orderActivities: ActivityDto[] = recentOrders.map((order) => ({
      id: `ord_${order.id}`,
      type: 'order' as const,
      description: `Nouvelle commande de ${order.customerName}`,
      timestamp: order.createdAt.toISOString(),
      metadata: {
        orderId: order.id,
        total: order.totalPrice,
        customerName: order.customerName,
      },
    }));

    // ── 2. Derniers vendeurs inscrits ───────────────────────────────
    const recentVendors = await this.prisma.user.findMany({
      where: { role: UserRole.VENDOR },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        boutiqueName: true,
        createdAt: true,
      },
    });

    const vendorActivities: ActivityDto[] = recentVendors.map((vendor) => ({
      id: `usr_${vendor.id}`,
      type: 'vendor_registration' as const,
      description: `Nouveau vendeur : ${vendor.boutiqueName || vendor.fullName} (${vendor.fullName})`,
      timestamp: vendor.createdAt.toISOString(),
      metadata: {
        userId: vendor.id,
        boutiqueName: vendor.boutiqueName || '',
        fullName: vendor.fullName,
      },
    }));

    // ── 3. Dernières mises à jour KYC ──────────────────────────────
    const recentKycUpdates = await this.prisma.user.findMany({
      where: {
        role: UserRole.VENDOR,
        kycStatus: {
          notIn: [KycStatus.PENDING, KycStatus.NOT_REQUIRED],
        },
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        boutiqueName: true,
        kycStatus: true,
        updatedAt: true,
      },
    });

    const kycActivities: ActivityDto[] = recentKycUpdates.map((vendor) => ({
      id: `kyc_${vendor.id}`,
      type: 'kyc_update' as const,
      description: `Statut KYC de ${vendor.boutiqueName || vendor.fullName} passé à ${vendor.kycStatus}`,
      timestamp: vendor.updatedAt.toISOString(),
      metadata: {
        userId: vendor.id,
        boutiqueName: vendor.boutiqueName || '',
        newStatus: vendor.kycStatus,
      },
    }));

    // ── Fusion + tri par date décroissante + limite à 10 ───────────
    const allActivities: ActivityDto[] = [
      ...orderActivities,
      ...vendorActivities,
      ...kycActivities,
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      success: true,
      data: allActivities,
    };
  }
}
