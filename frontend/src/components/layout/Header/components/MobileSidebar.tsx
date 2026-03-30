'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { User } from '@/types/auth';
import { 
  X, 
  LayoutGrid, 
  Package, 
  Users, 
  GitCompare, 
  ShoppingCart, 
  User as UserIcon, 
  ShoppingBag, 
  Bell, 
  Store, 
  LogOut, 
  ArrowRight, 
  ShieldCheck, 
  Heart,
  Home,
  Store as StoreIcon,
  Layers,
  ArrowLeftRight
} from 'lucide-react';

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

// Map Material/String icon names to Lucide components
const IconMap: Record<string, React.ReactNode> = {
  'home': <Home size={18} />,
  'inventory_2': <Package size={18} />,
  'store': <StoreIcon size={18} />,
  'compare_arrows': <ArrowLeftRight size={18} />,
};

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

  // Prevent SSR issues
  if (!mounted) return null;

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
  };

  const sidebarContent = (
    <div className={`fixed inset-0 z-[99999] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#1e293b]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      ></div>
      
      {/* Sidebar Content */}
      <div 
        className={`absolute right-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-white dark:bg-[#0f172a] shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col rounded-l-[2.5rem] overflow-hidden`}
      >
        {/* Header - Profile Section */}
        <div className="relative overflow-hidden pt-12 pb-8 px-8 border-b border-gray-100 dark:border-white/5 bg-gradient-to-br from-gray-50 to-white dark:from-[#1e293b]/50 dark:to-[#0f172a]">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 size-10 flex items-center justify-center rounded-full bg-white dark:bg-white/5 shadow-sm border border-gray-100 dark:border-white/10 text-gray-400 hover:text-red-500 transition-all z-10"
          >
            <X size={20} />
          </button>

          {isAuthenticated ? (
            <div className="flex flex-col gap-5">
              <div className="size-16 rounded-2xl bg-gradient-to-tr from-[#E67E22] to-[#ff9d45] flex items-center justify-center text-white text-xl font-black shadow-xl shadow-orange-500/20 border-2 border-white dark:border-white/10 overflow-hidden relative group">
                {user?.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.fullName} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  getInitials(user?.fullName || '')
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#1e293b] dark:text-white uppercase tracking-tight italic">
                  {user?.fullName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${user?.role === 'VENDOR' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {user?.role === 'VENDOR' ? 'Vendeur' : 'Client'}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 truncate max-w-[150px]">{user?.email}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <h3 className="text-xl font-black text-[#1e293b] dark:text-white uppercase tracking-tight italic mb-6">Bienvenue</h3>
              <Link 
                href="/login"
                className="w-full py-4 flex items-center justify-center gap-3 bg-[#1e293b] dark:bg-white text-white dark:text-[#1e293b] rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200 dark:shadow-none"
                onClick={onClose}
              >
                Se connecter
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          
          {/* Main Marketplace */}
          <div className="space-y-3">
            <div className="px-4 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Navigation</span>
              <div className="h-px flex-1 ml-4 bg-gray-100 dark:bg-white/5 opacity-50" />
            </div>

            <div className="grid gap-1">
              {navLinks?.map((link) => (
                <Link 
                  key={link.id}
                  href={link.id}
                  onClick={onClose}
                  className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-extrabold uppercase tracking-tight transition-all ${isActive(link.id) ? 'bg-[#E67E22] text-white shadow-lg shadow-orange-500/20' : 'text-[#1e293b] dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-white/5'}`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${isActive(link.id) ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/5 group-hover:bg-[#E67E22]/10'}`}>
                    <span className={isActive(link.id) ? 'text-white' : 'text-[#E67E22]'}>
                      {IconMap[link.icon] || <LayoutGrid size={18} />}
                    </span>
                  </div>
                  {link.label}
                </Link>
              ))}

              <Link 
                href="/cart" 
                onClick={onClose}
                className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-extrabold uppercase tracking-tight transition-all ${isActive('/cart') ? 'bg-[#E67E22] text-white shadow-lg shadow-orange-500/20' : 'text-[#1e293b] dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-white/5'}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive('/cart') ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/5 group-hover:bg-[#E67E22]/10'}`}>
                   <ShoppingCart size={18} className={isActive('/cart') ? 'text-white' : 'text-[#E67E22]'} />
                </div>
                Mon Panier
              </Link>
            </div>
          </div>

          {/* User Section */}
          {isAuthenticated && (
            <div className="space-y-3">
              <div className="px-4 mb-2 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
                  {user?.role === 'VENDOR' ? 'Menu Vendeur' : 'Mon Espace'}
                </span>
                <div className="h-px flex-1 ml-4 bg-gray-100 dark:bg-white/5 opacity-50" />
              </div>

              <div className="grid gap-1">
                <Link href="/settings" onClick={onClose} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold text-[#1e293b] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <UserIcon size={18} className="text-indigo-500" /> Mon Compte
                </Link>

                <Link href="/dashboard/orders" onClick={onClose} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold text-[#1e293b] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <ShoppingBag size={18} className="text-indigo-500" /> Mes Commandes
                </Link>

                <Link href="/settings?tab=notifications" onClick={onClose} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold text-[#1e293b] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <Bell size={18} className="text-indigo-500" /> Notifications
                </Link>

                {user?.role === 'VENDOR' && (
                  <>
                    <Link href="/dashboard/store" onClick={onClose} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold text-[#1e293b] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                      <Store size={18} className="text-[#E67E22]" /> Ma Boutique
                    </Link>
                    <Link href="/dashboard/products" onClick={onClose} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold text-[#1e293b] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                      <Package size={18} className="text-[#E67E22]" /> Mes Produits
                    </Link>
                  </>
                )}

                {user?.role !== 'VENDOR' && (
                  <Link href="/dashboard/wishlist" onClick={onClose} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold text-[#1e293b] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                    <Heart size={18} className="text-red-500" /> Favoris
                  </Link>
                )}

                <button 
                  onClick={() => {
                     onLogout();
                     onClose();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[13px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left"
                >
                  <LogOut size={18} /> Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-8 bg-gray-50 dark:bg-white/5">
            <Link 
              href="/register?role=VENDOR"
              onClick={onClose}
              className="w-full py-5 bg-gradient-to-r from-[#E67E22] to-[#f39c12] text-white rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_15px_30px_-5px_rgba(230,126,34,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
                <Store size={18} />
                <span>Vendre sur WapiBei</span>
            </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(sidebarContent, document.body);
};
