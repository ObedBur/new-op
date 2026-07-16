const REFRESH_TOKEN_KEY = 'wapibei_refresh_token'; // Convention du projet : préfixe wapibei_

type Theme = 'light' | 'dark' | 'system' | 'emerald' | 'ocean';
type Language = 'fr' | 'en';
type FontSize = 'small' | 'medium' | 'large';
type Currency = 'USD' | 'CDF';

export const storage = {
  // Refresh token methods (existing)
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },
  
  setRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },
  
  removeRefreshToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  // Generic methods with type safety and error handling
  getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
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
    if (typeof window === 'undefined') return;
    
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
    if (typeof window === 'undefined') return;
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
