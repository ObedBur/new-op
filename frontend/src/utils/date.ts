/**
 * Localized date formatter using Intl APIs.
 * Returns a relative time when recent, otherwise a short date.
 */
export const formatDate = (dateInput: string | Date | undefined, locale = 'fr') => {
  if (!dateInput) return '';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // For very recent times, provide a human-friendly label
  if (diffInSeconds < 5) {
    return locale.startsWith('fr') ? "À l'instant" : 'Just now';
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const minutes = Math.floor(diffInSeconds / 60);
  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (minutes < 60) return rtf.format(-minutes, 'minute');

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');

  const days = Math.floor(hours / 24);
  if (days < 7) return rtf.format(-days, 'day');

  // Fallback: short localized date (e.g., 12 juil.)
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(date);
};
