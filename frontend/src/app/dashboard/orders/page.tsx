'use client';

import React from 'react';
import Link from 'next/link';

export default function OrdersPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl lg:text-3xl font-black text-deep-blue dark:text-white tracking-tight">Mes Commandes</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Historique et suivi de vos commandes</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
                {['Toutes', 'En cours', 'Livrées', 'Annulées'].map((tab, i) => (
                    <button
                        key={tab}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide whitespace-nowrap transition-all ${i === 0
                            ? 'bg-[#E67E22] text-white shadow-md shadow-[#E67E22]/20'
                            : 'bg-white dark:bg-[#1a1a1a] text-gray-500 border border-gray-100 dark:border-white/10 hover:border-[#E67E22]/30 hover:text-[#E67E22]'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Empty State */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="size-24 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-[48px] text-[#E67E22]">
                            package_2
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-deep-blue dark:text-white mb-2">
                        Aucune commande pour le moment
                    </h3>
                    <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
                        Dès que vous passerez une commande sur notre plateforme, elle apparaîtra ici avec son statut d&apos;expédition.
                    </p>
                    <Link
                        href="/"
                        className="bg-[#E67E22] text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-[#D67115] transition-all shadow-lg shadow-[#E67E22]/20 hover:scale-[1.02] active:scale-95"
                    >
                        Commencer mes achats
                    </Link>
                </div>
            </div>
        </div>
    );
}
