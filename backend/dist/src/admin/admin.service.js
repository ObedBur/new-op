"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllUsers(filters) {
        const where = {};
        if (filters.role) {
            where.role = filters.role;
        }
        if (filters.kycStatus) {
            where.kycStatus = filters.kycStatus;
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
    async getUserDetails(userId) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            data: user,
        };
    }
    async deleteUser(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.refreshToken.deleteMany({ where: { userId } });
                await tx.notification.deleteMany({ where: { userId } });
                const userProducts = await tx.product.findMany({
                    where: { userId },
                    select: { id: true }
                });
                const productIds = userProducts.map((p) => p.id);
                if (productIds.length > 0) {
                    await tx.order.deleteMany({ where: { productId: { in: productIds } } });
                }
                await tx.order.deleteMany({
                    where: { OR: [{ clientId: userId }, { vendorId: userId }] }
                });
                await tx.product.deleteMany({ where: { userId } });
                await tx.user.delete({ where: { id: userId } });
            });
            return { success: true, message: 'User and associated data deleted successfully' };
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw new common_1.BadRequestException('Failed to delete user due to a database constraint or error');
        }
    }
    async updateKycStatus(userId, status, rejectionReason) {
        const validStatuses = Object.values(client_1.KycStatus);
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role !== 'VENDOR') {
            throw new common_1.BadRequestException('Only vendors require KYC approval');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                kycStatus: status,
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
    async getPendingKyc() {
        const pendingVendors = await this.prisma.user.findMany({
            where: {
                role: client_1.UserRole.VENDOR,
                kycStatus: client_1.KycStatus.PENDING,
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
    async getStats() {
        const [totalUsers, totalClients, totalVendors, verifiedUsers, totalProducts, salesAggregate, pendingKyc, approvedKyc,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: client_1.UserRole.CLIENT } }),
            this.prisma.user.count({ where: { role: client_1.UserRole.VENDOR } }),
            this.prisma.user.count({ where: { isVerified: true } }),
            this.prisma.product.count(),
            this.prisma.order.aggregate({ _sum: { totalPrice: true } }),
            this.prisma.user.count({ where: { role: client_1.UserRole.VENDOR, kycStatus: client_1.KycStatus.PENDING } }),
            this.prisma.user.count({ where: { role: client_1.UserRole.VENDOR, kycStatus: client_1.KycStatus.APPROVED } }),
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
    async getRecentActivities() {
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
        const orderActivities = recentOrders.map((order) => ({
            id: `ord_${order.id}`,
            type: 'order',
            description: `Nouvelle commande de ${order.customerName}`,
            timestamp: order.createdAt.toISOString(),
            metadata: {
                orderId: order.id,
                total: order.totalPrice,
                customerName: order.customerName,
            },
        }));
        const recentVendors = await this.prisma.user.findMany({
            where: { role: client_1.UserRole.VENDOR },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                fullName: true,
                boutiqueName: true,
                createdAt: true,
            },
        });
        const vendorActivities = recentVendors.map((vendor) => ({
            id: `usr_${vendor.id}`,
            type: 'vendor_registration',
            description: `Nouveau vendeur : ${vendor.boutiqueName || vendor.fullName} (${vendor.fullName})`,
            timestamp: vendor.createdAt.toISOString(),
            metadata: {
                userId: vendor.id,
                boutiqueName: vendor.boutiqueName || '',
                fullName: vendor.fullName,
            },
        }));
        const recentKycUpdates = await this.prisma.user.findMany({
            where: {
                role: client_1.UserRole.VENDOR,
                kycStatus: {
                    notIn: [client_1.KycStatus.PENDING, client_1.KycStatus.NOT_REQUIRED],
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
        const kycActivities = recentKycUpdates.map((vendor) => ({
            id: `kyc_${vendor.id}`,
            type: 'kyc_update',
            description: `Statut KYC de ${vendor.boutiqueName || vendor.fullName} passé à ${vendor.kycStatus}`,
            timestamp: vendor.updatedAt.toISOString(),
            metadata: {
                userId: vendor.id,
                boutiqueName: vendor.boutiqueName || '',
                newStatus: vendor.kycStatus,
            },
        }));
        const allActivities = [
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map