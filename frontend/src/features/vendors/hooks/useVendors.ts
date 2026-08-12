import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsService } from '../services/vendors.service';
import { KycStatus } from '../types';
import { useToast } from '@/context/ToastContext';

export const useVendors = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    
    // Local state for UI filters
    // Note: ideally this should be in URL params via useSearchParams for URL-driven state,
    // but sticking to previous requirement of keeping functionality equivalent first.
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'Tous' | KycStatus>('Tous');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);

    // 1. Fetching Logic
    const { 
        data: vendorsPage = { data: [], pagination: { page: 1, limit: pageSize, total: 0, pages: 0 } }, 
        isLoading, 
        isError,
        refetch 
    } = useQuery({
        queryKey: ['vendors', 'list', page, statusFilter],
        queryFn: async () => await vendorsService.getAllVendors({
            page,
            limit: pageSize,
            ...(statusFilter !== 'Tous' ? { kycStatus: statusFilter } : {}),
        }),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    const vendors = vendorsPage.data || [];

    // 2. Client-side Search Filtering (server pagination already applied)
    const filteredVendors = vendors.filter((vendor) => {
        const vendorName = vendor.boutiqueName || vendor.fullName || '';
        const vendorProvince = vendor.province || '';
        
        return vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendorProvince.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const pagination = vendorsPage.pagination || { page: 1, limit: pageSize, total: 0, pages: 0 };

    // 3. Mutation Logic (Actions)
    const updateKycMutation = useMutation({
        mutationFn: async ({ userId, status }: { userId: string, status: KycStatus }) => {
            await vendorsService.updateKycStatus(userId, status);
        },
        onSuccess: (_, variables) => {
            showToast(`Statut mis à jour : ${variables.status}`, 'success');
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }); // Invalidate global stats if needed
        },
        onError: (error) => {
            console.error('KYC update failed:', error);
            showToast('Erreur lors de la mise à jour du statut', 'error');
        }
    });

    // Helper functions
    const approveVendor = (userId: string) => updateKycMutation.mutate({ userId, status: 'APPROVED' });
    const rejectVendor = (userId: string) => updateKycMutation.mutate({ userId, status: 'REJECTED' });

    const goToPage = (p: number) => setPage(p);

    const changeStatusFilter = (status: 'Tous' | KycStatus) => {
        setStatusFilter(status);
        setPage(1);
    };

    return {
        // Data
        vendors: filteredVendors,
        totalVendors: pagination.total,
        pagination,
        isLoading,
        isError,
        
        // State
        filters: {
            searchQuery,
            status: statusFilter
        },
        
        // Actions
        setSearchQuery,
        setStatusFilter: changeStatusFilter,
        setPage: goToPage,
        approveVendor,
        rejectVendor,
        updateStatus: updateKycMutation.mutate,
        refresh: refetch
    };
};
