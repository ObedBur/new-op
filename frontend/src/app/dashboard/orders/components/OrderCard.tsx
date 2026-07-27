import React from 'react';
import { Package, CheckCircle, Truck, ChevronRight, MessageCircle, AlertCircle, FileText, X } from 'lucide-react';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | string;

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
    onDelete?: () => void;
}

export function OrderCard({ id, originalId, status, total, date, count, customer, customerPhone, productName, productImage, onStatusChange, onViewDetails, onDelete }: OrderCardProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    const isPending = status === 'PENDING';
    const isConfirmed = status === 'CONFIRMED';
    const isShipped = status === 'SHIPPED';
    const isDelivered = status === 'DELIVERED';
    const isCancelled = status === 'CANCELLED';

    const statusLabels: Record<string, string> = {
        PENDING: 'Nouvelle',
        CONFIRMED: 'Confirmée',
        SHIPPED: 'Expédiée',
        DELIVERED: 'Livrée',
        CANCELLED: 'Annulée'
    };

    const statusStyles: Record<string, string> = {
        PENDING: 'bg-orange-50 text-[#E67E22] border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
        CONFIRMED: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
        SHIPPED: 'bg-[#F0FDF4] text-[#2D5A27] border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
        DELIVERED: 'bg-[#F0FDF4] text-[#2D5A27] border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/40',
        CANCELLED: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    };

    const handleAction = async (newStatus: string) => {
        if (!onStatusChange) return;
        setIsLoading(true);
        try {
            await onStatusChange(newStatus);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative bg-white dark:bg-[#0f172a] rounded-3xl p-3 lg:p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-900/30 transition-all duration-300 flex flex-col">
            {/* Glow décoratif discret au hover */}
            <div className="absolute -inset-px bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity pointer-events-none" />

            {/* HEADER */}
            <div className="flex items-start justify-between gap-2 mb-3 lg:mb-4 w-full">
                <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                    <div className="size-8 lg:size-10 flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10 text-[#E67E22] dark:text-orange-400 border border-orange-100 dark:border-orange-500/20 shrink-0">
                        <Package size={14} className="lg:size-[18px]" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[9px] sm:text-[11px] lg:text-xs font-black text-deep-blue dark:text-white uppercase tracking-tight">Cmd</span>
                            <span className="text-[9px] sm:text-[11px] lg:text-xs font-black text-[#E67E22] truncate">#{id}</span>
                        </div>
                        <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">{date}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-full text-[9px] sm:text-[10px] lg:text-[11px] font-black uppercase tracking-wider border flex items-center gap-1 lg:gap-1.5 shrink-0 ${statusStyles[status] || statusStyles['PENDING']}`}>
                        {isPending && (
                            <span className="flex size-1.5 relative shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-1.5 bg-orange-500"></span>
                            </span>
                        )}
                        {isConfirmed && <CheckCircle size={12} className="shrink-0" />}
                        {isShipped && <Truck size={12} className="shrink-0" />}
                        {isDelivered && <CheckCircle size={12} className="shrink-0" />}
                        {isCancelled && <AlertCircle size={12} className="shrink-0" />}
                        <span className="hidden sm:inline-block truncate max-w-[80px]">{statusLabels[status] || status}</span>
                    </div>
                    {onDelete && !isDelivered && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="size-7 lg:size-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors border border-red-100 dark:border-red-500/20 shrink-0 shadow-sm"
                            title="Supprimer la commande"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* PRODUIT & CLIENT (Simplified) */}
            <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-5 mt-1 lg:mt-2 min-w-0">
                <div className="size-10 lg:size-12 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {productImage ? (
                        <img src={productImage} alt={productName} className="size-full object-cover" />
                    ) : (
                        <Package size={16} className="lg:size-18 text-gray-400" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-deep-blue dark:text-white truncate text-xs lg:text-sm leading-tight">
                        {productName}
                    </h5>
                    <div className="mt-0.5 lg:mt-1 flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <span>{count}x</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[#E67E22]">${total}</span>
                    </div>
                </div>
            </div>

            {/* INFO CLIENT COMPACT */}
            <div className="hidden lg:flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/5 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[9px] font-black shrink-0">
                        {customer.charAt(0)}
                    </div>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate">{customer}</p>
                </div>
                <button
                    onClick={onViewDetails}
                    className="text-[10px] font-bold text-[#E67E22] hover:text-orange-600 uppercase tracking-wider shrink-0 flex items-center gap-0.5"
                >
                    Détails <ChevronRight size={14} />
                </button>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-row items-center gap-1.5 lg:gap-2 mt-auto w-full">
                {isPending ? (
                    <>
                        <button
                            onClick={() => handleAction('CONFIRMED')}
                            disabled={isLoading}
                            className="flex-1 min-w-0 h-[34px] lg:h-[40px] px-1 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-bold text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-sm flex items-center justify-center gap-1 lg:gap-1.5 disabled:opacity-50"
                        >
                            {isLoading ? <div className="animate-spin rounded-full size-3 lg:size-4 border-2 border-white/30 border-t-white shrink-0"></div> : <CheckCircle size={14} className="shrink-0" />}
                            <span className="truncate min-w-0">Confirmer</span>
                        </button>
                        <a
                            href={`https://wa.me/${customerPhone?.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-[34px] sm:h-[34px] sm:w-auto sm:flex-1 lg:h-[40px] lg:w-auto lg:flex-1 sm:px-2 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-1 lg:gap-1.5 shadow-sm shrink-0"
                            title="WhatsApp"
                        >
                            <svg className="shrink-0 text-[#25D366] fill-current" width="16" height="16" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                            </svg>
                            <span className="hidden sm:inline truncate min-w-0">WhatsApp</span>
                        </a>
                    </>
                ) : isConfirmed ? (
                    <>
                        <button
                            onClick={() => handleAction('SHIPPED')}
                            disabled={isLoading}
                            className="flex-1 min-w-0 h-[34px] lg:h-[40px] px-1 bg-[#E67E22] dark:bg-[#E67E22] text-white rounded-xl font-bold text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider hover:bg-orange-600 transition-all shadow-sm flex items-center justify-center gap-1 lg:gap-1.5 disabled:opacity-50"
                        >
                            {isLoading ? <div className="animate-spin rounded-full size-3 lg:size-4 border-2 border-white/30 border-t-white shrink-0"></div> : <Truck size={14} className="shrink-0" />}
                            <span className="truncate min-w-0">Expédier</span>
                        </button>
                        <a
                            href={`https://wa.me/${customerPhone?.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-[34px] sm:h-[34px] sm:w-auto sm:flex-1 lg:h-[40px] lg:w-auto lg:flex-1 sm:px-2 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-1 lg:gap-1.5 shadow-sm shrink-0"
                            title="WhatsApp"
                        >
                            <svg className="shrink-0 text-[#25D366] fill-current" width="16" height="16" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                            </svg>
                            <span className="hidden sm:inline truncate min-w-0">WhatsApp</span>
                        </a>
                    </>
                ) : isShipped ? (
                    <button
                        onClick={() => handleAction('DELIVERED')}
                        disabled={isLoading}
                        className="w-full h-[34px] lg:h-[40px] px-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl font-bold text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-1 lg:gap-1.5 disabled:opacity-50 group min-w-0"
                    >
                        {isLoading ? <div className="animate-spin rounded-full size-3 lg:size-4 border-2 border-current border-t-transparent shrink-0"></div> : <CheckCircle size={14} className="shrink-0 group-hover:scale-110 transition-transform" />}
                        <span className="hidden sm:inline truncate min-w-0">Confirmer livraison</span>
                        <span className="sm:hidden truncate min-w-0">Livré</span>
                    </button>
                ) : (
                    <button
                        onClick={onViewDetails}
                        className="w-full h-[34px] lg:h-[40px] px-2 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-1 lg:gap-1.5 group min-w-0"
                    >
                        <FileText size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline truncate min-w-0">Détails commande</span>
                        <span className="sm:hidden truncate min-w-0">Détails</span>
                    </button>
                )}
            </div>
        </div>
    );
}
