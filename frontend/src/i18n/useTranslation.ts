"use client";

import { useT } from '@/i18n/useT';
import type { AppLanguage } from '@/i18n/translations';

export type Locale = AppLanguage;

/**
 * Backward-compatible wrapper around useT.
 * Usage: const { t, lang } = useTranslation(); t('common.save')
 */
export const useTranslation = () => {
  const { t, language } = useT();

  return { t, lang: language };
};

export default useTranslation;
