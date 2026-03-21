'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProfileDropdown } from './Header/components/ProfileDropdown';

export const DashboardHeader = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-gray-100/50 dark:border-white/5 h-16 md:h-20 shrink-0">
            <div className="container mx-auto max-w-7xl h-full px-4 lg:px-10 flex items-center justify-between">
                {/* Logo & Go Back */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 md:gap-2 cursor-pointer shrink-0"
                    >
                        <div className="flex items-center justify-center size-8 md:size-10 rounded-lg md:rounded-xl bg-[#4f46e5] shadow-lg shadow-indigo-500/20">
                            <span className="material-symbols-outlined text-white text-[20px] md:text-[24px]">
                                dashboard
                            </span>
                        </div>
                        <h1 className="text-[18px] md:text-xl font-black tracking-tighter uppercase">
                            <span className="text-[#4f46e5]">Wapi</span><span className="text-gray-900 dark:text-white">Bei</span>
                        </h1>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <Link
                        href="/"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-[#4f46e5] hover:bg-indigo-50 dark:hover:bg-white/5 rounded-full transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                        Retour au site
                    </Link>
                    
                    <div className="w-px h-6 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

                    <ProfileDropdown
                        isAuthenticated={isAuthenticated}
                        user={user}
                        onLogout={logout}
                        isProfileOpen={isProfileOpen}
                        setIsProfileOpen={setIsProfileOpen}
                    />
                </div>
            </div>
        </header>
    );
};
