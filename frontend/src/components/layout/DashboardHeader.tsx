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
                        className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
                    >
                        <div className="flex items-center justify-center size-9 rounded-xl bg-[#E67E22] shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                             <div className="size-4 bg-white rounded-sm rotate-45" />
                        </div>
                        <h1 className="text-xl font-black tracking-tighter uppercase flex items-center">
                            <span className="text-[#E67E22]">Wapi</span>
                            <span className="text-[#2D5A27] dark:text-[#52c140]">Bei</span>
                        </h1>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-6">
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
