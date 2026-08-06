'use client';

import React, { useState } from 'react';
import { useProducts, useAdminTranslation } from '@/features/admin-dashboard/hooks';
import { useAdminSearch } from '@/features/admin-dashboard/context';
import { AdminProduct } from '@/features/admin-dashboard/types';
import {
    ShoppingBag,
    MapPin,
    ChevronRight,
    X,
    Tag,
    Store,
    Calendar,
    Edit3,
    AlertCircle,
    Package,
} from 'lucide-react';

// ─── Product Detail Modal ────────────────────────────────────────────────────

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; accent?: boolean }> = ({
    icon, label, value, accent,
}) => (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
        <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${accent ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
        </div>
    </div>
);

const ProductDetailModal: React.FC<{ product: AdminProduct; onClose: () => void }> = ({ product, onClose }) => {
    const marketColors: Record<string, string> = {
        Virunga: 'bg-blue-50 text-blue-700 border border-blue-200/60',
        Birere: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

                {/* Header Banner */}
                <div className="relative h-28 bg-gradient-to-br from-emerald-500 via-emerald-600 to-orange-500 overflow-hidden">
                    <div className="absolute -top-6 -right-6 size-28 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-4 size-24 rounded-full bg-white/10" />
                    <button onClick={onClose} className="absolute top-4 right-4 size-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors cursor-pointer">
                        <X className="size-4" />
                    </button>
                    <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 ${marketColors[product.quartier] ? 'text-emerald-700' : 'text-slate-700'}`}>
                            <MapPin className="size-3" />
                            {product.quartier}
                        </span>
                    </div>
                </div>

                {/* Avatar overlapping header */}
                <div className="relative -mt-10 px-6 flex items-end gap-4 mb-4">
                    <div className="size-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center bg-gradient-to-br from-emerald-400 to-orange-500 shrink-0">
                        <ShoppingBag className="size-8 text-white" />
                    </div>
                    <div className="pb-1 flex-1 min-w-0">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight truncate leading-tight">
                            {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">
                            par {product.seller}
                        </p>
                    </div>
                </div>

                {/* Info rows */}
                <div className="px-6 pb-2">
                    <InfoRow icon={<Tag className="size-4" />} label="Prix actuel" value={`${Number(product.price).toLocaleString('fr-FR')} FC`} accent />
                    <InfoRow icon={<Store className="size-4" />} label="Vendeur" value={product.seller} />
                    <InfoRow icon={<MapPin className="size-4" />} label="Quartier" value={product.quartier || '—'} />
                    <InfoRow icon={<Calendar className="size-4" />} label="Dernière mise à jour" value={product.lastUpdate || '—'} />
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/60">
                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow-sm shadow-emerald-500/20 active:scale-95 transition-all text-sm cursor-pointer"
                    >
                        <Edit3 className="size-4" />
                        Modifier ce produit
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Product Row Card ────────────────────────────────────────────────────────

const marketColors: Record<string, string> = {
    Virunga: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    Birere: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    Alanine: 'bg-purple-50 text-purple-700 border border-purple-200/60',
};

const ProductRow: React.FC<{ product: AdminProduct; onClick: () => void }> = ({ product, onClick }) => (
    <button
        onClick={onClick}
        className="w-full text-left group flex items-center gap-4 px-5 py-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
        {/* Icon */}
        <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-400 to-orange-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
            <ShoppingBag className="size-5 text-white" />
        </div>

        {/* Name + seller */}
        <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate tracking-tight">{product.name}</p>
            <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">par {product.seller}</p>
        </div>

        {/* Price */}
        <div className="text-right shrink-0 hidden sm:block">
            <p className="text-sm font-black text-slate-900">{Number(product.price).toLocaleString('fr-FR')} FC</p>
            <p className="text-[10px] text-slate-400 font-semibold">{product.lastUpdate}</p>
        </div>

        {/* Market badge */}
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shrink-0 hidden md:inline-flex ${
            product.quartier === 'Virunga' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
            product.quartier === 'Birere' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
            product.quartier === 'Himbi' ? 'bg-orange-50 text-orange-700 border border-orange-200/60' :
            product.quartier === 'Katindo' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' :
            'bg-purple-50 text-purple-700 border border-purple-200/60'
        }`}>
            {product.quartier}
        </span>

        <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
);

// ─── Page ────────────────────────────────────────────────────────────────────

const QUARTIERS = ['Tous', 'Virunga', 'Birere', 'Himbi', 'Katindo', 'Karisimbi'];

export default function AdminProductsPage() {
    const { searchQuery } = useAdminSearch();
    const { products, isLoading, error } = useProducts({ searchQuery, limit: 100 });
    const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
    const [activeQuartier, setActiveQuartier] = useState('Tous');

    const filtered = activeQuartier === 'Tous' ? products : products.filter(p => p.quartier === activeQuartier);

    if (isLoading) {
        return (
            <div className="space-y-3 animate-pulse">
                {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-[72px] bg-slate-100 rounded-2xl" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-3">
                    <AlertCircle className="size-7" />
                </div>
                <p className="font-bold text-slate-700">Erreur de chargement</p>
                <p className="text-sm text-slate-400 mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* Stats mini row */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Total produits', value: products.length, icon: <Package className="size-4" />, bg: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Quartiers actifs', value: 5, icon: <MapPin className="size-4" />, bg: 'bg-orange-50 text-orange-600' },
                    { label: 'Filtré', value: filtered.length, icon: <ShoppingBag className="size-4" />, bg: 'bg-blue-50 text-blue-600' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3">
                        <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
                        <div>
                            <p className="text-xl font-black text-slate-900 leading-none">{s.value}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quartier filter bar */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
                    {QUARTIERS.map(q => (
                        <button
                            key={q}
                            onClick={() => setActiveQuartier(q)}
                            className={`h-10 shrink-0 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                activeQuartier === q
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {q}
                        </button>
                    ))}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap shrink-0">
                    {filtered.length} trouvé{filtered.length > 1 ? 's' : ''}
                </span>
            </div>

            {/* Product list */}
            {filtered.length > 0 ? (
                <div className="space-y-2.5">
                    {filtered.map(product => (
                        <ProductRow key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                        <Package className="size-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Aucun produit trouvé</p>
                    <p className="text-xs text-slate-400 mt-1">Essayez de changer le filtre de marché.</p>
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}
        </div>
    );
}
