import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsService } from '../services/vendors.service';
import { useToast } from '@/context/ToastContext';
import { KycStatus } from '@/types';

export const usePendingVendors = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // Fetch ONLY pending vendors
    const { 
        data: pendingVendors = [], 
        isLoading,
        isError
    } = useQuery({
        queryKey: ['vendors', 'pending'],
        queryFn: async () => await vendorsService.getPendingVendors(),
        // Refetch interval could be added here for real-time dashboard updates
    });

    // Mutation for quick actions (Approve/Reject)
    const updateKycMutation = useMutation({
        mutationFn: async ({ userId, status }: { userId: string, status: KycStatus }) => {
            await vendorsService.updateKycStatus(userId, status);
        },
        onSuccess: (_, variables) => {
            showToast(`Statut mis à jour : ${variables.status}`, 'success');
            // Invalidate pending list AND the main list
            queryClient.invalidateQueries({ queryKey: ['vendors', 'pending'] });
            queryClient.invalidateQueries({ queryKey: ['vendors', 'list'] });
        },
        onError: (error) => {
            console.error('KYC update failed:', error);
            showToast('Erreur lors de la mise à jour', 'error');
        }
    });

    return {
        pendingSellers: pendingVendors,
        isLoading,
        isError,
        updateKycStatus: (userId: string, status: KycStatus) => updateKycMutation.mutate({ userId, status })
    };
};
