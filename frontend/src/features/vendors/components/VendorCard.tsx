import React from 'react';
import { User, KycStatus } from '@/types';
import {
    Store,
    MapPin,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronRight,
    ShieldCheck,
    BadgeCheck,
} from 'lucide-react';

interface VendorCardProps {
    vendor: User;
    onViewDetails: (vendor: User) => void;
}

const getStatusConfig = (status: KycStatus) => {
    switch (status) {
        case 'APPROVED':
            return {
                label: 'Approuvé',
                icon: <CheckCircle2 className="size-3.5" />,
                className: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
            };
        case 'PENDING':
            return {
                label: 'En attente',
                icon: <Clock className="size-3.5" />,
                className: 'bg-amber-50 text-amber-700 border border-amber-200/60',
            };
        case 'REJECTED':
            return {
                label: 'Rejeté',
                icon: <XCircle className="size-3.5" />,
                className: 'bg-red-50 text-red-600 border border-red-200/60',
            };
        default:
            return {
                label: status,
                icon: null,
                className: 'bg-slate-100 text-slate-600 border border-slate-200/60',
            };
    }
};

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onViewDetails }) => {
    const statusConfig = getStatusConfig(vendor.kycStatus);
    const initials = (vendor.boutiqueName || vendor.fullName || 'V')
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <button
            onClick={() => onViewDetails(vendor)}
            className={`w-full text-left group flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${
                vendor.kycStatus === 'REJECTED' ? 'opacity-60' : ''
            }`}
        >
            {/* Avatar */}
            <div className="size-12 rounded-xl bg-gradient-to-br from-orange-400 to-emerald-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className={`text-sm font-black text-slate-900 truncate tracking-tight ${vendor.kycStatus === 'REJECTED' ? 'line-through opacity-50' : ''}`}>
                        {vendor.boutiqueName || vendor.fullName}
                    </p>
                    {vendor.kycStatus === 'APPROVED' && (
                        <BadgeCheck className="size-4 text-blue-500 shrink-0" />
                    )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="size-3 text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-500 font-semibold truncate">
                        {vendor.commune || 'Goma'}{vendor.province ? `, ${vendor.province}` : ''}
                    </span>
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3 shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${statusConfig.className}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                </span>
                <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
            </div>
        </button>
    );
};
