export declare class EmailService {
    private readonly logger;
    private apiInstance;
    constructor();
    sendOtp(email: string, otp: string): Promise<boolean>;
    sendPasswordReset(email: string, token: string): Promise<boolean>;
    sendBulkOrderConfirmation(data: {
        customerEmail: string;
        customerName: string;
        items: {
            productName: string;
            price: number;
            quantity: number;
        }[];
        totalPrice: number;
        orderIds: string[];
    }): Promise<boolean>;
    sendVendorOrderAlert(data: {
        vendorEmail: string;
        vendorName: string;
        customerName: string;
        customerPhone: string;
        productName: string;
        productImage: string;
        totalPrice: number;
        orderId: string;
    }): Promise<boolean>;
    sendAdminOrderAlert(data: {
        adminEmail: string;
        orderCount: number;
        totalAmount: number;
        customerName: string;
        items: string[];
    }): Promise<boolean>;
}
