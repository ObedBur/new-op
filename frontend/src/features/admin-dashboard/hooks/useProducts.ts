import { useQuery } from '@tanstack/react-query';
import { adminService } from '../api/admin.api';
import { BackendProduct } from '@/core/contracts/product.contract';
import { QUARTERS } from '@/constants/enums';

interface UseProductsProps {
    searchQuery: string;
    page?: number;
    limit?: number;
}

interface ProductPagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export const useProducts = ({ searchQuery, page = 1, limit = 20 }: UseProductsProps) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['admin', 'products', { searchQuery, page, limit }],
        queryFn: async () => {
            const response = await adminService.getProducts({ 
                search: searchQuery,
                page,
                limit 
            });
            
            const items = response?.data || [];
            return {
                products: Array.isArray(items) ? items.map((p: BackendProduct) => ({
                    id: p.id,
                    name: p.name,
                    seller: p.user?.fullName || 'Vendeur Inconnu',
                    sellerEmail: p.user?.email,
                    sellerPhone: p.user?.phone,
                    price: p.price,
                    // Prefer quartier field, fallback to market.name for backward compat
                    quartier: p.quartier?.name || p.market?.name || QUARTERS.VIRUNGA,
                    ville: p.quartier?.ville,
                    province: p.quartier?.province,
                    lastUpdate: new Date(p.updatedAt).toLocaleDateString('fr-FR'),
                    createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : undefined,
                    category: p.category,
                    stock: p.stock,
                    description: p.description,
                    iconBg: 'bg-emerald-100/50',
                    iconColor: 'text-emerald-700'
                })) : [],
                pagination: response?.pagination as ProductPagination | undefined,
            };
        },
        enabled: true,
        staleTime: 30000,
    });

    return {
        products: data?.products || [],
        pagination: data?.pagination,
        isLoading,
        error: error ? (error instanceof Error ? error.message : 'Erreur lors du chargement') : null,
        refetch
    };
};
