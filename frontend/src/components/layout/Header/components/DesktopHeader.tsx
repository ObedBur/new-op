'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types/auth';
import { ProfileDropdown } from './ProfileDropdown';
import { useAppNotifications } from '@/hooks/useAppNotifications';

interface NavLink {
  id: string;
  label: string;
  icon: string;
}

interface DesktopHeaderProps {
  navLinks: NavLink[];
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  totalItems: number;
}

export const DesktopHeader = ({
  navLinks,
  isAuthenticated,
  user,
  logout,
  totalItems,
}: DesktopHeaderProps) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { unreadCount } = useAppNotifications();
  
  // Detect if current page is an authentication page
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp'].some(path => pathname.startsWith(path));

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="hidden lg:flex w-full h-20 xl:h-24 items-center justify-between px-4 xl:px-10 relative bg-transparent z-50">
      
      {/* --- LEFT ISLAND (Navigation or Home Button) --- */}
      <div 
        className="
          flex items-center gap-1
          bg-white/70 dark:bg-black/40 
          backdrop-blur-2xl
          px-4 py-2
          rounded-full 
          border border-white/40 dark:border-white/10
          shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
          transition-all duration-500
          hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
          z-20
        "
      >
        {isAuthPage ? (
          <Link
            href="/"
            className="px-4 xl:px-6 py-1.5 xl:py-2 rounded-full text-[10px] xl:text-xs font-bold tracking-widest[0.1em] uppercase bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/25 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px] xl:text-[18px]">arrow_back</span>
            Accueil
          </Link>
        ) : (
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.id}
                className={`
                  px-3 xl:px-5 py-1.5 xl:py-2 rounded-full text-[10px] xl:text-xs font-bold tracking-widest[0.1em] uppercase transition-all duration-300
                  ${isActive(link.id) 
                    ? 'bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/25' 
                    : 'text-gray-500 hover:text-[#E67E22] hover:bg-[#E67E22]/10 dark:hover:bg-[#E67E22]/20'}
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* --- CENTER BRAND (Floating Logo) --- */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none group z-10">
        <Link href="/" className="flex flex-col items-center pointer-events-auto">
          <h1 className="text-2xl xl:text-4xl font-black tracking-[0.2em] xl:tracking-[0.3em] drop-shadow-md group-hover:scale-105 transition-transform duration-500 uppercase">
            <span className="text-[#E67E22]">WAPI</span><span className="text-[#2D5A27]">BEI</span>
           </h1>
          <div className="w-8 xl:w-12 h-1 bg-[#E67E22] rounded-full mt-1 opacity-0 group-hover:opacity-100 group-hover:w-16 xl:group-hover:w-20 transition-all duration-500"></div>
        </Link>
      </div>

      {/* --- RIGHT ISLAND (Actions - Hidden on Auth Pages) --- */}
      {!isAuthPage && (
        <div 
          className="
            flex items-center gap-4
            bg-white/70 dark:bg-black/40 
            backdrop-blur-2xl
            px-3 xl:px-5 py-1.5 xl:py-2
            rounded-full 
            border border-white/40 dark:border-white/10
            shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
            transition-all duration-500
            hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
            z-20
          "
        >
          {/* Search */}
          <div className="relative flex items-center">
              {isSearchOpen ? (
                  <div className="flex items-center animate-in zoom-in-95 fade-in duration-300 bg-white/50 dark:bg-white/5 rounded-full px-4 py-1.5 border border-white/20">
                      <input 
                          type="text" 
                          placeholder="RECHERCHER..." 
                          className="bg-transparent border-none outline-none text-[10px] font-bold tracking-wider w-40 text-deep-blue dark:text-white placeholder-gray-400"
                          autoFocus
                          onBlur={(e) => !e.target.value && setIsSearchOpen(false)}
                      />
                      <button onClick={() => setIsSearchOpen(false)} className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                  </div>
              ) : (
                  <button 
                      onClick={() => setIsSearchOpen(true)}
                      className="size-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#E67E22] hover:bg-[#E67E22]/10 dark:hover:bg-[#E67E22]/20 rounded-full transition-all duration-300"
                      title="Rechercher"
                  >
                      <span className="material-symbols-outlined text-[22px]">search</span>
                  </button>
              )}
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-200 dark:bg-white/10"></div>

          {/* Notifications */}
          <Link
            href="/settings?tab=notifications"
            className="relative size-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#E67E22] hover:bg-[#E67E22]/10 dark:hover:bg-[#E67E22]/20 rounded-full transition-all duration-300"
          >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 size-1.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-black animate-pulse"></span>
              )}
          </Link>

          {/* Cart */}
          <Link 
              href="/cart"
              className="relative size-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#E67E22] hover:bg-[#E67E22]/10 dark:hover:bg-[#E67E22]/20 rounded-full transition-all duration-300"
          >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 bg-[#E67E22] text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-black">
                      {totalItems}
                  </span>
              )}
          </Link>
          
          {/* Profile */}
          <div className="ml-1">
            <ProfileDropdown 
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={logout}
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen} 
            />
          </div>
        </div>
      )}

      {/* Placeholder to keep alignment if right side is hidden on auth pages */}
      {isAuthPage && <div className="w-[120px] invisible"></div>}
    </div>
  );
};
