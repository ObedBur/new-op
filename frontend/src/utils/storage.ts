const REFRESH_TOKEN_KEY = 'wapibei_refresh_token'; // Convention du projet : préfixe wapibei_
const REMEMBER_ME_KEY = 'wapibei_remember_me';

type Theme = 'light' | 'dark' | 'system' | 'emerald' | 'ocean';
type Language = 'fr' | 'en';
type FontSize = 'small' | 'medium' | 'large';
type Currency = 'USD' | 'CDF';

const isBrowser = () => typeof window !== 'undefined';

export const storage = {
  // ===== Session persistante ("Se souvenir de moi") =====
  //
  // Règle métier :
  //  - Coche "Se souvenir de moi"  -> refresh token en localStorage
  //    (survit à la fermeture du navigateur, session longue ~7j)
  //  - Coche de l'a pas              -> refresh token en sessionStorage
  //    (détruit à la fermeture de l'onglet, session "volatile")
  //
  // Le flag REMEMBER_ME_KEY est la seule source de vérité : toutes les
  // écritures/lectures du refresh token passent par cette préférence.
  getRememberMe: (): boolean => {
    if (!isBrowser()) return false;
    try {
      return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setRememberMe: (remember: boolean): void => {
    if (!isBrowser()) return;
    try {
      if (remember) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
    } catch {
      // Ignore: stockage indisponible (mode privé, etc.)
    }
  },

  // Emplacement correspondant à la préférence courante
  getRefreshToken: (): string | null => {
    if (!isBrowser()) return null;
    try {
      // 1. Emplacement conforme à la préférence
      const primary =
        storage.getRememberMe() ? localStorage : sessionStorage;
      const token = primary.getItem(REFRESH_TOKEN_KEY);
      if (token) return token;

      // 2. Repli vers l'autre emplacement (migration / compatibilité :
      //    sessions démarrées avant l'introduction du flag)
      const fallback =
        storage.getRememberMe() ? sessionStorage : localStorage;
      return fallback.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setRefreshToken: (token: string): void => {
    if (!isBrowser()) return;
    try {
      // Nettoyer l'autre emplacement pour ne jamais avoir deux tokens actifs
      if (storage.getRememberMe()) {
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
      }
    } catch {
      // Ignore: stockage indisponible (mode privé, etc.)
    }
  },

  removeRefreshToken: (): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // Ignore
    }
  },

  // Generic methods with type safety and error handling
  getItem<T>(key: string, defaultValue: T): T {
    if (!isBrowser()) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Failed to get ${key} from localStorage`, error);
      return defaultValue;
    }
  },

  setItem<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    
    try {
      // Always stringify values to ensure consistency
      // So even strings are stored as "value" (valid JSON)
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage`, error);
    }
  },

  removeItem(key: string): void {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage`, error);
    }
  },

  // Typed helpers for specific app settings
  getTheme: (): Theme => storage.getItem<Theme>('theme', 'light'),
  setTheme: (theme: Theme) => storage.setItem('theme', theme),
  
  getLanguage: (): Language => {
    const language = storage.getItem<string>('language', 'fr');
    return language === 'en' ? 'en' : 'fr';
  },
  setLanguage: (lang: Language) => storage.setItem('language', lang),
  
  getFontSize: (): FontSize => storage.getItem<FontSize>('fontSize', 'medium'),
  setFontSize: (size: FontSize) => storage.setItem('fontSize', size),

  getCurrency: (): Currency => storage.getItem<Currency>('currency', 'USD'),
  setCurrency: (c: Currency) => storage.setItem('currency', c),
};
