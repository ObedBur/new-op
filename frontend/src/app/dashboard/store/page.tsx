'use client';

import React from 'react';

export default function StorePage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-deep-blue dark:text-white tracking-tight">Ma Boutique</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Aperçu et performances</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-black border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Personnaliser
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Ventes du jour', value: '0.00 $', icon: 'payments', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-500/10' },
                    { title: 'Clients', value: '0', icon: 'group', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                    { title: 'Produits', value: '0', icon: 'inventory_2', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/10' },
                    { title: 'Note', value: '—', icon: 'star', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`size-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                            <span className={`material-symbols-outlined text-[20px] ${stat.color}`}>{stat.icon}</span>
                        </div>
                        <p className="text-2xl font-black text-deep-blue dark:text-white">{stat.value}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Store Info Card */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-gray-100 dark:border-white/5">
                    <h3 className="text-lg font-black text-deep-blue dark:text-white">Informations de la boutique</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Profil public de votre boutique</p>
                </div>
                <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nom de la Boutique</label>
                        <input
                            type="text"
                            placeholder="Ex: Ma Super Boutique"
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#E67E22]/10 focus:border-[#E67E22]/30 transition-all outline-hidden"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Slogan</label>
                        <input
                            type="text"
                            placeholder="Ex: La mode à portée de main"
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#E67E22]/10 focus:border-[#E67E22]/30 transition-all outline-hidden"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">WhatsApp Business</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+243</span>
                            <input
                                type="text"
                                placeholder="999 123 456"
                                className="w-full pl-16 pr-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#E67E22]/10 focus:border-[#E67E22]/30 transition-all outline-hidden"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Ville</label>
                        <input
                            type="text"
                            placeholder="Ex: Bukavu"
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#E67E22]/10 focus:border-[#E67E22]/30 transition-all outline-hidden"
                        />
                    </div>
                </div>
                <div className="p-6 lg:p-8 pt-0 flex justify-end">
                    <button className="bg-[#E67E22] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-[#E67E22]/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Enregistrer
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-gray-100 dark:border-white/5">
                    <h3 className="text-lg font-black text-deep-blue dark:text-white">Activité récente</h3>
                </div>
                <div className="p-6 lg:p-8">
                    <div className="flex flex-col items-center justify-center text-center py-10">
                        <span className="material-symbols-outlined text-gray-300 text-[40px] mb-3">timeline</span>
                        <p className="text-sm font-bold text-gray-400">Aucune activité récente</p>
                        <p className="text-xs text-gray-400 mt-1">L&apos;activité de votre boutique apparaîtra ici</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
