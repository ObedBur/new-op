'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
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

  return (
    <div className="hidden md:block relative" ref={profileMenuRef}>
      {isAuthenticated ? (
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="p-1 flex items-center gap-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
        >
          <div className="size-8 md:size-9 rounded-full bg-[#E67E22] flex items-center justify-center text-white text-[10px] md:text-xs font-black border-2 border-white dark:border-white/10 shadow-md">
            {getInitials(user?.fullName || '')}
          </div>
        </button>
      ) : (
        <Link 
          href="/login"
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#E67E22] transition-colors"
        >
          <span className="material-symbols-outlined text-[26px]">account_circle</span>
        </Link>
      )}

      {isAuthenticated && isProfileOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-70">
          <div className="p-4 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
            <p className="text-sm font-black text-deep-blue dark:text-white">{user?.fullName}</p>
            <p className="text-[11px] text-gray-500">{user?.email}</p>
          </div>
          <div className="p-2">
            <Link href="/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left">
              <span className="material-symbols-outlined text-gray-400">person</span> Mon Espace
            </Link>
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left">
                <span className="material-symbols-outlined text-gray-400">admin_panel_settings</span> Administration
              </Link>
            )}
            <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2"></div>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left">
              <span className="material-symbols-outlined">logout</span> Quitter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
