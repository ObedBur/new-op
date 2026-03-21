'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import {
    Package,
    CheckCircle,
    Truck,
    ChevronRight,
    TrendingUp,
    ShieldCheck,
    Headphones,
    Search,
    Filter,
    MessageCircle,
    AlertCircle,
    FileText
} from 'lucide-react';

// --- TYPES ---

type OrderStatus = 'À traiter' | 'Expédiées' | 'Livrées' | 'Annulées';

interface OrderCardProps {
    id: string;
    status: OrderStatus;
    total: number;
    date: string;
    count: number;
    customer: string;
    productName: string;
}

// --- COMPOSANT DE CARTE (Optimisé) ---

function OrderCard({ id, status, total, date, count, customer, productName }: OrderCardProps) {
    const isATraiter = status === 'À traiter';
    const isLivree = status === 'Livrées';
    const isAnnulee = status === 'Annulées';

    const statusStyles: Record<OrderStatus, string> = {
        'À traiter': 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
        'Expédiées': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
        'Livrées': 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
        'Annulées': 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    };

    return (
        <div className="group relative bg-white dark:bg-[#0f172a] rounded-3xl p-5 lg:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-900/30 transition-all duration-300">
            {/* Glow décoratif discret au hover */}
            <div className="absolute -inset-px bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity pointer-events-none" />

            {/* HEADER */}
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="size-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                        <Package size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-tight">Commande</span>
                            <span className="text-sm font-bold text-orange-600">#{id}</span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{date}</p>
                    </div>
                </div>

                <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border flex items-center gap-1.5 ${statusStyles[status]}`}>
                    {isATraiter && (
                        <span className="flex size-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full size-1.5 bg-orange-500"></span>
                        </span>
                    )}
                    {isLivree && <CheckCircle size={12} />}
                    {isAnnulee && <AlertCircle size={12} />}
                    {status}
                </div>
            </div>

            {/* PRODUIT & PRIX SECTION */}
            <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-4">
                    <div className="size-14 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-slate-400 text-2xl">inventory_2</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-slate-900 dark:text-white truncate text-sm lg:text-base leading-tight">
                            {productName}
                        </h5>
                        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                Qté: {count}
                            </span>
                            <span>•</span>
                            <span className="text-orange-600 font-semibold">${total} Total</span>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenu</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">${total}</p>
                    </div>
                </div>
            </div>

            {/* INFO CLIENT */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-slate-900 dark:bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                        {customer.charAt(0)}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">Acheteur</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{customer}</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-orange-600 transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-3">
                {isATraiter ? (
                    <>
                        <button className="col-span-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs uppercase tracking-tight hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-lg shadow-slate-200 dark:shadow-none flex items-center justify-center gap-2">
                            <Truck size={14} />
                            Expédier
                        </button>
                        <button className="col-span-1 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs uppercase tracking-tight hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            <MessageCircle size={14} />
                            Chat
                        </button>
                    </>
                ) : (
                    <button className="col-span-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs uppercase tracking-tight hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                        <FileText size={14} />
                        Détails de la commande
                    </button>
                )}
            </div>
        </div>
    );
}

// --- PAGE PRINCIPALE ---

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState<string>('Toutes');
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const statusLabels: Record<string, OrderStatus> = {
        PENDING: 'À traiter',
        SHIPPED: 'Expédiées',
        DELIVERED: 'Livrées',
        CANCELLED: 'Annulées'
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/vendor');
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error("Erreur de récupération des commandes:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'Toutes') return true;
        const statusFR = statusLabels[order.status] || order.status;
        return statusFR === activeTab;
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-7xl mx-auto pb-32 px-4 pt-8">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                    <h2 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tighter">Commandes Clients</h2>
                    <p className="text-sm font-semibold text-[#64748b] dark:text-gray-500 uppercase tracking-widest">
                        Gérez et expédiez vos produits
                    </p>
                </div>
                <div className="relative w-full sm:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une commande..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#151b2c] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 border border-slate-100 dark:border-slate-800 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* TABS / FILTERS */}
            <div className="flex flex-col lg:flex-row items-center gap-4 bg-white dark:bg-[#151b2c] p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1 w-full lg:flex-1 overflow-x-auto scrollbar-hide px-1">
                    {['Toutes', 'À traiter', 'Expédiées', 'Livrées', 'Annulées'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`shrink-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                    <Filter size={14} className="text-orange-500" />
                    Filtrer
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LIST SECTION */}
                <div className="lg:col-span-8 space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white dark:bg-[#151b2c] rounded-[2.5rem] p-16 text-center border border-slate-100 dark:border-slate-800">
                            <Package className="mx-auto size-16 text-slate-200 dark:text-slate-700 mb-6" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Aucune commande</h3>
                            <p className="text-sm text-slate-500 font-medium">Nous n'avons trouvé aucune commande pour ce filtre.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    id={order.id.substring(0, 8).toUpperCase()}
                                    customer={order.customerName || order.client?.fullName || 'Client Anonyme'}
                                    status={statusLabels[order.status] || (order.status as OrderStatus)}
                                    total={order.totalPrice}
                                    date={new Date(order.createdAt).toLocaleDateString()}
                                    productName={order.product?.name || "Produit inconnu"}
                                    count={1}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ASIDE SECTION */}
                <aside className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 dark:bg-orange-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-3">Support Vendeur</h3>
                            <p className="text-white/80 text-xs font-medium mb-8 leading-relaxed">
                                Un problème avec une expédition ? Notre équipe est là pour vous aider 24/7.
                            </p>
                            <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                                <Headphones size={16} />
                                Ouvrir un ticket
                            </button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl" />
                    </div>

                    <div className="bg-white dark:bg-[#151b2c] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h4 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-widest mb-8 flex items-center gap-2">
                            <TrendingUp size={16} className="text-orange-500" />
                            Statistiques Live
                        </h4>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Succès livraison</span>
                                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">98.2%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Retours</span>
                                <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-lg">1.8%</span>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                                <ShieldCheck size={20} />
                            </div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                Paiements sécurisés par <span className="text-orange-500">WapiBei</span>
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}