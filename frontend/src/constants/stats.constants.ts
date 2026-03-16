import { 
  CreditCard, 
  Store, 
  PackageSearch, 
  AlertCircle 
} from 'lucide-react';
import { StatItem } from '@/features/admin-dashboard/types';

export const STATS_DATA: StatItem[] = [
  {
    id: '1',
    label: 'Paiements',
    value: '0 FC',
    trend: '0%',
    trendUp: true,
    icon: CreditCard,
    bgColor: 'bg-blue-50 border border-blue-100', 
    iconColor: 'text-blue-600'
  },
  {
    id: '2',
    label: 'Nouveaux Vendeurs',
    value: '0',
    trend: '0%',
    trendUp: true,
    icon: Store,
    bgColor: 'bg-emerald-50 border border-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    id: '3',
    label: 'Produits Actifs',
    value: '0',
    trend: '0%',
    trendUp: true,
    icon: PackageSearch,
    bgColor: 'bg-indigo-50 border border-indigo-100',
    iconColor: 'text-indigo-600'
  },
  {
    id: '4',
    label: 'Signalements',
    value: '0',
    trend: '0%',
    trendUp: false,
    icon: AlertCircle,
    bgColor: 'bg-red-50 border border-red-100',
    iconColor: 'text-red-600'
  }
];