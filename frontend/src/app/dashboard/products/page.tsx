'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/axios'; // Direct API access for vendor-specific route
import {
    Search, MapPin, MessageCircle, UserPlus, Heart,
    ChevronDown, GitCompare, Plus, Package, Eye,
    TrendingUp, MoreVertical, Edit2, Clock,
    AlertCircle, CheckCircle2, LayoutGrid, List,
    Share2, Trash2, Copy, ExternalLink, Filter,
    ArrowUpRight, Download, X
} from 'lucide-react';

import { AddProductModal } from './components/AddProductModal';

export default function ProductsPage() {
    const { user } = useAuth();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [stats, setStats] = useState([
        { label: 'Revenu Mensuel', value: '0$', trend: '0%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Produits Actifs', value: '0', trend: 'Boutique', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Stock Total', value: '0', trend: 'Unités', icon: ArrowUpRight, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ]);

    const fetchDashboardData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Appeler spécifiquement l'endpoint des produits du vendeur (basé sur son Token)
            const response = await api.get('/products/my-products');

            if (response.data?.success) {
                const data = response.data.data || [];
                // Map API data to our UI format
                const mappedProducts = data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    oldPrice: p.oldPrice || null,
                    stock: p.stock || 0,
                    maxStock: p.maxStock || 100,
                    updatedAt: new Date(p.updatedAt).toLocaleDateString(),
                    status: p.availability === 'IN_STOCK' ? 'En stock' : (p.availability === 'LIMITED_STOCK' ? 'Stock Faible' : 'Rupture'),
                    categoryName: p.category?.name || 'Divers',
                    image: p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
                }));
                setProducts(mappedProducts);

                setStats([
                    { label: 'Revenu Mensuel', value: '0$', trend: '0%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Produits Actifs', value: mappedProducts.length.toString(), trend: 'Vôtre', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Stock Total', value: mappedProducts.reduce((acc: number, curr: any) => acc + curr.stock, 0).toString(), trend: 'Vôtre', icon: ArrowUpRight, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                ]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des produits du vendeur:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const toggleSelect = (id: number) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // --- COMPUTED FILTERS ---
    const uniqueCategories = ['Tout', ...Array.from(new Set(products.map(p => p.categoryName)))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Tout' || p.categoryName === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-7xl mx-auto pb-32 px-4">

            {/* --- TOP NAV ACTIONS --- */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tighter">Mes Produits</h2>
                    <p className="text-sm font-bold text-[#64748b] dark:text-gray-500 uppercase tracking-widest">Gestion du catalogue et stocks</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-4 bg-white dark:bg-[#151b2c] text-[#1e293b] dark:text-white rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 transition-all active:scale-95">
                        <Download size={20} />
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 bg-[#E67E22] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Nouveau Produit
                    </button>
                </div>
            </div>

            {/* --- STORE HEADER & KPI --- */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                {/* Store Profile Profile - Fully Dynamic */}
                <div className="xl:col-span-8 bg-white dark:bg-[#151b2c] rounded-[2.5rem] p-8 border border-transparent shadow-sm relative overflow-hidden group">
                    <div className="absolute top-[-30%] right-[-10%] opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-all duration-1000 pointer-events-none">
                        <span className="material-symbols-outlined text-[300px]">storefront</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative z-10 h-full">
                        <div className="flex items-start gap-6">
                            <div className="relative shrink-0 pt-1">
                                <div className="size-20 bg-gradient-to-br from-[#FFF5EB] to-[#FFF0E0] dark:from-[#E67E22]/20 dark:to-transparent rounded-2xl flex items-center justify-center border-2 border-white dark:border-[#1a1a1a] shadow-lg overflow-hidden">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.boutiqueName || user.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-black text-[#E67E22] uppercase">
                                            {(user?.boutiqueName || user?.fullName || 'S')?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 size-7 bg-[#E67E22] text-white rounded-lg flex items-center justify-center border-2 border-white dark:border-[#151b2c] shadow-lg">
                                    <CheckCircle2 size={14} />
                                </div>
                            </div>

                            <div className="space-y-1.5 flex-1 p-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-xl font-black text-[#1e293b] dark:text-white tracking-tight">
                                        {user?.boutiqueName || user?.fullName || 'Ma Boutique'}
                                    </h1>
                                    {user?.isVerified && (
                                        <div className="bg-[#E67E22]/10 text-[#E67E22] text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-orange-500/20">
                                            Officiel
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-[#64748b] dark:text-gray-400 font-bold text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="size-3.5 text-[#E67E22]" />
                                        <span>{user?.province || user?.commune || 'Localisation non définie'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                                        <TrendingUp className="size-3 text-emerald-500" />
                                        <span className="text-[#1e293b] dark:text-white font-black text-[10px]">{user?.trustScore || 0}% Score</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <button className="size-10 bg-gray-50 dark:bg-white/5 text-[#1e293b] dark:text-white rounded-xl flex items-center justify-center hover:bg-[#E67E22] hover:text-white transition-all">
                                <Share2 size={16} />
                            </button>
                            <button className="px-5 py-3 bg-[#1e293b] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95">
                                Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Sidebar - Tighter */}
                <div className="xl:col-span-4 grid grid-cols-1 gap-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-[#151b2c] p-4 rounded-3xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-lg font-black text-[#1e293b] dark:text-white tracking-tight">{stat.value}</h3>
                                    <span className={`text-[8px] font-black ${stat.color} bg-current/10 px-1 py-0.5 rounded`}>
                                        {stat.trend}
                                    </span>
                                </div>
                            </div>
                            <div className={`${stat.bg} ${stat.color} size-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FILTER & SEARCH BAR - Refined --- */}
            <div className="flex flex-col lg:flex-row items-center gap-4 bg-white dark:bg-[#151b2c] p-3 rounded-[2rem] shadow-sm border border-gray-50 dark:border-white/5">
                <div className="relative w-full lg:max-w-[350px] group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within:text-[#E67E22] transition-colors" />
                    <input
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher mes produits..."
                        className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 text-xs font-bold focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-1 focus:ring-[#E67E22]/20 transition-all"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 w-full lg:flex-1 scrollbar-hide">
                    {uniqueCategories.map((cat, i) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat as string)}
                            className={`shrink-0 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-[#E67E22] text-white shadow-md shadow-orange-500/10' : 'bg-transparent text-[#64748b] hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}>
                            {cat as string}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-3 px-6 py-3.5 bg-gray-50 dark:bg-white/5 text-[#1e293b] dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all">
                        <Filter size={14} className="text-[#E67E22]" />
                        Filtrer
                    </button>
                    <div className="h-8 w-px bg-gray-100 dark:bg-white/10 hidden lg:block" />
                    <div className="flex gap-1">
                        <button className="p-3 rounded-lg text-gray-400 hover:text-[#1e293b] dark:hover:text-white transition-all"><LayoutGrid size={18} /></button>
                        <button className="p-3 rounded-lg text-gray-400 hover:text-[#1e293b] dark:hover:text-white transition-all"><List size={18} /></button>
                    </div>
                </div>
            </div>

            {/* --- PRODUCTS GRID --- */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative ${filteredProducts.length === 0 ? 'min-h-[300px]' : ''}`}>
                {filteredProducts.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="size-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-gray-400 mb-6">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-black text-[#1e293b] dark:text-white tracking-tight mb-2">Aucun produit trouvé</h3>
                        <p className="text-sm font-bold text-gray-500">Essayez de modifier vos filtres de recherche.</p>
                    </div>
                )}

                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className={`group bg-white dark:bg-[#151b2c] rounded-3xl p-4 flex flex-col border-2 transition-all duration-500 relative ${selectedItems.includes(product.id) ? 'border-[#E67E22] ring-2 ring-[#E67E22]/10 scale-[0.98]' : 'border-transparent hover:shadow-xl'
                            }`}
                    >
                        {/* Selector */}
                        <div className="absolute top-6 left-6 z-20">
                            <button
                                onClick={() => toggleSelect(product.id)}
                                className={`size-6 rounded-lg flex items-center justify-center transition-all border-2 ${selectedItems.includes(product.id) ? 'bg-[#E67E22] border-[#E67E22] text-white shadow-lg shadow-orange-500/30' : 'bg-white/80 backdrop-blur-md border-white opacity-0 group-hover:opacity-100 text-[#1e293b]'
                                    }`}
                            >
                                <CheckCircle2 size={selectedItems.includes(product.id) ? 14 : 0} />
                                {!selectedItems.includes(product.id) && <div className="size-2 rounded-sm border border-[#1e293b]/20" />}
                            </button>
                        </div>

                        {/* Image Unit - Compact Aspect Ratio */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f1f5f9] dark:bg-white/5 mb-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Badges UI - Smaller */}
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider backdrop-blur-md border ${product.status === 'Rupture' ? 'bg-red-500/20 text-red-100 border-red-500/20' :
                                    product.status === 'Stock Faible' ? 'bg-orange-500/20 text-orange-50 border-orange-500/20' :
                                        'bg-emerald-500/20 text-emerald-50 border-emerald-500/20'
                                    }`}>
                                    {product.status}
                                </span>
                            </div>

                            {/* Floating Context Toolbar - Slimmer */}
                            <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                <button className="flex-1 bg-white dark:bg-[#151b2c] text-[#1e293b] dark:text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#E67E22] hover:text-white transition-all shadow-lg border border-transparent">
                                    <Edit2 size={12} />
                                    Éditer
                                </button>
                                <button className="size-10 bg-white/10 backdrop-blur-xl text-white rounded-xl flex items-center justify-center hover:bg-red-500 transition-all border border-white/20">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Meta Content - Balanced Sizes */}
                        <div className="flex flex-col flex-1 px-1">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="space-y-0.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-1.5 rounded-full bg-[#E67E22]" />
                                        <p className="text-[9px] font-black text-[#64748b] uppercase tracking-wider">Modifié {product.updatedAt}</p>
                                    </div>
                                    <h3 className="font-black text-[#1e293b] dark:text-white text-[15px] leading-tight truncate group-hover:text-[#E67E22] transition-colors">
                                        {product.name}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-xl font-black text-[#1e293b] dark:text-white tracking-tight">{product.price}$</span>
                                {product.oldPrice && (
                                    <span className="text-[12px] font-bold text-gray-400 line-through decoration-orange-500/40">{product.oldPrice}$</span>
                                )}
                            </div>

                            {/* Dashboard Stats - Discrete */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-white/5 mt-auto">
                                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Stock</span>
                                    <span className={product.stock <= 5 ? 'text-red-500' : 'text-[#1e293b] dark:text-white'}>
                                        {product.stock} pcs
                                    </span>
                                </div>
                                <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${product.stock === 0 ? 'w-0' :
                                            product.stock <= 5 ? 'bg-red-500' : 'bg-emerald-500'
                                            }`}
                                        style={{ width: `${(product.stock / product.maxStock) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- BULK ACTIONS (FLOATING) --- */}
            {selectedItems.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-20 duration-500">
                    <div className="bg-[#1e293b] dark:bg-white text-white dark:text-[#1e293b] px-10 py-6 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] flex items-center gap-10 backdrop-blur-xl border border-white/10">
                        <div className="flex items-center gap-5 pr-10 border-r border-white/20">
                            <div className="size-10 bg-[#E67E22] rounded-2xl flex items-center justify-center font-black">
                                {selectedItems.length}
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest">Sélectionnés</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-3 hover:text-[#E67E22] transition-colors"><Edit2 size={18} /><span className="text-[11px] font-black uppercase tracking-widest">Modifier</span></button>
                            <button className="flex items-center gap-3 hover:text-red-500 transition-colors"><Trash2 size={18} /><span className="text-[11px] font-black uppercase tracking-widest">Supprimer</span></button>
                            <button className="flex items-center gap-3 hover:text-blue-400 transition-colors"><Share2 size={18} /><span className="text-[11px] font-black uppercase tracking-widest">Exporter</span></button>
                            <button
                                onClick={() => setSelectedItems([])}
                                className="ml-4 px-6 py-3 bg-white/10 dark:bg-black/5 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PAGINATION --- */}
            <div className="mt-10 flex flex-col items-center gap-6 pb-20">
                <button className="px-20 py-7 bg-white dark:bg-[#151b2c] text-[#1e293b] dark:text-white border-4 border-gray-50 dark:border-white/5 font-black text-sm uppercase tracking-[0.3em] rounded-full hover:shadow-2xl hover:scale-105 transition-all active:scale-95">
                    Charger l'historique
                </button>
            </div>
            {/* --- ADD PRODUCT MODAL --- */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onProductAdded={fetchDashboardData}
            />
        </div>
    );
}
