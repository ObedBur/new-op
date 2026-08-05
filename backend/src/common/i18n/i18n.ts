import { TRANSLATIONS, SUPPORTED_LANGUAGES, Language } from './translations';

export function resolveLang(lang?: string): Language {
  if (lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
    return lang as Language;
  }
  return 'fr';
}

export function t(lang: string | undefined, key: string, params?: Record<string, string | number>): string {
  const dict = TRANSLATIONS[resolveLang(lang)];
  let text = dict[key] ?? TRANSLATIONS.fr[key] ?? key;

  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }
  return text;
}
