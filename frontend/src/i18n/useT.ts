"use client";

import { useCallback } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { getTranslationValue, resolveLanguage } from '@/i18n/translations';

const warnedMissingKeys = new Set<string>();

export const useT = () => {
  const { language } = useSettings();
  const resolvedLanguage = resolveLanguage(language);

  const t = useCallback((key: string): string => {
    const value = getTranslationValue(resolvedLanguage, key);

    if (typeof value === 'string') {
      return value;
    }

    if (process.env.NODE_ENV !== 'production') {
      const warningKey = `${resolvedLanguage}:${key}`;

      if (!warnedMissingKeys.has(warningKey)) {
        warnedMissingKeys.add(warningKey);
        console.warn(
          `[i18n] Missing translation key "${key}" for language "${resolvedLanguage}"`,
        );
      }
    }

    return key;
  }, [resolvedLanguage]);

  return {
    language: resolvedLanguage,
    t,
  };
};

export default useT;
