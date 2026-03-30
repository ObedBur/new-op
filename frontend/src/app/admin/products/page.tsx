'use client';

import React from 'react';
import { useProducts, useAdminTranslation } from '@/features/admin-dashboard/hooks';
import { useAdminSearch } from '@/features/admin-dashboard/context';

export default function AdminProductsPage() {
    const { searchQuery } = useAdminSearch();
    const { t } = useAdminTranslation();
    const { products, isLoading, error } = useProducts({ searchQuery, limit: 50 });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin size-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
                <span className="material-symbols-outlined text-4xl mb-2">error</span>
                <p className="font-bold">Erreur lors du chargement des produits</p>
                <p className="text-sm opacity-70">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Produits</h1>
                    <p className="text-sm text-slate-500 mt-1">{products.length} produit(s) trouvé(s)</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-xs">Produit</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-xs">Vendeur</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-xs">Prix</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-xs">Marché</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-xs">Dernière MAJ</th>
                                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                                        Aucun produit trouvé.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-10 rounded-xl flex items-center justify-center ${product.iconBg || 'bg-emerald-100'} shadow-sm`}>
                                                    <span className={`material-symbols-outlined ${product.iconColor || 'text-emerald-600'}`}>shopping_bag</span>
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{product.seller}</td>
                                        <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                                            {Number(product.price).toLocaleString('fr-FR')} $
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${product.market === 'Virunga' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' :
                                                    product.market === 'Birere' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' :
                                                        'bg-purple-50 text-purple-600 dark:bg-purple-900/20'
                                                }`}>
                                                {product.market}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-400 tracking-widest uppercase">{product.lastUpdate}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-emerald-600 hover:text-emerald-700 font-bold text-xs uppercase tracking-wide">Modifier</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

