import { NAV_ITEMS } from '@/features/admin-dashboard/constants';
import { useAdminLayout } from '@/features/admin-dashboard/context';
import { useAdminTranslation } from '@/features/admin-dashboard/hooks';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

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
            className={`hidden lg:flex shrink-0 flex-col fixed h-full z-50 bg-linear-to-b from-slate-900 to-slate-950 dark:from-sidebar-start dark:to-sidebar-end border-r border-white/5 text-slate-300 transition-all duration-300 ease-in-out backdrop-blur-xl ${isSidebarCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Brand Section */}
            <div className={`transition-all duration-300 relative overflow-hidden ${isSidebarCollapsed ? 'p-4 text-center' : 'px-6 py-8'}`}>
                {/* Accent glow behind logo */}
                <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-3 relative z-10">
                    <div className="size-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0">
                        <span className="material-symbols-outlined text-white text-2xl">shopping_basket</span>
                    </div>
                    {!isSidebarCollapsed && (
                        <h1 className="text-2xl font-black tracking-tighter text-white animate-in fade-in duration-500">
                            Wapi<span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">Bei</span>
                        </h1>
                    )}
                </div>
                {!isSidebarCollapsed && (
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.25em] mt-3 animate-in fade-in duration-500 pl-1">
                        Admin Afrique
                    </p>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-24 size-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 shadow-xl z-60 hover:scale-110 hover:text-white active:scale-95 transition-all group"
            >
                <span className="material-symbols-outlined text-sm group-hover:text-emerald-400">
                    {isSidebarCollapsed ? 'chevron_right' : 'chevron_left'}
                </span>
            </button>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto no-scrollbar pt-6">
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.id}
                        href={item.href}
                        icon={item.icon}
                        label={t.nav[item.translationKey]}
                        active={activeView === item.view}
                        collapsed={isSidebarCollapsed}
                        badge={item.badge}
                        badgeColor={item.badgeColor}
                    />
                ))}

                <div className={`pt-6 pb-2 transition-all ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                    <div className={`h-px bg-slate-800/50 mb-4 ${isSidebarCollapsed ? '' : 'mx-2'}`} />
                    {!isSidebarCollapsed && (
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] px-4">{t.nav.support}</span>
                    )}
                </div>

                <NavItem
                    href="/admin/reports/problem"
                    icon="report_problem"
                    label={t.nav.reports_problem}
                    active={activeView === 'Signalements'}
                    collapsed={isSidebarCollapsed}
                />
            </nav>

            {/* Profile Section */}
            <div className="p-4 border-t border-white/5 space-y-2 bg-slate-950/30">
                <div className={`flex items-center gap-3 p-2 rounded-xl transition-all ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start hover:bg-white/5'}`}>
                    <div className="size-9 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-slate-300 shrink-0">
                        {initials}
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="overflow-hidden animate-in slide-in-from-left-2 duration-300 min-w-0">
                            <p className="text-sm font-bold text-slate-200 truncate">{user?.fullName || 'Admin WapiBei'}</p>
                            <p className="text-[10px] text-emerald-500/80 truncate font-bold uppercase tracking-wide leading-none mt-1">
                                {user?.role === 'ADMIN' ? 'Online' : user?.role || 'Admin'}
                            </p>
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => logout()}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all group ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start'}`}
                >
                    <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">logout</span>
                    {!isSidebarCollapsed && <span className="text-xs font-semibold">{t.nav.logout}</span>}
                </button>
            </div>
        </aside>
    );
};

interface NavItemProps {
    href: string;
    icon: string;
    label: string;
    active: boolean;
    collapsed: boolean;
    badge?: number;
    badgeColor?: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, active, collapsed, badge, badgeColor }) => (
    <Link
        href={href}
        title={collapsed ? label : undefined}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative border border-transparent
            ${active 
                ? 'bg-linear-to-r from-emerald-500/10 to-transparent text-emerald-400 border-l-emerald-500' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            } 
            ${collapsed ? 'justify-center px-0' : 'justify-start'}
            ${active && !collapsed ? 'border-l-2 pl-[11px]' : ''}
        `}
    >
        <span className={`material-symbols-outlined transition-all text-[20px] 
            ${active ? 'text-emerald-400 shadow-emerald-500/50' : 'group-hover:text-white'}
        `}>
            {icon}
        </span>

        {!collapsed && (
            <span className={`text-sm tracking-wide text-left whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200 ${active ? 'font-semibold' : 'font-medium'}`}>
                {label}
            </span>
        )}

        {/* Badge */}
        {badge !== undefined && (
            <span className={`ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[9px] font-bold text-white shadow-sm transition-all ${badgeColor || 'bg-emerald-500'} ${collapsed ? 'absolute top-1 right-1 scale-75' : ''
                }`}>
                {badge}
            </span>
        )}
    </Link>
);

export default Sidebar;


