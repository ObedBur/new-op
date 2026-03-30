export type ActivityType = 'order' | 'vendor_registration' | 'kyc_update';
export interface OrderMetadata {
    orderId: string;
    total: number;
    customerName: string;
}
export interface VendorRegistrationMetadata {
    userId: string;
    boutiqueName: string;
    fullName: string;
}
export interface KycUpdateMetadata {
    userId: string;
    boutiqueName: string;
    newStatus: string;
}
export type ActivityMetadata = OrderMetadata | VendorRegistrationMetadata | KycUpdateMetadata;
export interface ActivityDto {
    id: string;
    type: ActivityType;
    description: string;
    timestamp: string;
    metadata?: ActivityMetadata;
}
