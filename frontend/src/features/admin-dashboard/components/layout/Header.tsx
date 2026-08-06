import React, { useState } from 'react';
import { useAdminTranslation, useNotifications, useClickOutside } from '@/features/admin-dashboard/hooks';
import { useAdminSearch } from '@/features/admin-dashboard/context';
import { NAV_ITEMS } from '@/features/admin-dashboard/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppNotification, resolveNotificationUrl } from '@/types/notification';
import {
    LayoutDashboard,
    Store,
    Package,
    Users,
    BarChart3,
    Settings,
    AlertTriangle,
    Search,
    Bell,
    X,
    Menu,
    ChevronRight,
    ChevronLeft,
    LogOut,
    CheckCircle,
    Info,
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

interface HeaderProps {
    activeView: string;
}

const Header: React.FC<HeaderProps> = ({
    activeView
}) => {
    const { searchQuery, setSearchQuery } = useAdminSearch();
    const onSearchChange = setSearchQuery;
    const { t } = useAdminTranslation();
    const { logout, user } = useAuth();
    const router = useRouter();
    const {
        notifications,
        unreadCount,
        isOpen: isNotificationOpen,
        toggleNotifications,
        closeNotifications,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    const handleNotificationClick = (notification: AppNotification) => {
        if (!notification.isRead) markAsRead(notification.id);
        closeNotifications();
        const url = resolveNotificationUrl(notification, user?.role);
        if (url) router.push(url);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const notificationRef = useClickOutside<HTMLDivElement>(closeNotifications);
    const menuRef = useClickOutside<HTMLDivElement>(() => setIsMenuOpen(false));

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md pb-4 pt-4 px-4 md:px-8 border-b border-slate-200/60 lg:border-none lg:bg-transparent lg:backdrop-blur-none lg:static">
            <div className="w-full md:w-auto flex items-center justify-between md:block">
                <div className="flex items-center gap-3">
                    <div className="lg:hidden" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`size-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                                isMenuOpen ? 'bg-orange-500 text-white shadow-md rotate-90' : 'bg-white border border-slate-200 text-slate-900 shadow-xs'
                            }`}
                        >
                            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>

                        {/* Dropdown Menu Mobile Ultra Moderne */}
                        {isMenuOpen && (
                            <div className="absolute left-0 top-14 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 origin-top overflow-hidden">
                                <div className="p-3">
                                    <div className="px-3 py-2 mb-1">
                                        <p className="text-[10px] font-extrabold text-orange-600 uppercase tracking-[0.2em]">{t.nav.support}</p>
                                    </div>
                                    <div className="space-y-1">
                                        {NAV_ITEMS.map((item) => {
                                            const IconComponent = LUCIDE_ICON_MAP[item.icon] || LayoutDashboard;
                                            return (
                                                <Link
                                                    key={item.id}
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${activeView === item.view
                                                        ? 'bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                                                        : 'text-slate-700 font-medium hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <div className={`size-8 rounded-lg flex items-center justify-center transition-colors ${activeView === item.view ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                        <IconComponent className="size-4 shrink-0" />
                                                    </div>
                                                    <span className="text-sm tracking-tight">{t.nav[item.id === '1' ? 'dashboard' : item.id === '2' ? 'vendors' : item.id === '3' ? 'products' : item.id === '4' ? 'users' : item.id === '5' ? 'reports' : 'settings']}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-slate-100 px-3">
                                        <button 
                                            onClick={() => logout()}
                                            className="flex items-center gap-2.5 text-red-500 font-bold text-xs uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <LogOut className="size-4" />
                                            {t.nav.logout}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {activeView !== 'Dashboard' && (
                        <Link
                            href="/admin"
                            className="size-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 hidden sm:flex lg:hidden"
                        >
                            <ChevronLeft className="size-5" />
                        </Link>
                    )}
                    <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex-wrap">
                            <span className="whitespace-nowrap">WapiBei Admin</span>
                            <ChevronRight className="size-3 text-slate-300" />
                            <span className="text-orange-500 font-extrabold whitespace-nowrap">
                                {activeView === 'Dashboard' ? t.nav.dashboard :
                                    activeView === 'Vendeurs' ? t.nav.vendors :
                                        activeView === 'Produits' ? t.nav.products :
                                            activeView === 'Utilisateurs' ? t.nav.users :
                                                activeView === 'Rapports' ? t.nav.reports :
                                                    activeView === 'Paramètres' ? t.nav.settings :
                                                        activeView}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                            {activeView === 'Dashboard' ? t.nav.dashboard :
                                activeView === 'Vendeurs' ? t.nav.vendors :
                                    activeView === 'Produits' ? t.nav.products :
                                        activeView === 'Utilisateurs' ? t.nav.users :
                                            activeView === 'Rapports' ? t.nav.reports :
                                                activeView === 'Paramètres' ? t.nav.settings :
                                                    activeView}
                        </h2>
                    </div>
                </div>

                <div className="md:hidden">
                    <button
                        onClick={toggleNotifications}
                        className={`size-10 flex items-center justify-center rounded-xl relative transition-all cursor-pointer ${
                            isNotificationOpen ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-900 shadow-xs'
                        }`}
                    >
                        <Bell className="size-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto relative" ref={notificationRef}>
                <div className="relative flex-1 md:flex-initial group">
                    <Search className="size-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                        className="pl-10 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-sm w-full md:w-80 shadow-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                        placeholder={t.header.search_placeholder}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 cursor-pointer"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <button
                    onClick={toggleNotifications}
                    className={`hidden md:flex size-9.5 items-center justify-center rounded-xl relative transition-all flex-shrink-0 cursor-pointer ${
                        isNotificationOpen ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                    }`}
                >
                    <Bell className="size-4.5" />
                    {unreadCount > 0 && (
                        <span className={`absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center border-2 ${isNotificationOpen ? 'border-orange-500' : 'border-white'} animate-pulse`}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {isNotificationOpen && (
                    <div className="absolute right-0 top-12 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-[110] animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                            <h4 className="font-bold text-slate-900 text-sm">{t.header.notifications}</h4>
                            {notifications.length > 0 && (
                                <button onClick={() => markAllAsRead()} className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider hover:underline cursor-pointer">{t.header.mark_read}</button>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto no-scrollbar">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {notifications.slice(0, 5).map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => handleNotificationClick(n)}
                                            className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group relative ${!n.isRead && 'bg-orange-500/[0.04]'}`}
                                        >
                                            {!n.isRead && <span className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />}
                                            <div className="flex gap-3">
                                                <div className={`size-8 rounded-full shrink-0 flex items-center justify-center ${n.type === 'SYSTEM_ALERT' ? 'bg-emerald-50 text-emerald-600' :
                                                    n.type === 'ORDER_CONFIRMED' || n.type === 'PAYMENT_RECEIVED' ? 'bg-green-50 text-green-600' :
                                                        'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {n.type === 'SYSTEM_ALERT' ? <AlertTriangle className="size-4" /> : n.type === 'ORDER_CONFIRMED' || n.type === 'PAYMENT_RECEIVED' ? <CheckCircle className="size-4" /> : <Info className="size-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-bold truncate ${n.isRead ? 'text-slate-500' : 'text-slate-900'}`}>{n.title}</p>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{n.message}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">{new Date(n.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                        <Bell className="size-5 text-slate-400" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-400">Aucune notification.</p>
                                </div>
                            )}
                        </div>
                        <Link
                            href="/admin/notifications"
                            onClick={closeNotifications}
                            className="block w-full p-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 hover:bg-slate-50 transition-colors border-t border-slate-100"
                        >
                            Voir toutes les notifications
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
