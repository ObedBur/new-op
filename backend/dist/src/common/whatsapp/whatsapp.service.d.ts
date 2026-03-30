export interface WhatsAppOrderPayload {
    vendorName: string;
    customerName: string;
    customerPhone: string;
    productName: string;
    productImage?: string;
    deliveryAddress: string;
    totalPrice: number;
}
export declare class WhatsAppService {
    private readonly logger;
    private sanitizePhone;
    private formatOrderMessage;
    sendWhatsAppMessage(to: string, message: string): Promise<boolean>;
    sendOrderAlert(vendorPhone: string, data: WhatsAppOrderPayload): Promise<boolean>;
}
