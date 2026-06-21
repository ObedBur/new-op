import { useQuery } from '@tanstack/react-query';
import { adminService } from '../api/admin.api';
import { BackendProduct } from '@/core/contracts/product.contract';
import { MARKETS } from '@/constants/enums';

interface UseProductsProps {
    searchQuery: string;
    limit?: number;
}

export const useProducts = ({ searchQuery, limit = 10 }: UseProductsProps) => {
    const { data: products = [], isLoading, error, refetch } = useQuery({
        queryKey: ['admin', 'products', { searchQuery, limit }],
        queryFn: async () => {
            const response = await adminService.getProducts({ 
                search: searchQuery,
                limit 
            });
            
            const data = response?.data || [];
            return Array.isArray(data) ? data.map((p: BackendProduct) => ({
                id: p.id,
                name: p.name,
                seller: p.user?.fullName || 'Vendeur Inconnu',
                price: p.price,
                market: p.market?.name || MARKETS.GOMA,
                lastUpdate: new Date(p.updatedAt).toLocaleDateString('fr-FR'),
                iconBg: 'bg-emerald-100/50',
                iconColor: 'text-emerald-700'
            })) : [];
        },
        enabled: true,
        staleTime: 30000, 
    });


    return {
        products,
        isLoading,
        error: error ? (error instanceof Error ? error.message : 'Erreur lors du chargement') : null,
        refetch
    };
};

