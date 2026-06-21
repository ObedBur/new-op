'use client';

import React from 'react';

const AdminFooter: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto py-6 px-4 md:px-8 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-lg bg-emerald-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[14px]">storefront</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        &copy; {currentYear} <span className="text-slate-900 dark:text-white font-black uppercase tracking-tighter">Wapi<span className="text-emerald-600">Bei</span></span> Admin.
                    </p>
                </div>
                
                <div className="flex items-center gap-6">
                    <a href="#" className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">Support</a>
                    <a href="#" className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">Documentation</a>
                    <div className="size-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">v1.2.0</p>
                </div>
            </div>
        </footer>
    );
};

export default AdminFooter;
