'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    User, Store, Package, ShoppingBag,
    Bell, ShieldCheck, Settings as SettingsIcon, Heart, TrendingUp
} from 'lucide-react';
import { User as UserType } from '@/types/auth';
import { useWishlist } from '@/hooks/useWishlist';

interface VendorSidebarProps {
    user: UserType | null;
    isMobileOnly?: boolean;
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({ user, isMobileOnly = false }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab');
    const { count: wishlistCount } = useWishlist();

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

    if (isMobileOnly) {
        return (
            <div className="w-full bg-white dark:bg-[#080b14] border-b border-gray-100 dark:border-white/5 sticky top-0 z-40 py-2">
                <div className="flex items-center justify-around w-full max-w-md md:max-w-2xl mx-auto px-2 md:px-6">
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
                                className={`relative p-2.5 sm:p-3 md:p-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                    isActive
                                        ? 'bg-[#E67E22] text-white shadow-md shadow-[#E67E22]/20 scale-105'
                                        : 'text-slate-400 dark:text-slate-500 hover:text-[#E67E22] dark:hover:text-[#E67E22] hover:bg-orange-50 dark:hover:bg-orange-500/10'
                                }`}
                            >
                                <item.icon className="w-[22px] h-[22px] md:w-6 md:h-6" strokeWidth={isActive ? 2.5 : 2} />
                                {item.id === 'wishlist' && wishlistCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 size-2.5 md:size-3 rounded-full bg-red-500 border-2 border-white dark:border-[#080b14]"></span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <aside className="w-[260px] h-screen bg-white dark:bg-[#111827] border-r border-gray-100 dark:border-white/5 sticky top-0 flex flex-col shrink-0 z-40">
            
            {/* LOGO */}
            <div className="h-[76px] px-8 flex items-center gap-3 border-b border-gray-100 dark:border-white/5">
                <Link href="/" className="flex items-center gap-2">
                    {/* WapiBei orange rounded logo with white circle */}
                    <div className="size-[30px] bg-[#E67E22] rounded-[10px] flex items-center justify-center shadow-sm shrink-0">
                        <div className="size-[10px] bg-white rounded-full" />
                    </div>
                    <span className="text-[20px] font-black tracking-tight leading-none">
                        <span className="text-[#E67E22]">WAPI</span>
                        <span className="text-[#2D5A27] dark:text-[#52c140]">BEI</span>
                    </span>
                </Link>
            </div>

            {/* Subtitle / User Role */}
            <div className="px-8 pt-6 pb-2">
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
                    {user?.role === 'VENDOR' ? 'Menu Vendeur' : 'Menu Client'}
                </p>
            </div>

            {/* NAVIGATION LINKS */}
            <nav className="flex-grow px-4 py-4 space-y-1.5 overflow-y-auto">
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
                            className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                                isActive
                                    ? 'bg-[#E67E22] text-white shadow-sm shadow-[#E67E22]/20'
                                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-white/5'
                            }`}
                        >
                            <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
                            <span>{item.label}</span>
                            {item.id === 'wishlist' && wishlistCount > 0 && (
                                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight ${
                                    isActive ? 'bg-white text-[#E67E22]' : 'bg-[#E67E22] text-white shadow-sm'
                                }`}>
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom footer branding */}
            <div className="p-6 border-t border-gray-100 dark:border-white/5">
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 text-center">
                    <p className="text-xs font-black text-slate-800 dark:text-white tracking-tight">WapiBei App</p>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">Mon Compte WapiBei</p>
                </div>
            </div>
        </aside>
    );
};
