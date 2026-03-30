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
        };
    }>;
    findMyProducts(req: any, categoryId?: string, search?: string, market?: string, page?: string, limit?: string): Promise<{
        success: boolean;
        data: ({
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
    }>;
    getNewArrivals(limit?: string): Promise<{
        success: boolean;
        data: ({
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
    }>;
    getRecommendations(userId?: string, limit?: string): Promise<{
        success: boolean;
        data: {
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
        }[];
    }>;
    getBestSellers(limit?: string): Promise<{
        success: boolean;
        data: {
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
        }[];
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
        success: boolean;
    }>;
    findAll(categoryId?: string, search?: string, market?: string, page?: string, limit?: string): Promise<{
        success: boolean;
        data: ({
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
