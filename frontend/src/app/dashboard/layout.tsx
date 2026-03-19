'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const vendorNav = [
  { label: 'Mes Commandes', href: '/dashboard/orders', icon: 'shopping_bag' },
  { label: 'Ma Boutique', href: '/dashboard/store', icon: 'storefront' },
  { label: 'Mes Produits', href: '/dashboard/products', icon: 'inventory_2' },
  { label: 'Paramètres', href: '/settings', icon: 'settings' },
];

const clientNav = [
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
                <div className="size-20 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 relative z-10 border-4 border-white shadow-lg">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : user?.fullName ? (
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#003399] to-[#0055ff] flex items-center justify-center">
                      {getInitials(user?.fullName || '')}
                    </div>
                  )}
                </div>
                <h3 className="font-black text-deep-blue dark:text-white text-lg truncate">{user?.fullName || 'Utilisateur'}</h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                <span className={`inline-block mt-3 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user?.role === 'VENDOR' ? 'bg-[#E67E22]/10 text-[#E67E22]' : 'bg-[#003399]/10 text-[#003399]'}`}>
                  {user?.role === 'VENDOR' ? 'Vendeur' : 'Client'}
                </span>
              </div>

              {/* Nav */}
              <nav className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-sm p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${
                        isActive
                        ? 'bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/30 scale-[1.02]'
                        : 'text-[#64748b] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#003399] dark:hover:text-white hover:scale-[1.01]'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? '' : 'opacity-70'}`}>
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
                    className={`flex items-center gap-2 px-5 py-3 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                      isActive
                      ? 'bg-[#003399] text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white dark:bg-[#1a1a1a] text-[#64748b] border-2 border-transparent hover:bg-blue-50 dark:hover:bg-white/5 hover:text-[#003399] dark:hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
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
