'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppNotification } from '@/types/notification';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/services/notification.service';

const NOTIFICATIONS_KEY = ['app', 'notifications'] as const;

/**
 * Global Notifications Hook
 *
 * Single hook to manage notifications across the entire app.
 * Uses React Query for caching, deduplication, and optimistic updates.
 *
 * Usage:
 *   const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useAppNotifications();
 */
export function useAppNotifications() {
  const queryClient = useQueryClient();

  // ── Fetch ──────────────────────────────────────────
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery<AppNotification[]>({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: fetchNotifications,
    staleTime: 30_000,      // consider data fresh for 30s
    refetchInterval: 60_000, // background refetch every 60s
  });

  // ── Computed ───────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── Mark Single As Read (Optimistic) ───────────────
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData<AppNotification[]>(NOTIFICATIONS_KEY);

      queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_KEY, (old = []) =>
        old.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });

  // ── Mark All As Read (Optimistic) ──────────────────
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData<AppNotification[]>(NOTIFICATIONS_KEY);

      queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_KEY, (old = []) =>
        old.map((n) => ({ ...n, isRead: true }))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    isError,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
}
