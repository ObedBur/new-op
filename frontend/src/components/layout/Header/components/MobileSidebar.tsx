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
  ShoppingCart, 
  User as UserIcon, 
  Settings,
  LogOut, 
  ArrowRight, 
  Home,
  Store as StoreIcon,
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

  if (!mounted) return null;

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
  };

  const sidebarContent = (
    <div className={`fixed inset-0 z-[99999] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-[#1e293b]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      ></div>
      
      <div 
        className={`absolute right-0 top-0 bottom-0 w-[300px] max-w-[80vw] bg-white dark:bg-[#0f172a] shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col rounded-l-[2rem] overflow-hidden`}
      >
        {/* Header - Minimalist Profile */}
        <div className="relative pt-6 pb-6 px-6 sm:px-8 border-b border-gray-100 dark:border-white/5 bg-gradient-to-br from-gray-50 to-white dark:from-[#1e293b]/50 dark:to-[#0f172a]">
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black tracking-widest text-[#E67E22] uppercase">Menu</span>
            <button 
              onClick={onClose} 
              className="size-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-[#E67E22] flex items-center justify-center text-white text-lg font-black shadow-lg shadow-orange-500/20 border-2 border-white dark:border-white/10 overflow-hidden relative">
                {user?.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.fullName} fill className="object-cover" />
                ) : (
                  getInitials(user?.fullName || '')
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-[#1e293b] dark:text-white truncate uppercase tracking-tight italic">
                  {user?.fullName?.split(' ')[0]}
                </p>
                <div className="flex items-center gap-1.5 opacity-60">
                   <div className={`size-1.5 rounded-full ${user?.role === 'VENDOR' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                   <span className="text-[9px] font-bold uppercase tracking-widest">{user?.role === 'VENDOR' ? 'Vendeur' : 'Client'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Link 
                href="/login"
                className="w-full py-3 flex items-center justify-center gap-2 bg-[#1e293b] dark:bg-white text-white dark:text-[#1e293b] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 dark:shadow-none"
                onClick={onClose}
              >
                Se connecter <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* Scrollable Navigation - Minimal Textual List */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-4 scrollbar-hide">
          
          <div className="space-y-1">
            <div className="px-6 mb-2">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em]">Navigation</span>
            </div>

            <div className="grid gap-1 px-2">
              {navLinks?.map((link) => (
                <Link 
                  key={link.id}
                  href={link.id}
                  onClick={onClose}
                  className={`w-full block px-4 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-tight transition-all ${isActive(link.id) ? 'bg-[#E67E22] text-white shadow-md shadow-[#E67E22]/20' : 'text-[#1e293b] dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-white/5'}`}
                >
                  {link.label}
                </Link>
              ))}

              <Link 
                href="/cart" 
                onClick={onClose}
                className={`w-full block px-4 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-tight transition-all mt-2 ${isActive('/cart') ? 'bg-[#E67E22] text-white shadow-md shadow-[#E67E22]/20' : 'text-[#1e293b] dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-white/5'}`}
              >
                Mon Panier
              </Link>

              {isAuthenticated && (
                <Link 
                  href="/settings" 
                  onClick={onClose}
                  className={`w-full block px-4 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-tight transition-all ${isActive('/settings') ? 'bg-[#E67E22] text-white shadow-md shadow-[#E67E22]/20' : 'text-[#1e293b] dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-white/5'}`}
                >
                  Paramètres
                </Link>
              )}
            </div>
          </div>

          {/* Logout Section */}
          {isAuthenticated && (
            <div className="pt-2 mt-2 px-2 border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => { onLogout(); onClose(); }}
                  className="w-full block px-4 py-2.5 rounded-xl text-[11px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left uppercase tracking-wider"
                >
                  Se déconnecter
                </button>
            </div>
          )}
        </div>

        {/* Brand Footer */}
        <div className="p-4 px-6 border-t border-gray-100 dark:border-white/5">
            <Link 
              href="/register?role=VENDOR"
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-[#E67E22] to-[#f39c12] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
                <span>Vendre sur WapiBei</span>
            </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(sidebarContent, document.body);
};
