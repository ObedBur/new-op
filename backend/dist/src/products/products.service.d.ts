import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ModerationService } from '../common/services/moderation.service';
export declare class ProductsService {
    private prisma;
    private moderationService;
    constructor(prisma: PrismaService, moderationService: ModerationService);
    getDeals(limit?: number): Promise<({
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
        user: {
            fullName: string;
            boutiqueName: string;
            isVerified: boolean;
            trustScore: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        userId: string;
        city: string;
        country: string;
        images: string[];
    })[]>;
    getNewArrivals(limit?: number): Promise<({
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
        user: {
            fullName: string;
            boutiqueName: string;
            isVerified: boolean;
            trustScore: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        userId: string;
        city: string;
        country: string;
        images: string[];
    })[]>;
    getRecommendations(userId?: string, limit?: number): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        userId: string;
        city: string;
        country: string;
        images: string[];
    }[]>;
    getBestSellers(limit?: number): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        userId: string;
        city: string;
        country: string;
        images: string[];
    }[]>;
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
            category: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                icon: string | null;
                colorClass: string | null;
                bgClass: string | null;
            };
            user: {
                fullName: string;
                boutiqueName: string;
                isVerified: boolean;
                trustScore: number;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            displayPrice: string | null;
            location: string | null;
            image: string | null;
            availability: import("@prisma/client").$Enums.ProductAvailability;
            market: import("@prisma/client").$Enums.Market | null;
            categoryId: number;
            userId: string;
            city: string;
            country: string;
            images: string[];
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        userId: string;
        city: string;
        country: string;
        images: string[];
    }>;
    findOne(id: string): Promise<{
        category: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
        user: {
            fullName: string;
            boutiqueName: string;
            isVerified: boolean;
            trustScore: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        userId: string;
        city: string;
        country: string;
        images: string[];
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        userId: string;
        city: string;
        country: string;
        images: string[];
    }>;
    bulkPublish(ids: string[], userId: string): Promise<Prisma.BatchPayload>;
    remove(id: string, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        userId: string;
        city: string;
        country: string;
        images: string[];
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
            category: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                icon: string | null;
                colorClass: string | null;
                bgClass: string | null;
            };
            user: {
                id: string;
                city: string;
                fullName: string;
                phone: string;
                province: string;
                boutiqueName: string;
                isVerified: boolean;
                trustScore: number;
                avatarUrl: string;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            displayPrice: string | null;
            location: string | null;
            image: string | null;
            availability: import("@prisma/client").$Enums.ProductAvailability;
            market: import("@prisma/client").$Enums.Market | null;
            categoryId: number;
            userId: string;
            city: string;
            country: string;
            images: string[];
        })[];
    }>;
}
