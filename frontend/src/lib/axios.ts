import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from '@/utils/storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
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
  (response) => {
    if (response.config.url?.includes('/auth/profile')) {
      console.log(" Profil chargé");
    }
    return response;
  },
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

    console.log(" 401 sur :", originalRequest.url);

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
      console.log("🔄 Tentative de refresh...");

      if (!refreshToken) throw new Error('No refresh token');

      const response = await axios.post(
        `${API_URL}/auth/refresh`, 
        {}, 
        {   
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

      console.log(" Refresh réussi, relecture de la requête initiale");
      return api(originalRequest);

    } catch (refreshError) {
      isRefreshing = false;
      refreshSubscribers = [];
      setAccessToken(null);
      storage.removeRefreshToken();
      console.error(" Refresh échoué, session expirée");
      
      // Tu peux décommenter ceci si tu veux rediriger vers login automatiquement
      // if (typeof window !== 'undefined') window.location.href = '/login';

      return Promise.reject(refreshError);
    }
  }
);