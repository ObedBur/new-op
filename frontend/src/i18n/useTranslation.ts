"use client";

import { useSettings } from '@/context/SettingsContext';
import { TRANSLATIONS } from '@/constants/translations';

export type Locale = 'fr' | 'en' | 'sw';

const TRANSLATIONS_MAP = TRANSLATIONS as Record<Locale, any>;

/**
 * Simple translation hook.
 * Usage: const { t, lang } = useTranslation(); t('common.save')
 */
export const useTranslation = () => {
  const { language } = useSettings();
  const lang = (language || 'fr') as Locale;

  const t = (key: string, fallback?: string): string => {
    const parts = key.split('.');
    let cur: any = TRANSLATIONS_MAP[lang];
    for (const p of parts) {
      if (!cur) break;
      cur = cur[p];
    }
    if (typeof cur === 'string') return cur;
    if (fallback) return fallback;
    // Fallback to french full path if exists
    cur = TRANSLATIONS_MAP.fr;
    for (const p of parts) {
      if (!cur) break;
      cur = cur[p];
    }
    if (typeof cur === 'string') return cur;
    return key;
  };

  return { t, lang };
};

export default useTranslation;
