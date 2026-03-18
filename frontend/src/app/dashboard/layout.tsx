'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const vendorNav = [
  { label: 'Mon Compte', href: '/dashboard', icon: 'dashboard' },
  { label: 'Mes Commandes', href: '/dashboard/orders', icon: 'shopping_bag' },
  { label: 'Ma Boutique', href: '/dashboard/store', icon: 'storefront' },
  { label: 'Mes Produits', href: '/dashboard/products', icon: 'inventory_2' },
  { label: 'Paramètres', href: '/settings', icon: 'settings' },
];

const clientNav = [
  { label: 'Mon Compte', href: '/dashboard', icon: 'dashboard' },
  { label: 'Mes Commandes', href: '/dashboard/orders', icon: 'shopping_bag' },
  { label: 'Mes Favoris', href: '/dashboard/wishlist', icon: 'favorite' },
  { label: 'Paramètres', href: '/settings', icon: 'settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const navItems = user?.role === 'VENDOR' ? vendorNav : clientNav;

  const getInitials = (name: string) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';

  return (
    <main className="flex-1 pt-20">
      <section className="container mx-auto max-w-7xl px-4 py-6 md:py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28 space-y-6">
              {/* User Card */}
              <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-black/5 p-6 text-center">
                <div className="size-20 rounded-2xl bg-gradient-to-tr from-[#E67E22] to-[#FF9D4D] flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg shadow-orange-500/20">
                  {getInitials(user?.fullName || '')}
                </div>
                <h3 className="font-black text-deep-blue dark:text-white text-lg truncate">{user?.fullName}</h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                <span className="inline-block mt-3 px-4 py-1 rounded-full bg-[#E67E22]/10 text-[#E67E22] text-[10px] font-black uppercase tracking-widest">
                  {user?.role === 'VENDOR' ? 'Vendeur' : 'Client'}
                </span>
              </div>

              {/* Nav */}
              <nav className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-black/5 p-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/20 scale-[1.02]'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-deep-blue dark:hover:text-white'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[22px] ${isActive ? '' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Mobile Nav */}
          <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 w-max pb-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#E67E22] text-white shadow-md shadow-[#E67E22]/20'
                        : 'bg-white dark:bg-[#1a1a1a] text-gray-500 border border-gray-100 dark:border-white/10 hover:border-[#E67E22]/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
