import { api } from '@/lib/axios';
import { AppNotification } from '@/types/notification';

/**
 * Centralized Notification API Service
 * 
 * All notification-related HTTP calls go through here.
 * Consumed by the useAppNotifications hook.
 */

/** Fetch all notifications for the authenticated user */
export async function fetchNotifications(): Promise<AppNotification[]> {
  const { data } = await api.get<AppNotification[]>('/notifications');
  return data;
}

/** Mark a single notification as read */
export async function markNotificationAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

/** Mark all unread notifications as read (batch) */
export async function markAllNotificationsAsRead(): Promise<void> {
  await api.patch('/notifications/read-all');
}
