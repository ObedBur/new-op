import { StatItem } from '@/features/admin-dashboard/types';

export const STATS_DATA: StatItem[] = [
    {
        id: '1',
        label: 'Ventes Totales',
        value: '1.2M $',
        trend: '+12.5%',
        trendUp: true,
        icon: 'payments',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
    },
    {
        id: '2',
        label: 'Nouveaux Vendeurs',
        value: '24',
        trend: '+18%',
        trendUp: true,
        icon: 'storefront',
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600'
    },
    {
        id: '3',
        label: 'Produits Actifs',
        value: '842',
        trend: '+5.2%',
        trendUp: true,
        icon: 'inventory_2',
        bgColor: 'bg-indigo-50',
        iconColor: 'text-indigo-600'
    },
    {
        id: '4',
        label: 'Signalements',
        value: '3',
        trend: '-2%',
        trendUp: false,
        icon: 'report_problem',
        bgColor: 'bg-red-50',
        iconColor: 'text-red-600'
    }
];

