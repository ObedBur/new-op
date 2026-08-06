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
    url?: string;           // URL de redirection au clic
    productId?: string;
    orderId?: string;
    orderIds?: string[];
    productImage?: string;
    customerName?: string;
    orderCount?: number;
    [key: string]: unknown;
  };
  createdAt: string;
}

/**
 * Résout l'URL de redirection d'une notification de manière intelligente.
 * Priorité : metadata.url > logique par type > null (pas de redirection)
 */
export function resolveNotificationUrl(
  notification: AppNotification,
  userRole?: string,
): string | null {
  // 1. Si le backend a fourni une URL explicite, on l'utilise en priorité
  if (notification.metadata?.url) {
    return notification.metadata.url as string;
  }

  // 2. Fallback intelligent par type de notification
  switch (notification.type) {
    case 'ORDER_CREATED':
    case 'ORDER_CONFIRMED':
      if (userRole === 'VENDOR') return '/dashboard/orders';
      if (userRole === 'ADMIN')  return '/admin/notifications';
      return '/settings?tab=orders';

    case 'NEW_PRODUCT':
      if (notification.metadata?.productId) {
        return `/products/${notification.metadata.productId}`;
      }
      return '/products';

    case 'PROMOTION':
      return '/products?filter=deals';

    case 'PAYMENT_RECEIVED':
      return userRole === 'VENDOR' ? '/dashboard/orders' : '/settings?tab=orders';

    case 'SYSTEM_ALERT':
      if (userRole === 'ADMIN') return '/admin/notifications';
      return '/settings?tab=notifications';

    default:
      return null;
  }
}
