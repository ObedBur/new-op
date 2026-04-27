'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppNotification } from '@/types/notification';
import {
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '@/services/notification.service';
import { useState } from 'react';

const NOTIFICATIONS_KEY = ['app', 'notifications'] as const;

/**
 * Admin-specific notifications hook.
 */
export const useNotifications = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const { data: notifications = [] } = useQuery<AppNotification[]>({
        queryKey: NOTIFICATIONS_KEY,
        queryFn: fetchNotifications,
        staleTime: 30_000,
    });

    const toggleNotifications = () => setIsOpen(!isOpen);
    const closeNotifications = () => setIsOpen(false);

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

    const markAsRead = (id: string) => {
        queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_KEY, (old = []) =>
            old.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        markNotificationAsRead(id).catch(console.error);
    };

    const addNotification = (notification: Omit<AppNotification, 'id'>) => {
        const newNotification: AppNotification = {
            ...notification,
            id: Date.now().toString(),
        };
        queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_KEY, (old = []) => [newNotification, ...old]);
    };

    const removeNotification = (id: string) => {
        queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_KEY, (old = []) => old.filter((n) => n.id !== id));
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
        notifications,
        unreadCount,
        isOpen,
        toggleNotifications,
        closeNotifications,
        markAsRead,
        markAllAsRead: markAllAsReadMutation.mutate,
        addNotification,
        removeNotification,
    };
};
