'use client';

import React from 'react';

export default function ProductsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-deep-blue dark:text-white tracking-tight">Mes Produits</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gérez votre catalogue</p>
                </div>
                <button className="flex items-center gap-2 bg-[#E67E22] text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-[#D67115] transition-all shadow-lg shadow-[#E67E22]/20 hover:scale-[1.02] active:scale-95">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Ajouter un produit
                </button>
            </div>

            {/* Search + Filters */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                <div className="relative flex-1 w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">search</span>
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-[#E67E22]/20 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-gray-500 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all whitespace-nowrap">
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Filtres
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produit</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Catégorie</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Prix</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-gray-300">image</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-deep-blue dark:text-white">Produit #{item}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">Ref: WB-202{item}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 font-bold text-xs">
                                            Mode
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-deep-blue dark:text-white">
                                        {(25 + item * 10).toFixed(2)} $
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black ${item % 2 === 0
                                                ? 'bg-green-50 dark:bg-green-500/10 text-green-600'
                                                : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600'
                                            }`}>
                                            {item % 2 === 0 ? `En stock (${45 - item})` : `Faible (${item})`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 text-gray-400 hover:text-[#E67E22] transition-colors rounded-lg hover:bg-orange-50 dark:hover:bg-[#E67E22]/10">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
