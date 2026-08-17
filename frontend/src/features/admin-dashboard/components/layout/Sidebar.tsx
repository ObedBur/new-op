import React from 'react';
import { NAV_ITEMS } from '@/features/admin-dashboard/constants';
import { useAdminLayout } from '@/features/admin-dashboard/context';
import { useAdminTranslation } from '@/features/admin-dashboard/hooks';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
    LayoutDashboard,
    Store,
    Package,
    Users,
    BarChart3,
    Settings,
    AlertTriangle,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    LogOut,
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

interface SidebarProps {
    activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView }) => {
    const { isSidebarCollapsed, toggleSidebar } = useAdminLayout();
    const { t } = useAdminTranslation();
    const { user, logout } = useAuth();

    // Get initials from fullName
    const getInitials = (name: string) => {
        if (!name) return 'AD';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const initials = getInitials(user?.fullName || '');

    return (
        <aside
            className={`hidden lg:flex shrink-0 flex-col fixed h-full z-50 bg-white border-r border-slate-200/80 text-slate-700 shadow-xs transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* Brand Section */}
            <div className={`transition-all duration-300 relative overflow-hidden ${isSidebarCollapsed ? 'p-4 text-center' : 'px-6 py-6 border-b border-slate-100'}`}>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="size-10 rounded-xl bg-linear-to-br from-orange-500 to-emerald-600 flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
                        <ShoppingBag className="size-5 text-white" />
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black tracking-tight text-slate-900 animate-in fade-in duration-500">
                                Wapi<span className="text-orange-500">Bei</span>
                            </h1>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full w-max mt-0.5">
                                Admin Afrique
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3.5 top-8 size-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 shadow-md z-60 hover:scale-110 hover:text-slate-900 hover:border-slate-300 active:scale-95 transition-all group cursor-pointer"
            >
                {isSidebarCollapsed ? (
                    <ChevronRight className="size-4 group-hover:text-emerald-600" />
                ) : (
                    <ChevronLeft className="size-4 group-hover:text-emerald-600" />
                )}
            </button>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar py-6">
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.id}
                        href={item.href}
                        iconKey={item.icon}
                        label={t.nav[item.translationKey]}
                        active={activeView === item.view}
                        collapsed={isSidebarCollapsed}
                        badge={item.badge}
                        badgeColor={item.badgeColor}
                    />
                ))}

                <div className={`pt-6 pb-2 transition-all ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                    <div className={`h-px bg-slate-100 mb-3 ${isSidebarCollapsed ? '' : 'mx-2'}`} />
                    {!isSidebarCollapsed && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] px-4">{t.nav.support}</span>
                    )}
                </div>

                <NavItem
                    href="/admin/reports"
                    iconKey="report_problem"
                    label={t.nav.reports_problem}
                    active={activeView === 'Signalements' || activeView === 'Rapports'}
                    collapsed={isSidebarCollapsed}
                />
            </nav>

            {/* Profile Section */}
            <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
                <div className={`flex items-center gap-3 p-2 rounded-xl transition-all ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start hover:bg-white hover:shadow-xs'}`}>
                    <div className="size-9 rounded-lg bg-linear-to-br from-emerald-600 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                        {initials}
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="overflow-hidden animate-in slide-in-from-left-2 duration-300 min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName || 'Admin WapiBei'}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-[10px] text-orange-600 truncate font-semibold uppercase tracking-wide leading-none">
                                    {user?.role === 'ADMIN' ? 'En ligne' : user?.role || 'Admin'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => logout()}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all group cursor-pointer ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start'}`}
                >
                    <LogOut className="size-4.5 transition-transform group-hover:-translate-x-0.5" />
                    {!isSidebarCollapsed && <span className="text-xs font-semibold">{t.nav.logout}</span>}
                </button>
            </div>
        </aside>
    );
};

interface NavItemProps {
    href: string;
    iconKey: string;
    label: string;
    active: boolean;
    collapsed: boolean;
    badge?: number;
    badgeColor?: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, iconKey, label, active, collapsed, badge, badgeColor }) => {
    const IconComponent = LUCIDE_ICON_MAP[iconKey] || LayoutDashboard;

    return (
        <Link
            href={href}
            title={collapsed ? label : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group relative
                ${active 
                    ? 'bg-emerald-50 text-emerald-800 font-bold border-l border-emerald-600 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                } 
                ${collapsed ? 'justify-center px-0' : 'justify-start'}
                ${active && !collapsed ? 'pl-3' : ''}
            `}
        >
            <IconComponent className={`size-5 transition-colors shrink-0 ${
                active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-700'
            }`} />

            {!collapsed && (
                <span className={`text-sm tracking-tight text-left whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200 ${active ? 'font-bold' : 'font-medium'}`}>
                    {label}
                </span>
            )}

            {/* Badge */}
            {badge !== undefined && (
                <span className={`ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[9px] font-bold text-white shadow-xs transition-all ${badgeColor || 'bg-orange-500'} ${collapsed ? 'absolute top-1 right-1 scale-75' : ''
                    }`}>
                    {badge}
                </span>
            )}
        </Link>
    );
};

export default Sidebar;
