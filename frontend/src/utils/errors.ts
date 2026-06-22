export const authErrors = {
  // Login
  INVALID_CREDENTIALS: "Identifiants incorrects.",
  USER_NOT_FOUND: "Aucun compte trouvé avec cet e-mail.",
  WRONG_PASSWORD: "Le mot de passe est incorrect.",
  ACCOUNT_NOT_VERIFIED: "Votre compte n'est pas encore vérifié. Veuillez vérifier votre boîte e-mail.",
  ACCOUNT_LOCKED: "Trop de tentatives. Votre compte est bloqué temporairement.",
  
  // Registration
  EMAIL_ALREADY_EXISTS: "Cet e-mail est déjà utilisé par un autre compte.",
  PHONE_ALREADY_EXISTS: "Ce numéro de téléphone est déjà enregistré.",
  INVALID_PHONE_FORMAT: "Veuillez entrer un numéro de téléphone valide au format RDC (+243...).",
  WEAK_PASSWORD: "Le mot de passe est trop faible. Utilisez au moins 8 caractères avec une majuscule.",
  
  // OTP
  INVALID_OTP: "Le code est incorrect. Veuillez vérifier le code reçu.",
  EXPIRED_OTP: "Le code a expiré. Veuillez en demander un nouveau.",
  
  // Server Errors
  SERVER_ERROR: "Une erreur interne est survenue. Veuillez réessayer plus tard.",
  DATABASE_ERROR: "Une erreur de base de données est survenue.",

  // General
  UNKNOWN_ERROR: "Oups ! Quelque chose s'est mal passé. Veuillez réessayer dans un instant.",
  NETWORK_ERROR: "Erreur de connexion. Vérifiez votre accès internet.",
  SERVER_UNREACHABLE: "Impossible de joindre le serveur. Il est peut-être en maintenance ou temporairement indisponible.",
  TIMEOUT_ERROR: "Le serveur met trop de temps à répondre. Veuillez réessayer.",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapBackendError = (error: any): string => {
  if (!error.response) {
    // Si on est dans le navigateur et qu'il n'y a pas de connexion réseau
    if (typeof window !== 'undefined' && !navigator.onLine) {
      return authErrors.NETWORK_ERROR;
    }
    // Si la requête a expiré
    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      return authErrors.TIMEOUT_ERROR;
    }
    // Sinon, c'est probablement que le serveur backend est down ou injoignable (ex: CORS)
    return authErrors.SERVER_UNREACHABLE;
  }
  
  const status = error.response.status;
  const message = error.response.data?.message;

  // ============ ERREURS 5XX (Erreurs serveur) ============
  if (status >= 500) {
    // En production, afficher un message générique amical
    if (process.env.NODE_ENV === 'production') {
      return authErrors.SERVER_ERROR;
    }
    // En dev, afficher le message du serveur pour déboguer
    return message || authErrors.SERVER_ERROR;
  }

  // ============ ERREURS 4XX (Erreurs client) ============
  // Gestion spécifique des erreurs de connexion
  if (status === 404 && message === 'User not found') {
    return authErrors.USER_NOT_FOUND;
  }
  
  if (status === 401) {
    // Messages spécifiques en développement
    if (message === 'Email not found') return authErrors.USER_NOT_FOUND;
    if (message === 'Invalid password') return authErrors.WRONG_PASSWORD;
    // Messages génériques en production ou par défaut
    if (message === 'Identifiants invalides' || message === 'Invalid credentials') {
      return authErrors.INVALID_CREDENTIALS;
    }
    return message || authErrors.INVALID_CREDENTIALS;
  }

  if (status === 403) return authErrors.ACCOUNT_NOT_VERIFIED;
  if (status === 409) {
    if (message?.toLowerCase().includes('email')) return authErrors.EMAIL_ALREADY_EXISTS;
    if (message?.toLowerCase().includes('phone')) return authErrors.PHONE_ALREADY_EXISTS;
  }
  
  return message || authErrors.UNKNOWN_ERROR;
};
