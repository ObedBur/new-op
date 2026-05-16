import api from '@/lib/api';

export interface NotificationPreferences {
  ordersPush: boolean;
  ordersEmail: boolean;
  ordersInApp: boolean;
  followsPush: boolean;
  followsEmail: boolean;
  followsInApp: boolean;
  promosPush: boolean;
  promosEmail: boolean;
  securityEmail: boolean;
  securityInApp: boolean;
}

/**
 * Récupère les préférences de notifications de l'utilisateur connecté.
 * Si elles n'existent pas encore, le backend les crée avec les valeurs par défaut (upsert).
 */
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  const res = await api.get('/auth/notification-preferences');
  return res.data;
};

/**
 * Met à jour partiellement les préférences de notifications (PATCH).
 */
export const saveNotificationPreferences = async (
  data: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> => {
  const res = await api.patch('/auth/notification-preferences', data);
  return res.data;
};
