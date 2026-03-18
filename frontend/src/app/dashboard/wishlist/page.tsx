'use client';

import React from 'react';
import Link from 'next/link';

export default function WishlistPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl lg:text-3xl font-black text-deep-blue dark:text-white tracking-tight">Mes Favoris</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Vos produits enregistrés pour plus tard</p>
            </div>

            {/* Empty State */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="size-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-[48px] text-red-400">
                            favorite
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-deep-blue dark:text-white mb-2">
                        Votre liste de favoris est vide
                    </h3>
                    <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
                        Parcourez nos catégories et cliquez sur l&apos;icône cœur pour sauvegarder les articles qui vous plaisent le plus.
                    </p>
                    <Link
                        href="/"
                        className="bg-[#E67E22] text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-[#D67115] transition-all shadow-lg shadow-[#E67E22]/20 hover:scale-[1.02] active:scale-95"
                    >
                        Découvrir des produits
                    </Link>
                </div>
            </div>
        </div>
    );
}
