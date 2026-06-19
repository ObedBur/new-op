import React from 'react';
import { useAdminTranslation } from '@/features/admin-dashboard/hooks';
import { usePendingVendors } from '@/features/vendors/hooks/usePendingVendors';
import { useAdminSearch } from '@/features/admin-dashboard/context';
import { User } from '@/types';

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
        <div className="bg-sidebar-bg p-6 rounded-2xl border border-border-sep shadow-sm flex flex-col h-fit">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-black text-deep-blue tracking-tight">{t.dashboard.validation.title}</h3>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                    {pendingSellers.length} Total
                </span>
            </div>
            <div className="space-y-4 flex-1">
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
    );
};

const SellerCard: React.FC<{ 
    seller: User; 
    onApprove: () => void; 
    onReject: () => void;
    labels: { accept: string; refuse: string; }
}> = ({ seller, onApprove, onReject, labels }) => (
    <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-border-sep/40 hover:bg-slate-50 transition-colors group">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-border-sep">
            <span className="material-symbols-outlined text-primary">storefront</span>
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-black text-deep-blue truncate">{seller.boutiqueName || seller.fullName}</p>
                <span className="text-[9px] font-bold text-muted whitespace-nowrap">{seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : ''}</span>
            </div>
            <p className="text-[10px] text-muted font-bold mt-0.5">{seller.commune} • {seller.fullName}</p>
            <div className="flex gap-2 mt-3">
                <button 
                    onClick={onApprove}
                    className="flex-1 bg-primary text-white text-[10px] font-black py-2 rounded-xl shadow-sm shadow-primary/20 active:scale-95 transition-transform"
                >
                    {labels.accept}
                </button>
                <button 
                    onClick={onReject}
                    className="flex-1 bg-white border border-border-sep text-deep-blue text-[10px] font-black py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                    {labels.refuse}
                </button>
            </div>
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className="bg-sidebar-bg p-6 rounded-2xl border border-border-sep shadow-sm flex flex-col h-fit animate-pulse">
        <div className="h-4 w-32 bg-slate-100 rounded mb-6"></div>
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-slate-50 rounded-2xl"></div>
            ))}
        </div>
    </div>
);

const EmptyState: React.FC<{ searchQuery: string; labels: { search_empty: string; empty: string; } }> = ({ searchQuery, labels }) => (
    <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-10">
        <span className="material-symbols-outlined text-5xl mb-3 text-border-sep">
            {searchQuery ? 'search_off' : 'check_circle'}
        </span>
        <p className="text-xs font-black text-muted">
            {searchQuery ? labels.search_empty : labels.empty}
        </p>
    </div>
);

export default SellersValidation;
