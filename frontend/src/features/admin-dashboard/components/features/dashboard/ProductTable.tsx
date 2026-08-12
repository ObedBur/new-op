import React, { useState } from 'react';
import { useAdminTranslation, useProducts } from '@/features/admin-dashboard/hooks';
import { AdminProduct } from '@/features/admin-dashboard/types';
import { useAdminSearch } from '@/features/admin-dashboard/context';
import { useCurrency } from '@/hooks/useCurrency';
import { ShoppingBag, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const ProductTable: React.FC = () => {
    const { t } = useAdminTranslation();
    const { searchQuery } = useAdminSearch();
    const { products, isLoading, error } = useProducts({ searchQuery });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedQuartier, setSelectedQuartier] = useState<string>('ALL');

    const filteredProducts = products.filter(product => {
        if (selectedQuartier === 'ALL') return true;
        return product.quartier?.toLowerCase() === selectedQuartier.toLowerCase();
    });

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col h-full justify-between">
            <div>
                <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                        <h3 className="text-base font-black text-slate-900 tracking-tight">{t.dashboard.products.title}</h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Listing des stocks en temps réel</p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <button 
                            onClick={() => { setSelectedQuartier('ALL'); setCurrentPage(1); }}
                            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                selectedQuartier === 'ALL' 
                                    ? 'bg-orange-500 text-white shadow-xs' 
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            Tous les Quartiers
                        </button>
                        {['Virunga', 'Birere', 'Himbi', 'Katindo', 'Karisimbi'].map(quartier => (
                            <button
                                key={quartier}
                                onClick={() => { setSelectedQuartier(quartier); setCurrentPage(1); }}
                                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                    selectedQuartier === quartier 
                                        ? 'bg-emerald-600 text-white shadow-xs' 
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {quartier}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-5 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.dashboard.products.headers.product}</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.dashboard.products.headers.seller}</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.dashboard.products.headers.price}</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Quartier</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.dashboard.products.headers.update}</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">{t.dashboard.products.headers.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <LoadingSkeletons />
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-red-500 italic font-medium text-xs">
                                        {error}
                                    </td>
                                </tr>
                            ) : paginatedProducts.length > 0 ? (
                                paginatedProducts.map((product) => (
                                    <ProductRow key={product.id} product={product} editLabel={t.dashboard.products.edit} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 italic font-medium text-xs">
                                        {t.dashboard.products.empty || "Aucun produit trouvé."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t.dashboard.products.pagination.showing} {filteredProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} / {filteredProducts.length} {t.dashboard.products.pagination.products}
                </p>
                <div className="flex gap-2">
                    <button 
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="h-8 px-3 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                        <ChevronLeft className="size-3.5" />
                        {t.dashboard.products.pagination.prev}
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="h-8 px-3 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-all shadow-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                        {t.dashboard.products.pagination.next}
                        <ChevronRight className="size-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProductRow: React.FC<{ product: AdminProduct; editLabel: string }> = ({ product, editLabel }) => {
    const { formatPrice } = useCurrency();
    return (
    <tr key={product.id} className="hover:bg-slate-50/80 transition-all group">
        <td className="px-5 py-3 whitespace-nowrap">
            <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <ShoppingBag className="size-4 shrink-0" />
                </div>
                <p className="font-bold text-slate-900 text-xs group-hover:text-emerald-600 transition-colors truncate max-w-[180px]">{product.name}</p>
            </div>
        </td>
        <td className="px-5 py-3 text-xs text-slate-600 font-medium whitespace-nowrap">{product.seller}</td>
        <td className="px-5 py-3 font-black text-slate-900 text-xs whitespace-nowrap">
            {formatPrice(Number(product.price))}
        </td>
        <td className="px-5 py-3 text-xs whitespace-nowrap">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase ${
                product.quartier === 'Virunga' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                product.quartier === 'Birere' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                product.quartier === 'Himbi' ? 'bg-orange-50 text-orange-700 border border-orange-200/60' :
                product.quartier === 'Katindo' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' :
                'bg-purple-50 text-purple-700 border border-purple-200/60'
            }`}>
                {product.quartier}
            </span>
        </td>
        <td className="px-5 py-3 text-[10px] text-slate-400 font-semibold whitespace-nowrap uppercase tracking-wider font-mono">{product.lastUpdate}</td>
        <td className="px-5 py-3 text-right">
            <button className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1 cursor-pointer">
                <Edit3 className="size-3" />
                {editLabel}
            </button>
        </td>
    </tr>
    );
};

const LoadingSkeletons = () => (
    <>
        {Array(5).fill(0).map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-3/4"></div></td>
                <td className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-1/2"></div></td>
                <td className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-1/4"></div></td>
                <td className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-1/3"></div></td>
                <td className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-1/4"></div></td>
                <td className="px-5 py-3"></td>
            </tr>
        ))}
    </>
);

export default ProductTable;
