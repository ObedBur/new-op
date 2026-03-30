'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/axios'; // Direct API access for vendor-specific route
import { toast } from 'sonner';
import {
    Search, MapPin, MessageCircle, UserPlus, Heart,
    ChevronDown, GitCompare, Plus, Package, Eye,
    TrendingUp, MoreVertical, Edit2, Clock,
    AlertCircle, CheckCircle2, LayoutGrid, List,
    Share2, Trash2, Copy, ExternalLink, Filter,
    ArrowUpRight, Download, X, Globe
} from 'lucide-react';

import { AddProductModal } from './components/AddProductModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import PublishDraftsModal from './components/PublishDraftsModal';

export default function ProductsPage() {
    const { user } = useAuth();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [defaultPublicStatus, setDefaultPublicStatus] = useState(true);
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

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsAddModalOpen(true);
    };

    const handleDelete = (product: any) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);

        try {
            const response = await api.delete(`/products/${productToDelete.id}`);
            if (response.data?.success) {
                toast.success('Produit supprimé !', {
                    style: { background: '#1e293b', color: 'white', border: 'none' },
                });
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
                fetchDashboardData();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            toast.error('Erreur lors de la suppression du produit.');
        } finally {
            setIsDeleting(false);
        }
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
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1e293b] dark:text-white tracking-tighter">Mes Produits</h2>
                    <p className="text-[10px] sm:text-xs font-bold text-[#64748b] dark:text-gray-500 uppercase tracking-widest">Gestion du catalogue et stocks</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* search bar */}
                    <div className="relative w-full sm:max-w-[350px] group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within:text-[#E67E22] transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher mes produits..."
                            className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 text-xs font-bold focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-1 focus:ring-[#E67E22]/20 transition-all sm:rounded-xl"
                        />
                    </div>
                </div>
            </div>



            {/* --- FILTER BAR - Refined --- */}
            <div className="flex flex-row items-center gap-3 bg-white dark:bg-[#151b2c] p-2 sm:p-3 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-50 dark:border-white/5 overflow-hidden">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 flex-1 scrollbar-hide">
                    {uniqueCategories.map((cat, i) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat as string)}
                            className={`shrink-0 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-[#E67E22] text-white shadow-md shadow-orange-500/10' : 'bg-transparent text-[#64748b] hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}>
                            {cat as string}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <button className="flex items-center gap-2 px-3 sm:px-6 py-3 bg-gray-50 dark:bg-white/5 text-[#1e293b] dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all">
                        <Filter size={14} className="text-[#E67E22]" />
                        <span className="hidden sm:inline">Filtrer</span>
                    </button>
                    <div className="h-6 sm:h-8 w-px bg-gray-100 dark:bg-white/10" />
                    <div className="flex gap-1">
                        <button className="p-2 sm:p-3 rounded-lg text-gray-400 hover:text-[#1e293b] dark:hover:text-white transition-all"><LayoutGrid size={18} /></button>
                        <button className="hidden sm:block p-3 rounded-lg text-gray-400 hover:text-[#1e293b] dark:hover:text-white transition-all"><List size={18} /></button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-3">
                          {/* add product button */}
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setDefaultPublicStatus(false);
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 sm:gap-3 bg-[#E67E22] text-white px-4 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-sm shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        <span className="truncate">Nouveau</span>
                    </button>
                      {/* add product button */}
                    <button
                        onClick={() => setIsPublishModalOpen(true)}
                        className="flex items-center justify-center gap-2 sm:gap-3 bg-[#1e293b] dark:bg-white text-white dark:text-[#1e293b] px-4 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-sm shadow-xl hover:-translate-y-1 transition-all active:scale-95 border border-white/10"
                    >
                        <Globe size={18} />
                        <span className="truncate">Publier</span>
                    </button>
            </div>
            {/* --- PRODUCTS GRID --- */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 relative ${filteredProducts.length === 0 ? 'min-h-[300px]' : ''}`}>
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
                        className={`group bg-white dark:bg-[#151b2c] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col border-2 transition-all duration-500 relative ${selectedItems.includes(product.id) ? 'border-[#E67E22] ring-2 ring-[#E67E22]/10 scale-[0.98]' : 'border-transparent hover:shadow-xl'
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
                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                                <span className={`px-2 sm:px-3 py-1 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-wider backdrop-blur-md border ${product.status === 'Rupture' ? 'bg-red-500/20 text-red-100 border-red-500/20' :
                                    product.status === 'Stock Faible' ? 'bg-orange-500/20 text-orange-50 border-orange-500/20' :
                                        'bg-emerald-500/20 text-emerald-50 border-emerald-500/20'
                                    }`}>
                                    {product.status}
                                </span>
                            </div>

                            {/* Floating Context Toolbar - Optimized for 2-column mobile */}
                            <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 flex items-center gap-1.5 sm:gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                <button 
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 bg-white dark:bg-[#151b2c] text-[#1e293b] dark:text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-black text-[8px] sm:text-[10px] uppercase tracking-widest flex items-center justify-center gap-1 sm:gap-2 hover:bg-[#E67E22] hover:text-white transition-all shadow-lg border border-transparent"
                                >
                                    <Edit2 size={10} className="sm:size-[12px]" />
                                    <span className="sm:inline hidden">Éditer</span>
                                    <span className="sm:hidden">Edit</span>
                                </button>
                                <button 
                                    onClick={() => handleDelete(product)}
                                    className="size-8 sm:size-10 bg-white/10 backdrop-blur-xl text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-red-500 transition-all border border-white/20 shadow-lg"
                                >
                                    <Trash2 size={12} className="sm:size-[14px]" />
                                </button>
                            </div>
                        </div>

                        {/* Meta Content - Balanced Sizes */}
                        <div className="flex flex-col flex-1 px-1">
                            
                            <div className="flex items-start justify-between gap-1 mb-1">
                                <div className="space-y-0.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                        <div className="size-1 sm:size-1.5 rounded-full bg-[#E67E22]" />
                                        <p className="text-[8px] sm:text-[9px] font-black text-[#64748b] uppercase tracking-wider truncate">
                                            {product.isPublic ? 'Public' : 'Brouillon'}
                                        </p>
                                    </div>
                                    <h3 className="font-black text-[#1e293b] dark:text-white text-[12px] sm:text-[15px] leading-tight truncate group-hover:text-[#E67E22] transition-colors">
                                        {product.name}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                                <span className="text-[16px] sm:text-xl font-black text-[#1e293b] dark:text-white tracking-tight">{product.price}$</span>
                                {product.oldPrice && (
                                    <span className="text-[10px] sm:text-[12px] font-bold text-gray-400 line-through decoration-orange-500/40">{product.oldPrice}$</span>
                                )}
                            </div>

                            {/* Dashboard Stats - Discrete */}
                            <div className="space-y-1.5 sm:space-y-2 pt-2 sm:pt-3 border-t border-gray-100 dark:border-white/5 mt-auto">
                                <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Stock</span>
                                    <span className={product.stock <= 5 ? 'text-red-500' : 'text-[#1e293b] dark:text-white'}>
                                        {product.stock} <span className="hidden sm:inline">pcs</span>
                                    </span>
                                </div>
                                <div className="h-1 sm:h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
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
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                }}
                onProductAdded={fetchDashboardData}
                product={editingProduct}
                defaultPublic={defaultPublicStatus}
            />

            {/* --- PUBLISH DRAFTS MODAL --- */}
            <PublishDraftsModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                onPublished={fetchDashboardData}
            />

            {/* --- DELETE CONFIRMATION MODAL --- */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setProductToDelete(null);
                }}
                onConfirm={confirmDelete}
                itemName={productToDelete?.name || ''}
                isDeleting={isDeleting}
            />
        </div>
    );
}
