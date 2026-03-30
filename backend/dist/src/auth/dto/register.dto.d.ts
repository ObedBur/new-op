import { UserRole } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    province: string;
    commune: string;
    city?: string;
    country?: string;
    address?: string;
    boutiqueName?: string;
    role: UserRole;
    kycStatus?: string;
}
