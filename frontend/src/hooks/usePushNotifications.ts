'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const subscribeUser = async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        console.warn('Permission for notifications denied');
        return;
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.warn('NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing. Push subscription skipped.');
        return;
      }

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions);
      
      // Envoyer au backend
      await api.post('/notifications/subscribe', subscription);
    } catch (error) {
      console.error('Failed to subscribe user to Push', error);
    }
  };

  return { isSupported, permission, subscribeUser };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
