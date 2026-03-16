/**
 * Application-wide enums and constants
 * Replaces magic strings with type-safe values
 */

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  VENDOR: 'VENDOR',
  CUSTOMER: 'CUSTOMER',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const MARKETS = {
  VIRUNGA: 'Virunga',
  BIRERE: 'Birere',
  ALANINE: 'Alanine',
  GOMA: 'Goma',
} as const;

export type Market = typeof MARKETS[keyof typeof MARKETS];

export const ADMIN_VIEWS = {
  DASHBOARD: 'Dashboard',
  VENDORS: 'Vendeurs',
  PRODUCTS: 'Produits',
  USERS: 'Utilisateurs',
  REPORTS: 'Rapports',
  SETTINGS: 'Paramètres',
  STATS: 'Statistiques',
  NOTIFICATIONS: 'Notifications',
} as const;

export type AdminView = typeof ADMIN_VIEWS[keyof typeof ADMIN_VIEWS];

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
} as const;

export type ToastType = typeof TOAST_TYPES[keyof typeof TOAST_TYPES];

export const KYC_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type KycStatus = typeof KYC_STATUS[keyof typeof KYC_STATUS];
