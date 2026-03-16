'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Notification } from '@/features/admin-dashboard/types';

export const useNotifications = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const { data: notifications = [] } = useQuery({
        queryKey: ['admin', 'notifications'],
        queryFn: async () => {
            // This would normally be an API call
            return [] as Notification[];
        },
        staleTime: 30000,
    });

    const toggleNotifications = () => setIsOpen(!isOpen);
    const closeNotifications = () => setIsOpen(false);

    const markAllAsRead = () => {
        // Optimistic update or mutation
        queryClient.setQueryData(['admin', 'notifications'], []);
        setIsOpen(false);
    };

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
        };
        queryClient.setQueryData(['admin', 'notifications'], (old: Notification[] = []) => [newNotification, ...old]);
    };

    const removeNotification = (id: string) => {
        queryClient.setQueryData(['admin', 'notifications'], (old: Notification[] = []) => old.filter((n) => n.id !== id));
    };

    return {
        notifications,
        isOpen,
        toggleNotifications,
        closeNotifications,
        markAllAsRead,
        addNotification,
        removeNotification,
    };
};


