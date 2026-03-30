'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { Search, Filter, Package } from 'lucide-react';
import { OrderCard, OrderStatus } from './components/OrderCard';
import { OrderDetailsModal } from './components/OrderDetailsModal';

// --- PAGE PRINCIPALE ---


export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState<string>('Toutes');
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const statusLabels: Record<string, OrderStatus> = {
        PENDING: 'À traiter',
        CONFIRMED: 'À traiter',
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[2000px] mx-auto pb-20 px-1 sm:px-6 pt-4 sm:pt-8 space-y-5 sm:space-y-10">

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            {/* HEADER COMPACT */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-black text-deep-blue dark:text-white uppercase tracking-tighter leading-none">
                        Commandes <span className="text-[#E67E22]">Clients</span>
                    </h1>
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">
                        Gestion des commandes & expéditions
                    </p>
                </div>

                <div className="relative w-full sm:w-80 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={14} className="text-[#E67E22] group-focus-within:scale-110 transition-transform" />
                    </div>
                    <input
                        type="text"
                        placeholder="RECHERCHER..."
                        className="w-full bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 rounded-2xl px-10 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#E67E22] placeholder-gray-300 dark:placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-[#E67E22]/20 focus:border-[#E67E22] outline-none transition-all"
                    />
                </div>
            </div>

            {/* STICKY FILTERS COMPACT WITH FADE */}
            <div className="sticky top-4 z-40 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl p-1.5 rounded-[2rem] shadow-xl shadow-black/5 border border-white/20 dark:border-white/5 flex items-center justify-between gap-1 overflow-hidden">
                <div className="relative flex-1 flex items-center overflow-hidden">
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-1 no-scrollbar flex-1 scroll-smooth">
                        {['Toutes', 'À traiter', 'Expédiées', 'Livrées', 'Annulées'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`shrink-0 px-5 py-2.5 sm:py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                    ? 'bg-[#E67E22] text-white shadow-xl shadow-orange-500/30'
                                    : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                        {/* PADDING AT END FOR SCROLL */}
                        <div className="shrink-0 w-10 h-1" />
                    </div>
                    {/* FADE EFFECT */}
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-[#0f172a] via-transparent to-transparent pointer-events-none z-10" />
                </div>

                <button className="relative z-20 size-11 sm:size-12 shrink-0 flex items-center justify-center bg-[#E67E22]/10 text-[#E67E22] rounded-full hover:bg-[#E67E22] hover:text-white transition-all border border-[#E67E22]/20 mr-1 shadow-sm">
                    <Filter size={16} />
                </button>
            </div>

            {/* LIST SECTION */}
            <div className="max-w-7xl mx-auto pb-20 px-1 sm:px-0">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#E67E22]"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                        <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-16 text-center border border-gray-100 dark:border-white/5 shadow-sm mt-12">
                            <Package className="mx-auto size-16 text-gray-200 dark:text-white/5 mb-6" />
                            <h3 className="text-xl font-black text-deep-blue dark:text-white mb-2">Aucune commande</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nous n'avons trouvé aucune commande pour ce filtre.</p>
                        </div>
                    ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max h-[750px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredOrders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        id={order.id.substring(0, 8).toUpperCase()}
                                        originalId={order.id}
                                        customer={order.customerName || 'Client Anonyme'}
                                        customerPhone={order.customerPhone}
                                        status={statusLabels[order.status] || 'À traiter'}
                                        total={order.totalPrice}
                                        date={new Date(order.createdAt).toLocaleDateString()}
                                        productName={order.product?.name || "Produit inconnu"}
                                        productImage={order.product?.image || order.product?.images?.[0]}
                                        count={1}
                                        onViewDetails={() => setSelectedOrder(order)}
                                        onStatusChange={async (newStatus) => {
                                            try {
                                                const res = await api.post(`/orders/${order.id}/status`, { status: newStatus });
                                                if (res.data.success) {
                                                    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                                                }
                                            } catch (error) {
                                                console.error("Erreur lors de la mise à jour du statut", error);
                                            }
                                        }}
                                    />
                                ))}
                    </div>
                )}
            </div>
        </div>
    );
}