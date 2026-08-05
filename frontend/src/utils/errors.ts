export type Translator = (key: string) => string;

const BACKEND_CODE_MAP: Record<string, string> = {
  CART_CONFLICT: 'errors.cart.conflict',
  PRODUCT_NOT_FOUND: 'errors.product.notFound',
  PRODUCT_UNAVAILABLE: 'errors.product.unavailable',
  VENDOR_UNAVAILABLE: 'errors.product.vendorUnavailable',
  QUANTITY_INVALID: 'errors.cart.quantityInvalid',
  STOCK_INSUFFICIENT: 'errors.cart.stockInsufficient',
  ORDER_CART_EMPTY: 'errors.order.cartEmpty',
  ORDER_PRODUCTS_MISSING: 'errors.order.productsMissing',
  ORDER_PRODUCT_MISSING: 'errors.order.productMissing',
  ORDER_PRODUCT_UNAVAILABLE: 'errors.order.productUnavailable',
  ORDER_VENDOR_UNAVAILABLE: 'errors.order.vendorUnavailable',
  ORDER_STOCK_INSUFFICIENT: 'errors.order.stockInsufficient',
  ORDER_NOT_FOUND: 'errors.order.notFound',
  ORDER_FORBIDDEN: 'errors.order.forbidden',
  PRODUCT_UPDATE_FORBIDDEN: 'errors.product.updateForbidden',
  PRODUCT_DELETE_FORBIDDEN: 'errors.product.deleteForbidden',
  ADMIN_USER_NOT_FOUND: 'errors.admin.userNotFound',
  ADMIN_USER_DELETE_CONSTRAINT: 'errors.admin.deleteConstraint',
  ADMIN_INVALID_STATUS: 'errors.admin.invalidStatus',
  ADMIN_KYC_VENDOR_ONLY: 'errors.admin.kycVendorOnly',
  SELLER_NOT_FOUND: 'errors.seller.notFound',
  ADDRESS_NOT_FOUND: 'errors.address.notFound',
  CONTENT_INAPPROPRIATE: 'errors.content.inappropriate',
  IMAGE_NUDITY: 'errors.image.nudity',
  IMAGE_GORE: 'errors.image.gore',
  TITLE_TOO_SHORT: 'errors.product.titleTooShort',
  DESCRIPTION_TOO_SHORT: 'errors.product.descriptionTooShort',
  PRICE_INVALID: 'errors.product.priceInvalid',
};

const BACKEND_MESSAGE_MAP: Array<{ match: string | RegExp; key: string }> = [
  { match: 'User already exists', key: 'auth.errors.accountExists' },
  { match: 'Utilisateur non trouvé', key: 'auth.errors.userNotFound' },
  { match: 'Invalid or expired token', key: 'auth.resetPassword.errorInvalidToken' },
  { match: 'Invalid token', key: 'auth.resetPassword.errorInvalidToken' },
  { match: 'No active reset request', key: 'auth.resetPassword.errorGeneric' },
  { match: 'Reset token has expired', key: 'auth.resetPassword.errorGeneric' },
  { match: "L'ancien mot de passe est requis", key: 'errors.security.oldPasswordRequired' },
  { match: "L'ancien mot de passe est incorrect", key: 'errors.security.oldPasswordWrong' },
  { match: 'Image de profil inappropriée détectée', key: 'errors.profile.imageInappropriate' },
  { match: 'Image de couverture inappropriée détectée', key: 'errors.profile.imageInappropriate' },
];

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
  const code = error.response.data?.code;

  // ============ CODE D'ERREUR MACHINE (traduction précise) ============
  if (code && BACKEND_CODE_MAP[code]) {
    return t(BACKEND_CODE_MAP[code]);
  }

  // ============ MESSAGES CONNUS (fallback par chaîne) ============
  if (typeof message === 'string') {
    for (const entry of BACKEND_MESSAGE_MAP) {
      if (typeof entry.match === 'string' ? message === entry.match : entry.match.test(message)) {
        return t(entry.key);
      }
    }
  }

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
