'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    User, Store, Package, ShoppingBag,
    Bell, ShieldCheck, Settings as SettingsIcon, Heart, TrendingUp, LogOut, ArrowLeft
} from 'lucide-react';
import { User as UserType } from '@/types/auth';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';

interface VendorSidebarProps {
    user: UserType | null;
}

const VendorSidebarContent: React.FC<VendorSidebarProps> = ({ user }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab');
    const { count: wishlistCount } = useWishlist();
    const { logout } = useAuth();

    const navItems = [
        { id: 'profile', label: 'Mon Profil', href: '/settings', icon: User },
        ...((user?.role === 'VENDOR' || pathname?.startsWith('/dashboard')) ? [
            { id: 'orders', label: 'Mes Ventes', href: '/dashboard/orders', icon: Package },
            { id: 'products', label: 'Mes Produits', href: '/dashboard/products', icon: ShoppingBag },
            { id: 'analytics', label: 'Analytiques', href: '/dashboard/analytics', icon: TrendingUp },
        ] : [
            { id: 'orders', label: 'Mes Commandes', href: '/settings?tab=orders', icon: Package },
            { id: 'wishlist', label: 'Mes Favoris', href: '/settings?tab=favorites', icon: Heart },
        ]),
        { id: 'notifications', label: 'Notifications', href: '/settings?tab=notifications', icon: Bell },
        { id: 'security', label: 'Sécurité', href: '/settings?tab=security', icon: ShieldCheck },
        { id: 'preferences', label: 'Préférences', href: '/settings?tab=preferences', icon: SettingsIcon },
    ];

    return (
        <aside className="w-[60px] md:w-[260px] h-[100dvh] bg-white dark:bg-[#111827] border-r border-gray-100 dark:border-white/5 sticky top-0 flex flex-col shrink-0 z-40 transition-all duration-300">
            
            {/* LOGO */}
            <div className="h-[64px] md:h-[76px] px-0 md:px-8 flex items-center justify-center md:justify-start gap-3 border-b border-gray-100 dark:border-white/5 shrink-0">
                <Link href="/" className="flex items-center gap-2">
                    {/* WapiBei orange rounded logo with white circle */}
                    <div className="size-[28px] md:size-[30px] bg-[#E67E22] rounded-[10px] flex items-center justify-center shadow-sm shrink-0">
                        <div className="size-[10px] bg-white rounded-full" />
                    </div>
                    <span className="hidden md:inline text-[20px] font-black tracking-tight leading-none">
                        <span className="text-[#E67E22]">WAPI</span>
                        <span className="text-[#2D5A27] dark:text-[#52c140]">BEI</span>
                    </span>
                </Link>
            </div>

            {/* Subtitle / User Role */}
            <div className="hidden md:block px-8 pt-6 pb-2 shrink-0">
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
                    {user?.role === 'VENDOR' ? 'Menu Vendeur' : 'Menu Client'}
                </p>
            </div>

            {/* NAVIGATION LINKS */}
            <nav className="flex-grow px-2 md:px-4 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {navItems.map((item) => {
                    let isActive = false;
                    if (item.href.includes('?tab=')) {
                        const tabName = item.href.split('?tab=')[1];
                        isActive = currentTab === tabName;
                    } else if (item.href === '/settings') {
                        isActive = pathname === '/settings' && !currentTab;
                    } else {
                        isActive = pathname === item.href;
                    }

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            title={item.label}
                            className={`w-full relative flex items-center justify-center md:justify-start gap-0 md:gap-4 px-0 md:px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                                isActive
                                    ? 'bg-[#E67E22] text-white shadow-sm shadow-[#E67E22]/20'
                                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-white/5'
                            }`}
                        >
                            <item.icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                            <span className="hidden md:block">{item.label}</span>
                            {item.id === 'wishlist' && wishlistCount > 0 && (
                                <span className={`absolute md:static top-1.5 right-1.5 md:top-auto md:right-auto md:ml-auto px-1.5 md:px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-black tracking-tight flex items-center justify-center ${
                                    isActive ? 'bg-white text-[#E67E22]' : 'bg-[#E67E22] text-white shadow-sm'
                                }`}>
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom footer branding / Actions */}
            <div className="mt-auto p-4 md:p-6 border-t border-gray-100 dark:border-white/5 shrink-0 flex flex-col gap-2 md:gap-4">
                {/* Back to shop */}
                <Link
                    href="/"
                    title="Retour à la boutique"
                    className="w-full relative flex items-center justify-center md:justify-start gap-0 md:gap-4 px-0 md:px-5 py-3 rounded-xl text-sm font-semibold transition-all text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                >
                    <ArrowLeft size={20} className="shrink-0" />
                    <span className="hidden md:block">Retour à la boutique</span>
                </Link>

                {/* Logout */}
                <button
                    onClick={() => logout()}
                    className="w-full relative flex items-center justify-center md:justify-start gap-0 md:gap-4 px-0 md:px-5 py-3 rounded-xl text-sm font-semibold transition-all text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                    title="Déconnexion"
                >
                    <LogOut size={20} className="shrink-0" />
                    <span className="hidden md:block">Déconnexion</span>
                </button>
                <div className="hidden md:block bg-gray-50 dark:bg-white/5 rounded-2xl p-4 text-center">
                    <p className="text-xs font-black text-slate-800 dark:text-white tracking-tight">WapiBei App</p>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">Mon Compte WapiBei</p>
                </div>
            </div>
        </aside>
    );
};

export const VendorSidebar: React.FC<VendorSidebarProps> = (props) => {
    return (
        <Suspense fallback={<aside className="w-[60px] md:w-[260px] h-[100dvh] bg-white dark:bg-[#111827] border-r border-gray-100 dark:border-white/5 sticky top-0 shrink-0 z-40 transition-all duration-300"></aside>}>
            <VendorSidebarContent {...props} />
        </Suspense>
    );
};
