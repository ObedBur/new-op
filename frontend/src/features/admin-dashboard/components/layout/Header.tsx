import React, { useState } from 'react';
import { useAdminTranslation, useNotifications, useClickOutside } from '@/features/admin-dashboard/hooks';
import { useAdminSearch } from '@/features/admin-dashboard/context';
import { NAV_ITEMS } from '@/features/admin-dashboard/constants';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
    activeView: string;
}

const Header: React.FC<HeaderProps> = ({
    activeView
}) => {
    const { searchQuery, setSearchQuery } = useAdminSearch();
    const onSearchChange = setSearchQuery;
    const { t } = useAdminTranslation();
    const { logout } = useAuth();
    const {
        notifications,
        isOpen: isNotificationOpen,
        toggleNotifications,
        closeNotifications,
        markAllAsRead
    } = useNotifications();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const notificationRef = useClickOutside<HTMLDivElement>(closeNotifications);
    const menuRef = useClickOutside<HTMLDivElement>(() => setIsMenuOpen(false));

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-40 bg-background-light/80 backdrop-blur-md pb-4 pt-4 px-4 md:px-8 border-b border-border-sep lg:border-none lg:bg-transparent lg:backdrop-blur-none lg:static">
            <div className="w-full md:w-auto flex items-center justify-between md:block">
                <div className="flex items-center gap-3">
                    <div className="lg:hidden" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`size-10 flex items-center justify-center rounded-full transition-all ${isMenuOpen ? 'bg-primary text-white shadow-lg rotate-90' : 'bg-white border border-border-sep text-deep-blue shadow-sm'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {isMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>

                        {/* Dropdown Menu Mobile Ultra Moderne */}
                        {isMenuOpen && (
                            <div className="absolute left-0 top-14 w-64 bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 origin-top overflow-hidden">
                                <div className="p-3 bg-gradient-to-br from-primary/5 to-transparent">
                                    <div className="px-3 py-2 mb-2">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t.nav.support}</p>
                                    </div>
                                    <div className="space-y-1">
                                        {NAV_ITEMS.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeView === item.view
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                                    : 'text-deep-blue font-bold hover:bg-white hover:shadow-md'
                                                    }`}
                                            >
                                                <div className={`size-8 rounded-xl flex items-center justify-center transition-colors ${activeView === item.view ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeView === item.view ? "'FILL' 1" : "'FILL' 0" }}>
                                                        {item.icon}
                                                    </span>
                                                </div>
                                                <span className="text-sm tracking-tight">{t.nav[item.id === '1' ? 'dashboard' : item.id === '2' ? 'vendors' : item.id === '3' ? 'products' : item.id === '4' ? 'users' : item.id === '5' ? 'reports' : 'settings']}</span>
                                                {activeView === item.view && (
                                                    <span className="material-symbols-outlined ml-auto text-sm opacity-50">check</span>
                                                )}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-100 px-3">
                                        <button 
                                            onClick={() => logout()}
                                            className="flex items-center gap-3 text-red-500 font-black text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-lg">logout</span>
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
                            className="size-10 flex items-center justify-center rounded-full bg-white border border-border-sep text-deep-blue transition-colors hover:bg-slate-50 hidden sm:flex lg:hidden"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back_ios</span>
                        </Link>
                    )}
                    <div>
                        <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1 opacity-50 flex-wrap">
                            <span className="whitespace-nowrap">WapiBei Admin</span>
                            <span className="material-symbols-outlined text-[12px] opacity-40">chevron_right</span>
                            <span className="text-primary whitespace-nowrap">
                                {activeView === 'Dashboard' ? t.nav.dashboard :
                                    activeView === 'Vendeurs' ? t.nav.vendors :
                                        activeView === 'Produits' ? t.nav.products :
                                            activeView === 'Utilisateurs' ? t.nav.users :
                                                activeView === 'Rapports' ? t.nav.reports :
                                                    activeView === 'Paramètres' ? t.nav.settings :
                                                        activeView}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-deep-blue tracking-tight leading-none">
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

                <div className="md:hidden" ref={notificationRef}>
                    <button
                        onClick={toggleNotifications}
                        className={`size-10 flex items-center justify-center rounded-full relative transition-all ${isNotificationOpen ? 'bg-primary text-white' : 'bg-white border border-border-sep text-deep-blue shadow-sm'
                            }`}
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {notifications.length > 0 && <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white animate-pulse"></span>}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto relative" ref={notificationRef}>
                <div className="relative flex-1 md:flex-initial group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">search</span>
                    <input
                        className="pl-12 pr-10 py-3 bg-white border border-border-sep rounded-xl text-sm w-full md:w-80 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted/60"
                        placeholder={t.header.search_placeholder}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-deep-blue"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    )}
                </div>

                <button
                    onClick={toggleNotifications}
                    className={`hidden md:flex size-11 items-center justify-center rounded-xl relative transition-all flex-shrink-0 ${isNotificationOpen ? 'bg-primary text-white shadow-lg' : 'bg-white border border-border-sep text-deep-blue hover:bg-slate-50 shadow-sm'
                        }`}
                >
                    <span className="material-symbols-outlined">notifications</span>
                    {notifications.length > 0 && (
                        <span className={`absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 ${isNotificationOpen ? 'border-primary' : 'border-white'} animate-pulse`}></span>
                    )}
                </button>

                {isNotificationOpen && (
                    <div className="absolute right-0 top-14 md:top-14 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-border-sep z-[110] animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h4 className="font-bold text-deep-blue">{t.header.notifications}</h4>
                            {notifications.length > 0 && (
                                <button onClick={markAllAsRead} className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">{t.header.mark_read}</button>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto no-scrollbar">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {notifications.map((n) => (
                                        <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="flex gap-3">
                                                <div className={`size-8 rounded-full shrink-0 flex items-center justify-center ${n.type === 'warning' ? 'bg-emerald-50 text-primary' :
                                                    n.type === 'success' ? 'bg-green-50 text-green-500' :
                                                        'bg-blue-50 text-blue-500'
                                                    }`}>
                                                    <span className="material-symbols-outlined text-lg">
                                                        {n.type === 'warning' ? 'warning' : n.type === 'success' ? 'check_circle' : 'info'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-deep-blue truncate">{n.title}</p>
                                                    <p className="text-xs text-muted line-clamp-1">{n.message}</p>
                                                    <p className="text-[10px] text-muted/60 mt-1 font-bold">{new Date(n.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center">
                                    <p className="text-xs font-bold text-muted">Aucune notification.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;


