import { api } from '@/lib/axios';

export interface NotificationPreferences {
  ordersPush: boolean;
  ordersEmail: boolean;
  ordersInApp: boolean;
  ordersSms: boolean;
  followsPush: boolean;
  followsEmail: boolean;
  followsInApp: boolean;
  followsSms: boolean;
  promosPush: boolean;
  promosEmail: boolean;
  promosSms: boolean;
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
  data: Partial<NotificationPreferences> & { id?: string; userId?: string; createdAt?: string; updatedAt?: string; },
): Promise<NotificationPreferences> => {
  // Le backend (ValidationPipe avec forbidNonWhitelisted: true) rejette la requête 
  // si on lui envoie 'id', 'userId', etc. On les retire donc de l'objet envoyé.
  const { id, userId, createdAt, updatedAt, ...cleanData } = data;
  
  const res = await api.patch('/auth/notification-preferences', cleanData);
  return res.data;
};
