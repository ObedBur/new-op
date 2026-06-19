import React from 'react';
import { User, KycStatus } from '@/types';
import { Card } from "@/components/ui/Card";

interface VendorCardProps {
    vendor: User;
    onViewBlockingDetails: (vendor: User) => void;
    onApprove?: (id: string) => void;
    onUpdateStatus?: (userId: string, status: KycStatus) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ 
    vendor, 
    onViewBlockingDetails,
    onApprove
}) => {
    // Helper to get status color
    const getStatusColor = (status: KycStatus) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700';
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <Card className={`overflow-hidden border-border/50 hover:shadow-lg hover:border-primary/20 transition-all group ${vendor.kycStatus === 'REJECTED' ? 'opacity-70 bg-muted/30' : ''}`}>
            <div className="flex gap-5 p-6">
                <div className="size-[72px] md:size-[80px] rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-border/40 shadow-sm group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-primary">storefront</span>
                </div>
                <div className="flex-1 flex flex-col justify-center overflow-hidden">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-deep-blue text-lg font-black leading-none tracking-tight ${vendor.kycStatus === 'REJECTED' ? 'line-through opacity-50' : ''}`}>
                            {vendor.boutiqueName || vendor.fullName}
                        </p>
                        {vendor.kycStatus === 'APPROVED' && (
                            <span className="material-symbols-outlined text-blue-500 text-base md:text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        )}
                    </div>
                    <p className="text-muted text-xs mt-1.5 font-bold uppercase tracking-wider opacity-80">{vendor.commune || 'Marché non spécifié'}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase mt-2 w-fit ${getStatusColor(vendor.kycStatus)}`}>
                        {vendor.kycStatus}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between px-6 pb-6 gap-3">
                <button
                    onClick={() => onViewBlockingDetails(vendor)}
                    className="flex-1 flex items-center justify-center h-12 rounded-2xl bg-slate-50 text-deep-blue text-sm font-black border border-border/50 hover:bg-slate-100 transition-colors uppercase tracking-wider"
                >
                    Détails
                </button>

                {vendor.kycStatus === 'PENDING' && onApprove ? (
                    <div className="flex gap-2 flex-1">
                        <button 
                            onClick={() => onApprove(vendor.id)}
                            className="flex-1 bg-primary text-white text-[10px] font-black h-12 rounded-2xl shadow-sm active:scale-95 transition-transform uppercase"
                        >
                            Approuver
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center h-12 rounded-2xl border border-border/50 bg-slate-50/50 opacity-60">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                            {vendor.kycStatus === 'APPROVED' ? 'Actif' : 'Banni/Rejeté'}
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
};
