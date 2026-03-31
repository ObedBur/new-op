import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    findMyProducts(req: any, categoryId?: string, search?: string, market?: string, page?: string, limit?: string): Promise<{
        success: boolean;
        data: ({
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
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getDeals(limit?: string): Promise<{
        success: boolean;
        data: ({
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
    }>;
    getNewArrivals(limit?: string): Promise<{
        success: boolean;
        data: ({
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
    }>;
    getRecommendations(userId?: string, limit?: string): Promise<{
        success: boolean;
        data: ({
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
    }>;
    getBestSellers(limit?: string): Promise<{
        success: boolean;
        data: ({
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
    }>;
    compare(search: string): Promise<{
        query: string;
        products: any[];
        stats?: undefined;
        success: boolean;
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
        success: boolean;
    }>;
    findAll(categoryId?: string, search?: string, market?: string, page?: string, limit?: string): Promise<{
        success: boolean;
        data: ({
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
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    update(id: string, updateProductDto: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    bulkPublish(ids: string[], req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
