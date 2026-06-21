import { useQuery } from '@tanstack/react-query';
import { adminService } from '../api/admin.api';

export const useAdminStats = () => {
    const { data: stats = null, isLoading, error, refetch } = useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const response = await adminService.getDashboardStats();
            return response.success ? response.data : null;
        },
        staleTime: 60000, // 1 minute
    });

    return {
        stats,
        isLoading,
        error: error ? (error instanceof Error ? error.message : 'Erreur stats') : null,
        refetch
    };
};

