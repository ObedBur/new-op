import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllUsers(role?: string, kycStatus?: string, page?: string, limit?: string): Promise<{
        success: boolean;
        data: {
            email: string;
            fullName: string;
            phone: string;
            province: string;
            commune: string;
            boutiqueName: string;
            role: import("@prisma/client").$Enums.UserRole;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            id: string;
            isVerified: boolean;
            trustScore: number;
            createdAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getUserDetails(userId: string): Promise<{
        success: boolean;
        data: {
            email: string;
            fullName: string;
            phone: string;
            province: string;
            commune: string;
            address: string;
            boutiqueName: string;
            role: import("@prisma/client").$Enums.UserRole;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            id: string;
            isVerified: boolean;
            trustScore: number;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    deleteUser(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateKycStatus(userId: string, body: {
        status: string;
        rejectionReason?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            trustScore: number;
        };
    }>;
    getPendingKyc(): Promise<{
        success: boolean;
        count: number;
        data: {
            email: string;
            fullName: string;
            phone: string;
            province: string;
            commune: string;
            boutiqueName: string;
            id: string;
            createdAt: Date;
        }[];
    }>;
    getStats(): Promise<{
        success: boolean;
        data: {
            users: {
                total: number;
                clients: number;
                vendors: number;
                verified: number;
            };
            products: {
                total: number;
            };
            sales: {
                total: number;
            };
            kyc: {
                pending: number;
                approved: number;
            };
        };
        timestamp: string;
    }>;
    getRecentActivities(): Promise<{
        success: boolean;
        data: import("./dto/activity.dto").ActivityDto[];
    }>;
}
