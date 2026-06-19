import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../api/admin.api';
import { useToast } from '@/context/ToastContext';
import { KYC_STATUS } from '@/constants/enums';

export const useVendors = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // Fetch pending sellers
    const { 
        data: pendingSellers = [], 
        isLoading, 
        refetch 
    } = useQuery({
        queryKey: ['admin', 'vendors', 'pending'],
        queryFn: async () => {
            const response = await adminService.getPendingKyc();
            return response.success ? response.data : [];
        }
    });

    // Mutation for updating KYC status
    const updateMutation = useMutation({
        mutationFn: async ({ userId, status }: { userId: string, status: 'APPROVED' | 'REJECTED' }) => {
            const response = await adminService.updateKycStatus(userId, status);
            if (!response.success) throw new Error('Action échouée');
            return { userId, status };
        },
        onSuccess: (data) => {
            showToast(data.status === KYC_STATUS.APPROVED ? 'Vendeur approuvé' : 'Vendeur refusé', 'success');
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['admin', 'vendors', 'pending'] });
        },
        onError: (error) => {
            console.error('Failed to update KYC status:', error);
            showToast('Action échouée', 'error');
        }
    });

    const updateKycStatus = async (userId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await updateMutation.mutateAsync({ userId, status });
            return true;
        } catch {
            return false;
        }
    };

    return {
        pendingSellers,
        isLoading,
        updateKycStatus,
        refetch
    };
};

