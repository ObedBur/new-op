import { useQuery } from '@tanstack/react-query';
import { adminService } from '../api/admin.api';
import { Activity, ActivityType } from '@/features/admin-dashboard/types';

/**
 * Calcule un temps relatif lisible à partir d'un timestamp ISO.
 * Ex: "il y a 2 min", "il y a 3h", "il y a 1j"
 */
function formatRelativeTime(isoTimestamp: string): string {
    const now = Date.now();
    const then = new Date(isoTimestamp).getTime();
    const diffMs = now - then;

    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "à l'instant";
    if (minutes < 60) return `il y a ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours}h`;

    const days = Math.floor(hours / 24);
    return `il y a ${days}j`;
}

/**
 * Extrait le "nom d'utilisateur" et l'"action" à partir de la description du backend.
 *
 * Patterns supportés :
 * - "Nouvelle commande de <nom>"       → user=nom, action="a passé une commande"
 * - "Nouveau vendeur : <boutique> ..." → user=boutique, action="vient de s'inscrire"
 * - "Statut KYC de <boutique> ..."     → user=boutique, action="statut KYC mis à jour"
 */
function parseDescription(description: string, type: ActivityType): { user: string; action: string } {
    switch (type) {
        case 'order': {
            const match = description.match(/^Nouvelle commande de (.+)$/);
            return {
                user: match?.[1] || 'Client',
                action: 'a passé une commande',
            };
        }
        case 'vendor_registration': {
            const match = description.match(/^Nouveau vendeur : ([^(]+)/);
            return {
                user: match?.[1]?.trim() || 'Vendeur',
                action: "vient de s'inscrire",
            };
        }
        case 'kyc_update': {
            const match = description.match(/^Statut KYC de (.+?) passé à (.+)$/);
            return {
                user: match?.[1] || 'Vendeur',
                action: `statut KYC passé à ${match?.[2] || '?'}`,
            };
        }
        default:
            return { user: 'Système', action: description };
    }
}

/**
 * Hook qui récupère les activités récentes depuis le backend
 * et les transforme pour l'affichage dans RecentActivity.tsx.
 *
 * Remplace l'ancien hook qui renvoyait des données mockées.
 */
export const useRecentActivity = () => {
    const { data: activities = [], isLoading, refetch } = useQuery({
        queryKey: ['admin', 'activities', 'recent'],
        queryFn: async () => {
            const response = await adminService.getRecentActivities();
            if (!response.success) return [];

            // Mapper les données backend vers le format attendu par le composant
            return response.data.map((item): Activity => {
                const { user, action } = parseDescription(item.description, item.type);
                return {
                    id: item.id,
                    type: item.type,
                    description: item.description,
                    timestamp: item.timestamp,
                    user,
                    action,
                    time: formatRelativeTime(item.timestamp),
                    status: item.type === 'vendor_registration' ? 'pending' : undefined,
                    metadata: item.metadata,
                };
            });
        },
        staleTime: 30000, // 30 secondes avant re-fetch
    });

    return { activities, isLoading, refetch };
};
