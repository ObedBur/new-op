'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { getAccessToken } from '@/lib/axios';
import { AppNotification } from '@/types/notification';

const NOTIFICATIONS_KEY = ['app', 'notifications'] as const;

function getSocketUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api';
  return apiUrl.replace(/\/api\/?$/, '');
}

export function useNotificationsSocket() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const token = getAccessToken();
    if (!token) return;

    const socket = io(`${getSocketUrl()}/notifications`, {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10_000,
    });

    socket.on('connect', () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    });

    socket.io.on('reconnect', () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    });

    socket.on('notification:new', (notification: AppNotification) => {
      queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_KEY, (current = []) => {
        if (current.some((item) => item.id === notification.id)) {
          return current;
        }
        return [notification, ...current].slice(0, 50);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, isLoading, queryClient]);
}
