export * from './product.types';
export * from './seller.types';
export * from './stats.types';
export * from './activity.types';

// Re-export the unified notification type so admin-dashboard consumers
// can still import { AppNotification } from '@/features/admin-dashboard/types'
export type { AppNotification, NotificationType } from '@/types/notification';
