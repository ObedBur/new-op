import React from 'react';
import { X, MapPin, Phone, ChevronRight } from 'lucide-react';

export interface OrderDetailsModalProps {
    order: any;
    onClose: () => void;
    onStatusChange?: (newStatus: string) => Promise<void>;
}

export function OrderDetailsModal({ order, onClose, onStatusChange }: OrderDetailsModalProps) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* OVERLAY */}
            <div
                className="absolute inset-0 bg-deep-blue/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* MODAL CONTAINER */}
            <div className="relative w-full max-w-xl bg-white dark:bg-[#0f172a] rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-400">
                
                {/* Grab handle mobile */}
                <div className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full z-50 pointer-events-none" />

                {/* Header (Clean) */}
                <div className="px-5 pt-8 pb-4 sm:p-8 sm:pb-6 bg-white dark:bg-[#0f172a] border-b border-gray-100 dark:border-white/5 flex items-start justify-between shrink-0 relative z-10">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-deep-blue dark:text-white tracking-tight leading-none mb-1.5">
                            Détails commande
                        </h3>
                        <p className="text-[#E67E22] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                            #{order.id.substring(0, 12).toUpperCase()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-9 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 hover:text-deep-blue dark:hover:text-white flex items-center justify-center transition-all shrink-0 -mt-1 -mr-1"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f172a]">
                    
                    {/* Infos Client */}
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ChevronRight size={14} className="text-[#E67E22]" />
                            Informations Acheteur
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <MapPin size={10} className="text-[#E67E22]" />
                                    Livraison
                                </p>
                                <p className="text-sm font-black text-deep-blue dark:text-white leading-relaxed whitespace-normal break-words">
                                    {order.deliveryAddress || "Non spécifiée"}
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <Phone size={10} className="text-green-500" />
                                    Téléphone
                                </p>
                                <p className="text-sm font-black text-deep-blue dark:text-white leading-relaxed">
                                    {order.customerPhone || "N/A"}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Produit */}
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ChevronRight size={14} className="text-[#E67E22]" />
                            Résumé
                        </h4>
                        <div className="flex items-center gap-4 p-2">
                            <div className="size-16 sm:size-20 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden border border-gray-200 dark:border-white/10 shrink-0">
                                <img src={order.product?.image || order.product?.images?.[0]} alt="" className="size-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h5 className="text-sm sm:text-base font-black text-deep-blue dark:text-white mb-2 truncate">
                                    {order.product?.name || "Produit inconnu"}
                                </h5>
                                <div className="flex items-center gap-3">
                                    <div className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-md text-[9px] font-black uppercase text-gray-500">
                                        Qté: {Math.max(1, Math.round(order.totalPrice / (order.product?.price || order.totalPrice || 1)))}
                                    </div>
                                    <div className="text-base sm:text-lg font-black text-[#E67E22]">
                                        ${order.totalPrice}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-5 sm:p-8 pb-8 sm:pb-8 bg-white dark:bg-[#0f172a] flex gap-3 sm:gap-4 border-t border-gray-100 dark:border-white/5 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none">
                    <a
                        href={`https://wa.me/${(order.customerPhone || "").replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 py-3.5 sm:py-4 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest text-[#2D5A27] dark:text-green-400 text-center flex items-center justify-center gap-2 transition-colors"
                    >
                        <svg className="shrink-0 text-[#25D366] fill-current" width="16" height="16" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                        </svg>
                        WhatsApp
                    </a>
                    {order.status === 'PENDING' && onStatusChange && (
                        <button
                            onClick={async () => {
                                await onStatusChange('CONFIRMED');
                                onClose();
                            }}
                            className="flex-1 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-colors"
                        >
                            Confirmer
                        </button>
                    )}
                    {order.status === 'CONFIRMED' && onStatusChange && (
                        <button
                            onClick={async () => {
                                await onStatusChange('SHIPPED');
                                onClose();
                            }}
                            className="flex-1 py-3.5 sm:py-4 bg-[#E67E22] hover:bg-orange-600 text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-colors"
                        >
                            Expédier
                        </button>
                    )}
                    {order.status === 'SHIPPED' && onStatusChange && (
                        <button
                            onClick={async () => {
                                await onStatusChange('DELIVERED');
                                onClose();
                            }}
                            className="flex-1 py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-colors"
                        >
                            Livraison
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 sm:py-4 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
