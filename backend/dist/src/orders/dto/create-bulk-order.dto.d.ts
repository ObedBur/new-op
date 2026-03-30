declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateBulkOrderDto {
    items: OrderItemDto[];
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
}
export {};
