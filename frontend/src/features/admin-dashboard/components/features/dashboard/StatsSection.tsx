import React from 'react';
import { useAdminTranslation, useAdminStats } from '@/features/admin-dashboard/hooks';
import { DollarSign, Store, Package, AlertTriangle, LucideIcon } from 'lucide-react';

interface StatCardConfig {
    id: string;
    label: string;
    value: string;
    IconComponent: LucideIcon;
    bgColor: string;
    iconColor: string;
    trend: string;
    badgeStyle: string;
}

const StatsSection: React.FC = () => {
    const { t } = useAdminTranslation();
    const { stats, isLoading } = useAdminStats();

    const statCards: StatCardConfig[] = [
        {
            id: '1',
            label: t.dashboard.stats.sales,
            value: stats ? `${(stats.sales.total / 1000).toFixed(0)}K $` : '0 $',
            IconComponent: DollarSign,
            bgColor: 'bg-orange-50 border border-orange-200/60',
            iconColor: 'text-orange-600',
            trend: '+12%',
            badgeStyle: 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
        },
        {
            id: '2',
            label: t.dashboard.stats.new_vendors,
            value: stats?.users.vendors.toString() || '0',
            IconComponent: Store,
            bgColor: 'bg-emerald-50 border border-emerald-200/60',
            iconColor: 'text-emerald-600',
            trend: `+${stats?.kyc.pending || 0}`,
            badgeStyle: 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
        },
        {
            id: '3',
            label: t.dashboard.stats.active_products,
            value: stats?.products.total.toString() || '0',
            IconComponent: Package,
            bgColor: 'bg-blue-50 border border-blue-200/60',
            iconColor: 'text-blue-600',
            trend: 'Stable',
            badgeStyle: 'text-blue-700 bg-blue-50 border border-blue-200/60'
        },
        {
            id: '4',
            label: t.dashboard.stats.reports,
            value: stats?.kyc.pending.toString() || '0',
            IconComponent: AlertTriangle,
            bgColor: 'bg-rose-50 border border-rose-200/60',
            iconColor: 'text-rose-600',
            trend: 'Urgent',
            badgeStyle: 'text-rose-700 bg-rose-50 border border-rose-200/60'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                    <div key={i} className="bg-white p-5 flex items-center gap-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="size-12 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-16 bg-slate-100 animate-pulse rounded-full" />
                            <div className="h-6 w-20 bg-slate-100 animate-pulse rounded-full" />
                        </div>
                    </div>
                ))
            ) : (
                statCards.map((stat) => {
                    const Icon = stat.IconComponent;
                    return (
                        <div key={stat.id} className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group cursor-pointer">
                            <div className={`size-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${stat.bgColor} ${stat.iconColor} shrink-0`}>
                                <Icon className="size-5 shrink-0" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                        {stat.label}
                                    </p>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${stat.badgeStyle}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</p>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default StatsSection;
