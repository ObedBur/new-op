const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const api = {
  get: async (endpoint: string) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return { data };
    } catch (error) {
      console.error(`API Error (GET ${endpoint}):`, error);
      throw error;
    }
  },

  post: async (endpoint: string, data: any) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
                "Accept": "application/json",
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(data),
            });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      return { data: json };
    } catch (error) {
      console.error(`API Error (POST ${endpoint}):`, error);
      throw error;
    }
  },

  patch: async (endpoint: string, data?: any) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      return { data: json };
    } catch (error) {
      console.error(`API Error (PATCH ${endpoint}):`, error);
      throw error;
    }
  },

  put: async (endpoint: string, data: any) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      return { data: json };
    } catch (error) {
      console.error(`API Error (PUT ${endpoint}):`, error);
      throw error;
    }
  },

  delete: async (endpoint: string) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return { data };
    } catch (error) {
      console.error(`API Error (DELETE ${endpoint}):`, error);
      throw error;
    }
  },
};