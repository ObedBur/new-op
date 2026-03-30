import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        categoryId?: number;
        search?: string;
        market?: string;
        page?: number;
        limit?: number;
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
            displayPrice: string | null;
            location: string | null;
            image: string | null;
            availability: import("@prisma/client").$Enums.ProductAvailability;
            market: import("@prisma/client").$Enums.Market | null;
            categoryId: number;
            images: string[];
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
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
        displayPrice: string | null;
        location: string | null;
        image: string | null;
        availability: import("@prisma/client").$Enums.ProductAvailability;
        market: import("@prisma/client").$Enums.Market | null;
        categoryId: number;
        images: string[];
    }>;
}
