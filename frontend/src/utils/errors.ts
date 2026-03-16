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
  
  // General
  UNKNOWN_ERROR: "Oups ! Quelque chose s'est mal passé. Veuillez réessayer dans un instant.",
  NETWORK_ERROR: "Erreur de connexion. Vérifiez votre accès internet.",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapBackendError = (error: any): string => {
  if (!error.response) return authErrors.NETWORK_ERROR;
  
  const status = error.response.status;
  const message = error.response.data?.message;

  // Gestion spécifique des erreurs de connexion
  if (status === 404 && message === 'User not found') {
    return authErrors.USER_NOT_FOUND;
  }
  
  if (status === 401) {
    if (message === 'Invalid password') return authErrors.WRONG_PASSWORD;
    if (message === 'Invalid credentials') return authErrors.INVALID_CREDENTIALS;
    return authErrors.INVALID_CREDENTIALS;
  }

  if (status === 403) return authErrors.ACCOUNT_NOT_VERIFIED;
  if (status === 409) {
    if (message?.toLowerCase().includes('email')) return authErrors.EMAIL_ALREADY_EXISTS;
    if (message?.toLowerCase().includes('phone')) return authErrors.PHONE_ALREADY_EXISTS;
  }
  
  return message || authErrors.UNKNOWN_ERROR;
};
