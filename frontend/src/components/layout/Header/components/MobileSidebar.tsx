'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types/auth';

interface NavLink {
  id: string;
  label: string;
  icon: string;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  isOpen, 
  onClose, 
  navLinks, 
  isAuthenticated, 
  user,
  onLogout
}) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
  };

  if (!mounted) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[99999] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`absolute right-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-white dark:bg-[#111] shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        {/* Header Section */}
        <div className="p-4 bg-orange-50/50 dark:bg-orange-950/10 border-b border-orange-100/50">
          <div className="flex justify-end mb-1">
              <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <span className="material-symbols-outlined text-gray-500 text-[20px]">close</span>
              </button>
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-[#E67E22] flex items-center justify-center text-white text-base font-black shadow-md border-2 border-white dark:border-white/10">
                    {getInitials(user?.fullName || '')}
                </div>
                <div className="min-w-0">
                    <p className="text-base font-black text-[#2D5A27] dark:text-white truncate leading-tight">{user?.fullName}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                </div>
            </div>
          ) : (
            <Link 
              href="/login"
              className="w-full py-3.5 flex items-center justify-center gap-3 bg-white dark:bg-white/10 border-2 border-[#E67E22]/20 rounded-xl text-[#E67E22] font-black uppercase text-[10px] tracking-widest hover:bg-orange-50 transition-all shadow-sm"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              Se connecter
            </Link>
          )}
        </div>

        {/* Links Section */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1.5">
            <div className="px-2 mb-3">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Marketplace Navigation</span>
            </div>

           {navLinks && navLinks.length > 0 ? (
             navLinks.map((link) => (
                <Link 
                  key={link.id}
                  href={link.id}
                  onClick={onClose}
                  className={`w-full h-12 flex items-center gap-4 px-4 rounded-xl text-[13px] font-black uppercase tracking-tight transition-all ${
                    isActive(link.id) 
                    ? 'bg-[#E67E22] text-white shadow-md shadow-[#E67E22]/20' 
                    : 'text-[#2D5A27] dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive(link.id) ? 'text-white' : 'text-[#E67E22]'}`}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))
           ) : null}
            
            <div className="h-px bg-gray-100 dark:bg-white/5 my-3 mx-2"></div>

            <Link 
              href="/cart"
              onClick={onClose}
              className={`w-full h-12 flex items-center gap-4 px-4 rounded-xl text-[13px] font-black uppercase tracking-tight transition-all ${
                isActive('/cart') 
                ? 'bg-[#E67E22] text-white shadow-md shadow-[#E67E22]/20' 
                : 'text-[#2D5A27] dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-white/5'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive('/cart') ? 'text-white' : 'text-[#E67E22]'}`}>
                shopping_cart
              </span>
              Panier
            </Link>

            {isAuthenticated && (
              <>
                <div className="pt-6 px-3 mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Menu {user?.role === 'VENDOR' ? 'Vendeur' : 'Personnel'}
                </span>
                </div>
                <Link href="/dashboard" onClick={onClose} className="w-full h-11 flex items-center gap-4 px-4 rounded-xl text-sm font-bold text-[#2D5A27] dark:text-gray-300 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-[#E67E22] text-[20px]">dashboard</span> Mon Compte
              </Link>
              <Link href="/dashboard/orders" onClick={onClose} className="w-full h-11 flex items-center gap-4 px-4 rounded-xl text-sm font-bold text-[#2D5A27] dark:text-gray-300 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-[#E67E22] text-[20px]">shopping_bag</span> Mes Commandes
              </Link>

              {user?.role === 'VENDOR' ? (
                <>
                  <Link href="/dashboard/store" onClick={onClose} className="w-full h-11 flex items-center gap-4 px-4 rounded-xl text-sm font-bold text-[#2D5A27] dark:text-gray-300 hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-[#E67E22] text-[20px]">storefront</span> Ma Boutique
                  </Link>
                  <Link href="/dashboard/products" onClick={onClose} className="w-full h-11 flex items-center gap-4 px-4 rounded-xl text-sm font-bold text-[#2D5A27] dark:text-gray-300 hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-[#E67E22] text-[20px]">inventory_2</span> Mes Produits
                  </Link>
                </>
              ) : (
                <Link href="/dashboard/wishlist" onClick={onClose} className="w-full h-11 flex items-center gap-4 px-4 rounded-xl text-sm font-bold text-[#2D5A27] dark:text-gray-300 hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[#E67E22] text-[20px]">favorite</span> Mes Favoris
                </Link>
              )}

              <Link href="/settings" onClick={onClose} className="w-full h-11 flex items-center gap-4 px-4 rounded-xl text-sm font-bold text-[#2D5A27] dark:text-gray-300 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-[#E67E22] text-[20px]">settings</span> Paramètres
                </Link>

                {user?.role === 'ADMIN' && (
                  <Link href="/admin" onClick={onClose} className="w-full h-11 flex items-center gap-4 px-4 rounded-xl text-sm font-bold text-[#2D5A27] dark:text-gray-300 hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-[#E67E22] text-[20px]">admin_panel_settings</span> Administration
                  </Link>
                )}

                <button 
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full h-11 flex items-center gap-4 px-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                <span className="material-symbols-outlined text-[20px]">logout</span> Se déconnecter
                </button>
              </>
            )}
        </div>

        {/* Footer Section */}
        <div className="p-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
            <Link 
              href="/register?role=VENDOR"
              onClick={onClose}
              className="w-full py-4 bg-[#E67E22] text-white rounded-xl font-black shadow-lg shadow-[#E67E22]/30 flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Vendre sur WapiBei
            </Link>
        </div>
      </div>
    </div>,
    document.body
  );
};
