import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ModerationService } from '../common/services/moderation.service';
export declare class ProductsService {
    private prisma;
    private moderationService;
    constructor(prisma: PrismaService, moderationService: ModerationService);
    getDeals(limit?: number): Promise<({
        user: {
            fullName: string;
            boutiqueName: string;
            isVerified: boolean;
            trustScore: number;
        };
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
    } & {
        city: string;
        country: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        isOnSale: boolean;
        totalSales: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        images: string[];
        isPublic: boolean;
    })[]>;
    getNewArrivals(limit?: number): Promise<({
        user: {
            fullName: string;
            boutiqueName: string;
            isVerified: boolean;
            trustScore: number;
        };
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
    } & {
        city: string;
        country: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        isOnSale: boolean;
        totalSales: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        images: string[];
        isPublic: boolean;
    })[]>;
    getRecommendations(userId?: string, limit?: number): Promise<({
        user: {
            fullName: string;
            boutiqueName: string;
            isVerified: boolean;
            trustScore: number;
        };
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
    } & {
        city: string;
        country: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        isOnSale: boolean;
        totalSales: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        images: string[];
        isPublic: boolean;
    })[]>;
    getBestSellers(limit?: number): Promise<({
        user: {
            fullName: string;
            boutiqueName: string;
            isVerified: boolean;
            trustScore: number;
        };
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
    } & {
        city: string;
        country: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        isOnSale: boolean;
        totalSales: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        images: string[];
        isPublic: boolean;
    })[]>;
    findAll(query: {
        userId?: string;
        categoryId?: number;
        search?: string;
        market?: string;
        page?: number;
        limit?: number;
        onlyPublic?: boolean;
    }): Promise<{
        items: ({
            user: {
                fullName: string;
                boutiqueName: string;
                isVerified: boolean;
                trustScore: number;
            };
            category: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                icon: string | null;
                colorClass: string | null;
                bgClass: string | null;
            };
        } & {
            city: string;
            country: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            price: number;
            originalPrice: number | null;
            isOnSale: boolean;
            totalSales: number;
            displayPrice: string | null;
            location: string | null;
            image: string | null;
            availability: import("@prisma/client").$Enums.ProductAvailability;
            market: import("@prisma/client").$Enums.Market | null;
            categoryId: number;
            images: string[];
            isPublic: boolean;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    create(data: any, userId: string): Promise<{
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
    } & {
        city: string;
        country: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        isOnSale: boolean;
        totalSales: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        images: string[];
        isPublic: boolean;
    }>;
    findOne(id: string): Promise<{
        user: {
            fullName: string;
            boutiqueName: string;
            isVerified: boolean;
            trustScore: number;
        };
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
    } & {
        city: string;
        country: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        isOnSale: boolean;
        totalSales: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        images: string[];
        isPublic: boolean;
    }>;
    update(id: string, data: any, userId: string): Promise<{
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
    } & {
        city: string;
        country: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        isOnSale: boolean;
        totalSales: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        images: string[];
        isPublic: boolean;
    }>;
    bulkPublish(ids: string[], userId: string): Promise<Prisma.BatchPayload>;
    remove(id: string, userId: string): Promise<{
        city: string;
        country: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        isOnSale: boolean;
        totalSales: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        images: string[];
        isPublic: boolean;
    }>;
    compareProducts(search: string): Promise<{
        query: string;
        products: any[];
        stats?: undefined;
    } | {
        query: string;
        stats: {
            count: number;
            avgPrice: number;
            minPrice: number;
            maxPrice: number;
        };
        products: ({
            user: {
                fullName: string;
                phone: string;
                province: string;
                city: string;
                boutiqueName: string;
                id: string;
                isVerified: boolean;
                trustScore: number;
                avatarUrl: string;
            };
            category: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                icon: string | null;
                colorClass: string | null;
                bgClass: string | null;
            };
        } & {
            city: string;
            country: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            price: number;
            originalPrice: number | null;
            isOnSale: boolean;
            totalSales: number;
            displayPrice: string | null;
            location: string | null;
            image: string | null;
            availability: import("@prisma/client").$Enums.ProductAvailability;
            market: import("@prisma/client").$Enums.Market | null;
            categoryId: number;
            images: string[];
            isPublic: boolean;
        })[];
    }>;
}
