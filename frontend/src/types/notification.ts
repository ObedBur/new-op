/**
 * Unified Notification Types
 * 
 * Single source of truth for notification typing across the entire app.
 * Used by both the user-facing Settings page and the Admin Dashboard.
 * 
 * Named "AppNotification" to avoid conflict with the browser's native
 * Notification API (Web Notifications).
 */

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string; // ISO 8601 date string from the backend
}
