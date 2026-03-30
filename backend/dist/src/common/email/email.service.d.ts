import * as Brevo from '@getbrevo/brevo';
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
            productImage?: string;
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
        items: {
            productName: string;
            productImage?: string;
        }[];
    }): Promise<boolean>;
    sendWelcomeEmail(email: string, name: string): Promise<boolean>;
    sendPriceDropAlert(data: {
        email: string;
        name: string;
        productName: string;
        oldPrice: number;
        newPrice: number;
        productImage: string;
        productLink: string;
    }): Promise<{
        response: import("http").IncomingMessage;
        body: Brevo.CreateSmtpEmail;
    }>;
    sendClosureAdminReport(data: {
        adminEmail: string;
        orderId: string;
        clientName: string;
        vendorName: string;
        productName: string;
        amount: number;
    }): Promise<{
        response: import("http").IncomingMessage;
        body: Brevo.CreateSmtpEmail;
    }>;
}
