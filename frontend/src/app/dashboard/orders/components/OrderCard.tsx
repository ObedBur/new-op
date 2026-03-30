import React from 'react';
import { Package, CheckCircle, Truck, ChevronRight, MessageCircle, AlertCircle, FileText } from 'lucide-react';

export type OrderStatus = 'À traiter' | 'Expédiées' | 'Livrées' | 'Annulées';

export interface OrderCardProps {
    id: string;
    originalId: string;
    status: OrderStatus;
    total: number;
    date: string;
    count: number;
    customer: string;
    customerPhone?: string;
    productName: string;
    productImage?: string;
    onStatusChange?: (newStatus: string) => void;
    onViewDetails?: () => void;
}

export function OrderCard({ id, originalId, status, total, date, count, customer, customerPhone, productName, productImage, onStatusChange, onViewDetails }: OrderCardProps) {
    const isATraiter = status === 'À traiter';
    const isLivree = status === 'Livrées';
    const isAnnulee = status === 'Annulées';

    const statusStyles: Record<OrderStatus, string> = {
        'À traiter': 'bg-orange-50 text-[#E67E22] border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
        'Expédiées': 'bg-[#F0FDF4] text-[#2D5A27] border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
        'Livrées': 'bg-[#F0FDF4] text-[#2D5A27] border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/40',
        'Annulées': 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    };

    return (
        <div className="group relative bg-white dark:bg-[#0f172a] rounded-3xl p-4 lg:p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-900/30 transition-all duration-300">
            {/* Glow décoratif discret au hover */}
            <div className="absolute -inset-px bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity pointer-events-none" />

            {/* HEADER */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 border border-gray-100 dark:border-white/5 overflow-hidden relative">
                        {productImage ? (
                            <img src={productImage} alt={productName} className="size-full object-cover shadow-inner" />
                        ) : (
                            <Package size={18} />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-deep-blue dark:text-white uppercase tracking-tight">Commande</span>
                            <span className="text-sm font-black text-[#E67E22]">#{id}</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{date}</p>
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
            <div className="bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl p-3 mb-4">
                <div className="flex items-center gap-4">
                    <div className="size-11 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-sm shrink-0 overflow-hidden relative">
                        {productImage ? (
                            <img src={productImage} alt={productName} className="size-full object-cover" />
                        ) : (
                            <Package size={18} className="text-gray-400" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h5 className="font-black text-deep-blue dark:text-white truncate text-sm lg:text-base leading-tight">
                            {productName}
                        </h5>
                        <div className="mt-1 flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <span>Qté: {count}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[#E67E22]">${total}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* INFO CLIENT */}
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-full bg-deep-blue dark:bg-orange-600 text-white flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-[#111827] shadow-sm">
                        {customer.charAt(0)}
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Acheteur</p>
                        <p className="text-sm font-black text-gray-700 dark:text-gray-300">{customer}</p>
                    </div>
                </div>
                <button
                    onClick={onViewDetails}
                    className="text-gray-300 hover:text-[#E67E22] transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {isATraiter ? (
                    <>
                        <button
                            onClick={() => onStatusChange && onStatusChange('SHIPPED')}
                            className="col-span-1 py-1 bg-deep-blue dark:bg-white text-white dark:text-deep-blue rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-[#E67E22] dark:hover:bg-[#E67E22] dark:hover:text-white transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5"
                        >
                            <Truck size={14} />
                            <span>Expédier</span>
                        </button>
                        <a
                            href={`https://wa.me/${customerPhone?.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="col-span-1 py-3 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
                        >
                            <MessageCircle size={14} className="text-green-500" />
                            <span>WhatsApp</span>
                        </a>
                    </>
                ) : status === 'Expédiées' ? (
                    <button
                        onClick={() => onStatusChange && onStatusChange('DELIVERED')}
                            className="col-span-2 py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                        <CheckCircle size={14} />
                            <span>Confirmer la livraison</span>
                    </button>
                ) : (
                            <button
                                onClick={onViewDetails}
                                className="col-span-2 py-3 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
                            >
                        <FileText size={14} />
                                <span>Détails commande</span>
                    </button>
                )}
            </div>
        </div>
    );
}
