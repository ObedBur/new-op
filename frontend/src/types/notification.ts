export type NotificationType =
  | 'ORDER_CREATED'
  | 'ORDER_CONFIRMED'
  | 'PAYMENT_RECEIVED'
  | 'SYSTEM_ALERT'
  | 'NEW_PRODUCT'
  | 'PROMOTION';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata?: {
    productId?: string;
    orderId?: string;
    orderIds?: string[];
    productImage?: string;
    [key: string]: unknown;
  };
  createdAt: string;
}
