export type Translator = (key: string) => string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapBackendError = (error: any, t: Translator): string => {
  if (!error.response) {
    // Si on est dans le navigateur et qu'il n'y a pas de connexion réseau
    if (typeof window !== 'undefined' && !navigator.onLine) {
      return t('auth.errors.networkError');
    }
    // Si la requête a expiré
    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      return t('auth.errors.timeoutError');
    }
    // Sinon, c'est probablement que le serveur backend est down ou injoignable (ex: CORS)
    return t('auth.errors.serverUnreachable');
  }

  const status = error.response.status;
  const message = error.response.data?.message;

  // ============ ERREURS 5XX (Erreurs serveur) ============
  if (status >= 500) {
    // En production, afficher un message générique amical
    if (process.env.NODE_ENV === 'production') {
      return t('auth.errors.serverError');
    }
    // En dev, afficher le message du serveur pour déboguer
    return message || t('auth.errors.serverError');
  }

  // ============ ERREURS 4XX (Erreurs client) ============
  // Gestion spécifique des erreurs de connexion
  if (status === 404 && message === 'User not found') {
    return t('auth.errors.userNotFound');
  }

  if (status === 401) {
    // Messages spécifiques en développement
    if (message === 'Email not found') return t('auth.errors.userNotFound');
    if (message === 'Invalid password') return t('auth.errors.wrongPassword');
    // Messages génériques en production ou par défaut
    if (message === 'Identifiants invalides' || message === 'Invalid credentials') {
      return t('auth.errors.invalidCredentials');
    }
    return message || t('auth.errors.invalidCredentials');
  }

  if (status === 403) return t('auth.errors.accountNotVerified');
  if (status === 409) {
    if (message?.toLowerCase().includes('email')) return t('auth.errors.emailAlreadyExists');
    if (message?.toLowerCase().includes('phone')) return t('auth.errors.phoneAlreadyExists');
  }

  return message || t('auth.errors.unknownError');
};
