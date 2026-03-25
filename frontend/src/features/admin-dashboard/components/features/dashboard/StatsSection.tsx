import { useAdminTranslation, useAdminStats } from '@/features/admin-dashboard/hooks';

const StatsSection: React.FC = () => {
    const { t } = useAdminTranslation();
    const { stats, isLoading } = useAdminStats();

    const statCards = [
        {
            id: '1',
            label: t.dashboard.stats.sales,
            value: stats ? `${(stats.sales.total / 1000).toFixed(0)}K $` : '0',
            icon: 'payments',
            bgColor: 'bg-emerald-500/10',
            iconColor: 'text-emerald-600',
            trend: '+12%',
            trendUp: true
        },
        {
            id: '2',
            label: t.dashboard.stats.new_vendors,
            value: stats?.users.vendors.toString() || '0',
            icon: 'storefront',
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-600',
            trend: `+${stats?.kyc.pending || 0}`,
            trendUp: true
        },
        {
            id: '3',
            label: t.dashboard.stats.active_products,
            value: stats?.products.total.toString() || '0',
            icon: 'inventory_2',
            bgColor: 'bg-amber-500/10',
            iconColor: 'text-amber-600',
            trend: 'Stable',
            trendUp: true
        },
        {
            id: '4',
            label: t.dashboard.stats.reports,
            value: stats?.kyc.pending.toString() || '0',
            icon: 'report_problem',
            bgColor: 'bg-red-500/10',
            iconColor: 'text-red-600',
            trend: 'Urgent',
            trendUp: false
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                    <div key={i} className="glass-card p-6 flex items-center gap-5 rounded-2xl">
                        <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-3">
                            <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full" />
                            <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full" />
                        </div>
                    </div>
                ))
            ) : (
                statCards.map((stat) => (
                    <div key={stat.id} className="glass-card rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                        <div className={`size-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 ${stat.bgColor} ${stat.iconColor} shrink-0`}>
                            <span className="material-symbols-outlined text-[28px]">
                                {stat.icon}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
                                    {stat.label}
                                </p>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.trendUp ? 'text-emerald-700 bg-emerald-100/50' : 'text-red-700 bg-red-100/50'
                                    }`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default StatsSection;
