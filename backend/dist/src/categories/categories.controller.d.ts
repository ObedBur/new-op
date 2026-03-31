import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        success: boolean;
        data: {
            productCount: number;
            _count: {
                products: number;
            };
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        }[];
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            products: {
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
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
            colorClass: string | null;
            bgClass: string | null;
        };
    }>;
}
