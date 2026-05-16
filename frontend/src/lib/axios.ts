import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from '@/utils/storage';

// Détecter l'URL du backend selon l'hôte
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api';
  }

  const hostname = window.location.hostname;

  // Si accédé via localhost, utiliser Render en PROD ou localhost en DEV
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Utiliser l'URL du backend Render si définie, sinon localhost
    return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api';
  }

  // Si accédé via internet (prod), utiliser le backend Render
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Si accédé via une IP réseau locale, utiliser la même IP pour le backend
  return `http://${hostname}:4000/api`;
};

const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  timeout: 60_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Intercepteur de REQUÊTE
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Intercepteur de RÉPONSE
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Si pas 401, déjà réessayé, ou si c'est une tentative de login, on arrête là
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/login')
    ) {
      return Promise.reject(error);
    }

    // Log 401 removed for production

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = storage.getRefreshToken();
      // Tentative de refresh automatique

      if (!refreshToken) throw new Error('No refresh token');

      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        {
          timeout: 12_000,
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        }
      );

      // On récupère les nouveaux tokens (snake_case venant de NestJS)
      const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;

      setAccessToken(newAccessToken);

      // Si le backend renvoie un nouveau refresh token (Rotation), on le stocke
      if (newRefreshToken) {
        storage.setRefreshToken(newRefreshToken);
      }

      isRefreshing = false;
      onRefreshed(newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      // Refresh réussi, relecture de la requête initiale
      return api(originalRequest);

    } catch (refreshError) {
      isRefreshing = false;
      refreshSubscribers = [];
      setAccessToken(null);
      storage.removeRefreshToken();

      if (typeof window !== 'undefined') window.location.href = '/login';

      return Promise.reject(refreshError);
    }
  }
);