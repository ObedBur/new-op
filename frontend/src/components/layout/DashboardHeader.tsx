'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProfileDropdown } from './Header/components/ProfileDropdown';
import { Search, Bell, Mail } from 'lucide-react';

export const DashboardHeader = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-black/[0.03] dark:border-white/5 h-16 md:h-20 shrink-0">
            <div className="container mx-auto max-w-7xl h-full px-6 md:px-12 lg:px-16 flex items-center justify-between">
                
                {/* Left Side: Logo & Home Link (shown on mobile, hidden on desktop sidebar layout) */}
                <div className="flex items-center gap-6 md:hidden">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
                    >
                        <div className="flex items-center justify-center size-9 rounded-xl bg-[#E67E22] shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
                             <div className="size-4 bg-white rounded-sm rotate-45" />
                        </div>
                        <h1 className="text-xl font-black tracking-tighter uppercase flex items-center">
                            <span className="text-[#E67E22]">Wapi</span>
                            <span className="text-[#2D5A27] dark:text-[#52c140]">Bei</span>
                        </h1>
                    </Link>
                </div>

                {/* Center: Dribbble/Puzzler Pill Search Bar (hidden on mobile) */}
                <div className="relative w-64 md:w-80 hidden md:block">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={16} className="text-slate-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="w-full bg-[#F3F4F6] dark:bg-white/5 border-none rounded-full pl-11 pr-4 py-2 text-sm placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#E67E22]/10 dark:text-white"
                    />
                </div>

                {/* Right Side: Chat, Notification Bell, Divider & Profile Dropdown */}
                <div className="flex items-center gap-4 sm:gap-6">
                    
                    {/* Chat Icon with notification dot */}
                    <button className="hidden lg:block relative p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors shrink-0">
                        <Mail size={18} />
                        <span className="absolute top-1 right-1 size-1.5 bg-[#FF4D4D] rounded-full border border-white dark:border-[#111]" />
                    </button>

                    {/* Notification Bell */}
                    <button className="hidden lg:block p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors shrink-0">
                        <Bell size={18} />
                    </button>

                    {/* Vertical Divider */}
                    <div className="h-5 w-px bg-slate-200 dark:bg-white/10 hidden lg:block" />

                    {/* Vertical Divider */}
                    <div className="hidden lg:block">
                        <ProfileDropdown
                            isAuthenticated={isAuthenticated}
                            user={user}
                            onLogout={logout}
                            isProfileOpen={isProfileOpen}
                            setIsProfileOpen={setIsProfileOpen}
                        />
                    </div>
                </div>

            </div>
        </header>
    );
};
