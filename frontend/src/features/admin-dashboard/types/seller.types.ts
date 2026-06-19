import { KycStatus } from '@/types';

export interface Seller {
    id: string;
    fullName: string;
    boutiqueName: string | null;
    email?: string;
    phone?: string;
    province?: string;
    commune?: string;
    kycStatus: KycStatus;
    isVerified?: boolean;
    trustScore?: number;
    createdAt?: string;
    avatarUrl?: string;
}
