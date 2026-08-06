import React from 'react';
import { User } from '@/types';
import {
    X,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Star,
    Store,
    CheckCircle2,
    Clock,
    XCircle,
    BadgeCheck,
    ShieldCheck,
    User as UserIcon,
} from 'lucide-react';

interface VendorDetailModalProps {
    vendor: User;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; accent?: boolean }> = ({
    icon,
    label,
    value,
    accent,
}) => (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
        <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${accent ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
        </div>
    </div>
);

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({ vendor, onClose, onApprove, onReject }) => {
    const initials = (vendor.boutiqueName || vendor.fullName || 'V')
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const getStatusConfig = () => {
        switch (vendor.kycStatus) {
            case 'APPROVED': return { label: 'Approuvé', icon: <CheckCircle2 className="size-4" />, className: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' };
            case 'PENDING': return { label: 'En attente', icon: <Clock className="size-4" />, className: 'bg-amber-50 text-amber-700 border border-amber-200/60' };
            case 'REJECTED': return { label: 'Rejeté', icon: <XCircle className="size-4" />, className: 'bg-red-50 text-red-600 border border-red-200/60' };
            default: return { label: vendor.kycStatus, icon: null, className: 'bg-slate-100 text-slate-600 border border-slate-200/60' };
        }
    };
    const statusConfig = getStatusConfig();

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div className="relative bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
                {/* Header Banner */}
                <div className="relative h-28 bg-gradient-to-br from-orange-400 via-orange-500 to-emerald-600 overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 size-28 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-4 size-24 rounded-full bg-white/10" />
                    
                    {/* Close btn */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 size-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors cursor-pointer"
                    >
                        <X className="size-4" />
                    </button>

                    {/* Status badge */}
                    <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 ${
                            vendor.kycStatus === 'APPROVED' ? 'text-emerald-700' :
                            vendor.kycStatus === 'PENDING' ? 'text-amber-700' : 'text-red-600'
                        }`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                        </span>
                    </div>
                </div>

                {/* Avatar overlapping header */}
                <div className="relative -mt-10 px-6 flex items-end gap-4 mb-4">
                    <div className="size-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center bg-gradient-to-br from-orange-400 to-emerald-500 shrink-0">
                        <span className="text-2xl font-black text-white">{initials}</span>
                    </div>
                    <div className="pb-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight truncate leading-tight">
                                {vendor.boutiqueName || vendor.fullName}
                            </h3>
                            {vendor.kycStatus === 'APPROVED' && (
                                <BadgeCheck className="size-5 text-blue-500 shrink-0" />
                            )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="size-3 text-slate-400" />
                            <p className="text-xs text-slate-500 font-semibold truncate">
                                {vendor.commune || 'Goma'}{vendor.province ? `, ${vendor.province}` : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info rows */}
                <div className="px-6 pb-2">
                    <InfoRow
                        icon={<UserIcon className="size-4" />}
                        label="Responsable"
                        value={vendor.fullName}
                    />
                    <InfoRow
                        icon={<Mail className="size-4" />}
                        label="Email"
                        value={vendor.email}
                    />
                    <InfoRow
                        icon={<Phone className="size-4" />}
                        label="Téléphone"
                        value={vendor.phone || 'Non renseigné'}
                    />
                    <InfoRow
                        icon={<Store className="size-4" />}
                        label="Marché"
                        value={vendor.commune || 'Non spécifié'}
                    />
                    <InfoRow
                        icon={<Calendar className="size-4" />}
                        label="Inscrit le"
                        value={vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                    />
                    <InfoRow
                        icon={<Star className="size-4" />}
                        label="Score de confiance"
                        value={`${vendor.trustScore || 0} pts`}
                        accent
                    />
                </div>

                {/* Action Buttons */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/60">
                    {vendor.kycStatus === 'PENDING' ? (
                        <div className="flex gap-3">
                            <button
                                onClick={() => { onApprove(vendor.id); onClose(); }}
                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow-sm shadow-emerald-500/20 active:scale-95 transition-all text-sm cursor-pointer"
                            >
                                <CheckCircle2 className="size-4" />
                                Approuver
                            </button>
                            <button
                                onClick={() => { onReject(vendor.id); onClose(); }}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold py-3 rounded-2xl active:scale-95 transition-all text-sm cursor-pointer"
                            >
                                <XCircle className="size-4" />
                                Refuser
                            </button>
                        </div>
                    ) : (
                        <div className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold ${statusConfig.className}`}>
                            {statusConfig.icon}
                            Vendeur {statusConfig.label}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
