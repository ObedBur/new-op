'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/types/auth';

interface ProfileDropdownProps {
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ 
  isAuthenticated, 
  user,
  onLogout,
  isProfileOpen, 
  setIsProfileOpen 
}) => {
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsProfileOpen]);

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
  };

  // Build dynamic navigation based on user role
  const getNavItems = () => {
    let items = [
      { label: 'Mon Compte', href: '/settings' },
      { label: 'Mes Commandes', href: '/dashboard/orders' },
    ];

    if (user?.role === 'VENDOR') {
      // Links specific to Sellers
      items.push(
        { label: 'Ma Boutique', href: '/dashboard/store' },
        { label: 'Mes Produits', href: '/dashboard/products' }
      );
    } else {
      // Links specific to Customers
      items.push(
        { label: 'Mes Favoris', href: '/dashboard/wishlist' }
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="hidden md:block relative" ref={profileMenuRef}>
      {isAuthenticated ? (
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="group p-0.5 flex items-center gap-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300"
        >
          <div className="size-9 rounded-full bg-gradient-to-tr from-[#4f46e5] to-[#818cf8] flex items-center justify-center text-white text-xs font-black border-2 border-white dark:border-white/10 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden relative">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.fullName}
                fill
                className="object-cover"
              />
            ) : (
              getInitials(user?.fullName || '')
            )}
          </div>
          <div className="hidden xl:flex flex-col items-start pr-2">
            <span className="text-[10px] font-black text-deep-blue dark:text-white uppercase tracking-wider leading-tight">
              {user?.fullName?.split(' ')[0]}
            </span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">
              {user?.role === 'VENDOR' ? 'Vendeur' : 'Client'}
            </span>
          </div>
          <span className={`material-symbols-outlined text-[16px] text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
      ) : (
        <Link 
          href="/login"
            className="size-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#4f46e5] hover:bg-blue-50 dark:hover:bg-white/5 rounded-full transition-all duration-300"
            title="Se connecter"
        >
            <span className="material-symbols-outlined text-[24px]">account_circle</span>
        </Link>
      )}

      {isAuthenticated && isProfileOpen && (
        <div className="absolute right-0 mt-4 w-64 bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-white/5 overflow-hidden z-70 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-white dark:from-white/5 dark:to-transparent border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#4f46e5] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-500/20 overflow-hidden relative">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  getInitials(user?.fullName || '')
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-deep-blue dark:text-white truncate uppercase tracking-tight">
                  {user?.fullName}
                </p>
                <p className="text-[10px] text-gray-400 truncate font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-2.5">
            <div className="mb-1 px-2.5">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] py-2 block">
                Menu {user?.role === 'VENDOR' ? 'Vendeur' : 'Personnel'}
              </span>
            </div>

            <div className="space-y-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:bg-[#4f46e5]/5 dark:hover:bg-white/5 hover:text-[#4f46e5] transition-all group"
                >
                  {item.label}
                </Link>
              ))}

              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:bg-[#2D5A27]/5 dark:hover:bg-white/5 hover:text-[#2D5A27] transition-all group"
                >
                  <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-[#2D5A27] transition-colors">admin_panel_settings</span>
                  Administration
                </Link>
              )}
            </div>

            <div className="h-px bg-gray-100 dark:bg-white/5 my-2 mx-2"></div>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">logout</span>
              Se déconnecter
            </button>
          </div>

          {/* Footer/Badge */}
          <div className="p-3 bg-gray-50/50 dark:bg-white/5 text-center">
            <p className="text-[9px] font-black text-[#2D5A27] uppercase tracking-widest">WapiBei Exclusive</p>
          </div>
        </div>
      )}
    </div>
  );
};


