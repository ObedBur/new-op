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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const moderation_service_1 = require("../common/services/moderation.service");
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
let ProductsService = class ProductsService {
    constructor(prisma, moderationService) {
        this.prisma = prisma;
        this.moderationService = moderationService;
    }
    async getDeals(limit = 6) {
        return this.prisma.product.findMany({
            where: {
                isOnSale: true,
                originalPrice: { not: null },
                isPublic: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: productInclude,
        });
    }
    async getNewArrivals(limit = 6) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return this.prisma.product.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                isPublic: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: productInclude,
        });
    }
    async getRecommendations(userId, limit = 6) {
        if (userId) {
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
                    },
                    orderBy: { totalSales: 'desc' },
                    take: limit,
                    include: productInclude,
                });
            }
        }
        return this.prisma.product.findMany({
            where: { isPublic: true },
            orderBy: { user: { trustScore: 'desc' } },
            take: limit,
            include: productInclude,
        });
    }
    async getBestSellers(limit = 6) {
        return this.prisma.product.findMany({
            where: {
                totalSales: { gt: 0 },
                isPublic: true,
            },
            orderBy: { totalSales: 'desc' },
            take: limit,
            include: productInclude,
        });
    }
    async findAll(query) {
        const { userId, categoryId, search, market, page = 1, limit = 10, onlyPublic } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(userId && { userId }),
            ...(categoryId && { categoryId }),
            ...(market && { market: market }),
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
    async create(data, userId) {
        let imageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
        if (data.image) {
            imageUrl = data.image;
        }
        await this.moderationService.fullValidation(data.name, data.description || '', Number(data.price), imageUrl);
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                categoryId: Number(data.categoryId),
                image: imageUrl,
                userId: userId,
                isPublic: data.isPublic !== undefined ? data.isPublic : true,
            },
            include: {
                category: true,
            }
        });
    }
    async findOne(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: productInclude,
        });
    }
    async update(id, data, userId) {
        const product = await this.findOne(id);
        if (!product || product.userId !== userId) {
            throw new common_1.BadRequestException({ message: "Produit non trouvé ou non autorisé." });
        }
        if (data.image) {
            await this.moderationService.fullValidation(data.name || product.name, data.description || product.description, Number(data.price || product.price), data.image);
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
            },
            include: {
                category: true,
            }
        });
    }
    async bulkPublish(ids, userId) {
        return this.prisma.product.updateMany({
            where: {
                id: { in: ids },
                userId: userId,
            },
            data: {
                isPublic: true,
            },
        });
    }
    async remove(id, userId) {
        const product = await this.findOne(id);
        if (!product || product.userId !== userId) {
            throw new common_1.BadRequestException({ message: "Produit non trouvé ou non autorisé." });
        }
        return this.prisma.product.delete({
            where: { id },
        });
    }
    async compareProducts(search) {
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
            },
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        moderation_service_1.ModerationService])
], ProductsService);
//# sourceMappingURL=products.service.js.map