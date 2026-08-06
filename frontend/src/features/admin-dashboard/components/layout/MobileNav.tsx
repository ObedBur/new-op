import React from 'react';
import { NAV_ITEMS } from '@/features/admin-dashboard/constants';
import { useAdminTranslation } from '@/features/admin-dashboard/hooks';
import Link from 'next/link';
import {
    LayoutDashboard,
    Store,
    Package,
    Users,
    BarChart3,
    Settings,
    AlertTriangle,
    LucideIcon
} from 'lucide-react';

const LUCIDE_ICON_MAP: Record<string, LucideIcon> = {
    dashboard: LayoutDashboard,
    storefront: Store,
    inventory_2: Package,
    group: Users,
    assessment: BarChart3,
    settings: Settings,
    report_problem: AlertTriangle,
};

interface MobileNavProps {
    activeView: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeView }) => {
    const { t } = useAdminTranslation();
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50 pb-safe shadow-lg">
            <div className="flex justify-start sm:justify-around items-center overflow-x-auto no-scrollbar px-2 py-2 gap-2">
                {NAV_ITEMS.map((item) => {
                    const IconComponent = LUCIDE_ICON_MAP[item.icon] || LayoutDashboard;
                    const isActive = activeView === item.view;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px] shrink-0 ${
                                isActive ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <IconComponent className="size-5 shrink-0" />
                            <span className="text-[9px] font-extrabold uppercase tracking-tight text-center leading-tight">
                                {t.nav[item.translationKey]}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav;
