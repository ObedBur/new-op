/**
 * DTO pour les activités récentes du dashboard admin.
 *
 * Trois types d'activité sont supportés :
 * - order : nouvelle commande créée
 * - vendor_registration : inscription d'un nouveau vendeur
 * - kyc_update : changement de statut KYC d'un vendeur
 */

// ── Types d'activité ──────────────────────────────────────────────
export type ActivityType = 'order' | 'vendor_registration' | 'kyc_update';

// ── Métadonnées par type ──────────────────────────────────────────
export interface OrderMetadata {
  orderId: string;
  total: number;
  customerName: string;
}

export interface VendorRegistrationMetadata {
  userId: string;
  boutiqueName: string;
  fullName: string;
}

export interface KycUpdateMetadata {
  userId: string;
  boutiqueName: string;
  newStatus: string;
}

export type ActivityMetadata =
  | OrderMetadata
  | VendorRegistrationMetadata
  | KycUpdateMetadata;

// ── DTO principal ─────────────────────────────────────────────────
export interface ActivityDto {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string; // ISO 8601
  metadata?: ActivityMetadata;
}
