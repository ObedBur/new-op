import React from 'react';
import { useAdminTranslation } from '@/features/admin-dashboard/hooks';
import { usePendingVendors } from '@/features/vendors/hooks/usePendingVendors';
import { useAdminSearch } from '@/features/admin-dashboard/context';
import { User } from '@/types';
import { Store, CheckCircle2, SearchX } from 'lucide-react';

const SellersValidation: React.FC = () => {
    const { t } = useAdminTranslation();
    const { searchQuery } = useAdminSearch();
    const { pendingSellers, isLoading, updateKycStatus } = usePendingVendors();

    const filteredSellers = pendingSellers.filter((seller) => {
        const query = searchQuery.toLowerCase();
        return (
            (seller.boutiqueName?.toLowerCase() || '').includes(query) ||
            (seller.fullName?.toLowerCase() || '').includes(query) ||
            (seller.commune?.toLowerCase() || '').includes(query)
        );
    });

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full min-h-[380px] justify-between">
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">{t.dashboard.validation.title}</h3>
                    <span className="bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        {pendingSellers.length} Total
                    </span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[290px] no-scrollbar">
                    {filteredSellers.map((seller) => (
                        <SellerCard 
                            key={seller.id} 
                            seller={seller} 
                            onApprove={() => updateKycStatus(seller.id, 'APPROVED')}
                            onReject={() => updateKycStatus(seller.id, 'REJECTED')}
                            labels={{
                                accept: t.dashboard.validation.accept,
                                refuse: t.dashboard.validation.refuse
                            }}
                        />
                    ))}
                    {filteredSellers.length === 0 && (
                        <EmptyState 
                            searchQuery={searchQuery}
                            labels={{
                                search_empty: t.dashboard.validation.search_empty,
                                empty: t.dashboard.validation.empty
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const SellerCard: React.FC<{ 
    seller: User; 
    onApprove: () => void; 
    onReject: () => void;
    labels: { accept: string; refuse: string; }
}> = ({ seller, onApprove, onReject, labels }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 hover:bg-slate-100/60 transition-colors group">
        <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
            <Store className="size-5 shrink-0" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-extrabold text-slate-900 truncate">{seller.boutiqueName || seller.fullName}</p>
                <span className="text-[9px] font-semibold text-slate-400 whitespace-nowrap">{seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : ''}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{seller.commune} • {seller.fullName}</p>
            <div className="flex gap-2 mt-2">
                <button 
                    onClick={onApprove}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                    {labels.accept}
                </button>
                <button 
                    onClick={onReject}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-[10px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                    {labels.refuse}
                </button>
            </div>
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full min-h-[380px] animate-pulse">
        <div className="h-4 w-32 bg-slate-100 rounded mb-6"></div>
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-slate-50 rounded-xl"></div>
            ))}
        </div>
    </div>
);

const EmptyState: React.FC<{ searchQuery: string; labels: { search_empty: string; empty: string; } }> = ({ searchQuery, labels }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            {searchQuery ? <SearchX className="size-6 text-emerald-600" /> : <CheckCircle2 className="size-6 text-emerald-600" /> }
        </div>
        <p className="text-xs font-bold text-slate-500">
            {searchQuery ? labels.search_empty : labels.empty}
        </p>
    </div>
);

export default SellersValidation;
