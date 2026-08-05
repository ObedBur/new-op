import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, UserRole, KycStatus } from '@prisma/client';
import { ActivityDto } from './dto/activity.dto';

/**
 * Service d'administration de la plateforme.
 * Responsable de la gestion des utilisateurs, de la validation KYC,
 * du calcul des statistiques globales et du suivi de l'activité.
 */
@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) { }

  /**
   * Récupère la liste paginée et filtrée de tous les utilisateurs.
   * Permet de filtrer par rôle (CLIENT, VENDOR) et statut KYC.
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
   * Récupère les détails complets d'un utilisateur par son identifiant unique.
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
      throw new NotFoundException({
        code: 'ADMIN_USER_NOT_FOUND',
        message: 'Utilisateur introuvable',
      });
    }

    return {
      success: true,
      data: user,
    };
  }

  /**
   * Supprime un utilisateur et purge toutes ses données associées de manière atomique.
   * Gère la suppression des produits, commandes (en tant que client ou vendeur), 
   * notifications et tokens de session.
   */
  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({
        code: 'ADMIN_USER_NOT_FOUND',
        message: 'Utilisateur introuvable',
      });
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        // Suppression des données de session et notifications
        await tx.refreshToken.deleteMany({ where: { userId } });
        await tx.notification.deleteMany({ where: { userId } });

        // Identification et suppression des dépendances liées aux produits
        const userProducts = await tx.product.findMany({
          where: { userId },
          select: { id: true }
        });
        const productIds = userProducts.map((p) => p.id);

        if (productIds.length > 0) {
          await tx.order.deleteMany({ where: { productId: { in: productIds } } });
        }

        // Suppression des commandes où l'utilisateur est impliqué directement
        await tx.order.deleteMany({
          where: { OR: [{ clientId: userId }, { vendorId: userId }] }
        });

        await tx.product.deleteMany({ where: { userId } });
        await tx.user.delete({ where: { id: userId } });
      });

      return { success: true, message: 'Utilisateur et données associées supprimés avec succès' };
    } catch (error) {
      this.logger.error(`Erreur lors de la suppression de l'utilisateur ${userId}:`, error);
      throw new BadRequestException({
        code: 'ADMIN_USER_DELETE_CONSTRAINT',
        message: 'Impossible de supprimer l\'utilisateur à cause d\'une contrainte de base de données.',
      });
    }
  }

  /**
   * Valide ou rejette un dossier KYC.
   * L'approbation augmente le score de confiance initial du vendeur (+30 points).
   */
  async updateKycStatus(userId: string, status: string, rejectionReason?: string) {
    const validStatuses: string[] = Object.values(KycStatus);
    if (!validStatuses.includes(status)) {
      throw new BadRequestException({
        code: 'ADMIN_INVALID_STATUS',
        message: `Statut invalide. Doit être parmi : ${validStatuses.join(', ')}`,
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'ADMIN_USER_NOT_FOUND',
        message: 'Utilisateur introuvable',
      });
    }

    if (user.role !== 'VENDOR') {
      throw new BadRequestException({
        code: 'ADMIN_KYC_VENDOR_ONLY',
        message: 'Seuls les vendeurs nécessitent une approbation KYC.',
      });
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: status as KycStatus,
        trustScore: status === 'APPROVED' ? user.trustScore + 30 : user.trustScore,
      },
    });

    this.logger.log(`Statut KYC mis à jour (${status}) pour le vendeur : ${user.email}`);

    return {
      success: true,
      message: `Statut KYC mis à jour : ${status}`,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        kycStatus: updatedUser.kycStatus,
        trustScore: updatedUser.trustScore,
      },
    };
  }

  /**
   * Récupère la liste des vendeurs en attente de validation KYC.
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
   * Calcule les indicateurs clés de performance (KPI) de la plateforme.
   * Agrège les données des utilisateurs, produits, ventes et dossiers KYC.
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
   * Analyse et agrège les activités récentes sur la plateforme.
   * Fusionne les nouvelles commandes, inscriptions de vendeurs et validations KYC.
   */
  async getRecentActivities(): Promise<{ success: boolean; data: ActivityDto[] }> {
    // Collecte des commandes récentes
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, customerName: true, totalPrice: true, createdAt: true },
    });

    const orderActivities: ActivityDto[] = recentOrders.map((order) => ({
      id: `ord_${order.id}`,
      type: 'order' as const,
      description: `Nouvelle commande de ${order.customerName}`,
      timestamp: order.createdAt.toISOString(),
      metadata: { orderId: order.id, total: order.totalPrice, customerName: order.customerName },
    }));

    // Collecte des nouveaux vendeurs
    const recentVendors = await this.prisma.user.findMany({
      where: { role: UserRole.VENDOR },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, fullName: true, boutiqueName: true, createdAt: true },
    });

    const vendorActivities: ActivityDto[] = recentVendors.map((vendor) => ({
      id: `usr_${vendor.id}`,
      type: 'vendor_registration' as const,
      description: `Nouveau vendeur : ${vendor.boutiqueName || vendor.fullName}`,
      timestamp: vendor.createdAt.toISOString(),
      metadata: { userId: vendor.id, boutiqueName: vendor.boutiqueName || '', fullName: vendor.fullName },
    }));

    // Collecte des mises à jour KYC récentes
    const recentKycUpdates = await this.prisma.user.findMany({
      where: {
        role: UserRole.VENDOR,
        kycStatus: { notIn: [KycStatus.PENDING, KycStatus.NOT_REQUIRED] },
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, fullName: true, boutiqueName: true, kycStatus: true, updatedAt: true },
    });

    const kycActivities: ActivityDto[] = recentKycUpdates.map((vendor) => ({
      id: `kyc_${vendor.id}`,
      type: 'kyc_update' as const,
      description: `Statut KYC de ${vendor.boutiqueName || vendor.fullName} passé à ${vendor.kycStatus}`,
      timestamp: vendor.updatedAt.toISOString(),
      metadata: { userId: vendor.id, boutiqueName: vendor.boutiqueName || '', newStatus: vendor.kycStatus },
    }));

    // Fusion, tri chronologique et limitation du flux d'activité
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
