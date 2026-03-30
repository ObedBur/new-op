'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    User, Store, Package, ShoppingBag,
    Bell, ShieldCheck, Settings as SettingsIcon, Heart
} from 'lucide-react';
import { User as UserType } from '@/types/auth';

interface VendorSidebarProps {
    user: UserType | null;
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({ user }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab');

    const navItems = [
        { id: 'profile', label: 'Mon Profil', href: '/settings', icon: User },
        ...(user?.role === 'VENDOR' ? [
            { id: 'orders', label: 'Mes Commandes', href: '/dashboard/orders', icon: Package },
            { id: 'products', label: 'Mes Produits', href: '/dashboard/products', icon: ShoppingBag },
        ] : [
            { id: 'favorites', label: 'Mes Favoris', href: '/dashboard/wishlist', icon: Heart },
        ]),
        { id: 'notifications', label: 'Notifications', href: '/settings?tab=notifications', icon: Bell },
        { id: 'security', label: 'Sécurité', href: '/settings?tab=security', icon: ShieldCheck },
        { id: 'preferences', label: 'Préférences', href: '/settings?tab=preferences', icon: SettingsIcon },
    ];

    return (
        <>
            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden lg:block w-full lg:w-72 shrink-0 h-full">
                <div className="bg-white dark:bg-[#151b2c] rounded-[2rem] p-9 shadow-sm shadow-gray-200/50 sticky top-28 h-full flex flex-col">
                    <h1 className="text-[28px] font-black text-[#1e293b] dark:text-white leading-none">
                        {user?.role === 'VENDOR' ? 'Menu Vendeur' : 'Menu Client'}
                    </h1>
                    <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.15em] mt-3 mb-10">
                        Mon Compte WapiBei
                    </p>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            let isActive = false;
                            if (item.href.includes('?tab=')) {
                                const tabName = item.href.split('?tab=')[1];
                                isActive = currentTab === tabName;
                            } else if (item.href === '/settings') {
                                // Profil is active if we are on /settings and there is no tab
                                isActive = pathname === '/settings' && !currentTab;
                            } else {
                                isActive = pathname === item.href;
                            }

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[15px] font-bold transition-all duration-300 ${isActive
                                        ? "bg-orange-50 dark:bg-orange-500/10 text-[#E67E22]"
                                        : "text-[#64748b] hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-[#2D5A27] dark:hover:text-[#52c140]"
                                        }`}
                                >
                                    <item.icon className={`size-5 ${isActive ? "text-[#E67E22]" : "text-[#94a3b8]"}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* --- MOBILE NAV (Native App Look) --- */}
            <div className="lg:hidden w-screen -mx-4 px-4 sticky top-[60px] md:top-20 z-40 bg-white/90 dark:bg-[#080b14]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5 pb-2 mb-2">
                <div className="overflow-x-auto scrollbar-hide flex gap-2 w-full pt-3 pb-2">
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
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${isActive
                                    ? 'bg-orange-50 dark:bg-orange-500/10 text-[#E67E22] ring-1 ring-orange-100 dark:ring-orange-500/30'
                                    : 'bg-gray-50 dark:bg-white/5 text-[#64748b] hover:bg-green-50 dark:hover:bg-green-500/5 hover:text-[#2D5A27]'
                                    }`}
                            >
                                <item.icon className={`size-[15px] ${isActive ? "text-[#E67E22]" : "text-[#94a3b8]"}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
