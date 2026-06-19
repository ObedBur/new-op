/** Types d'activité retournés par le backend */
export type ActivityType = 'order' | 'vendor_registration' | 'kyc_update';

/** Interface alignée sur le DTO backend + champs mappés pour l'affichage */
export interface Activity {
    id: string;
    type: ActivityType;
    description: string;
    timestamp: string; // ISO 8601

    // Champs mappés pour l'affichage dans RecentActivity.tsx
    user: string;
    action: string;
    time: string;
    status?: string;

    // Métadonnées optionnelles selon le type
    metadata?: Record<string, unknown>;
}

