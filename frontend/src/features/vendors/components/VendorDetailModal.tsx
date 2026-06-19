import React from 'react';
import { User } from '@/types';
import { Card } from "@/components/ui/Card";

interface InfoBlockProps {
    label: string;
    value: string;
    icon: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ label, value, icon }) => (
    <div className="flex gap-4">
        <div className="size-10 rounded-2xl bg-slate-50 flex items-center justify-center text-muted shrink-0 border border-border/40">
            <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div className="overflow-hidden space-y-0.5">
            <p className="text-[10px] font-black text-muted uppercase tracking-widest opacity-60">{label}</p>
            <p className="text-sm font-black text-deep-blue truncate tracking-tight">{value}</p>
        </div>
    </div>
);

interface VendorDetailModalProps {
    vendor: User;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({ vendor, onClose, onApprove, onReject }) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
            <Card className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-400 border-none p-0">
                <div className="p-8 space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-3xl font-black text-deep-blue leading-tight tracking-tight">
                                {vendor.boutiqueName || vendor.fullName}
                            </h3>
                            <p className="text-muted text-sm font-bold flex items-center gap-2 mt-2 uppercase tracking-widest">
                                <span className="material-symbols-outlined text-base">location_on</span> {vendor.province}, {vendor.commune || 'Inconnu'}
                            </p>
                        </div>
                        <button onClick={onClose} className="size-10 flex items-center justify-center bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                        <InfoBlock label="Création" value={new Date(vendor.createdAt).toLocaleDateString()} icon="calendar_today" />
                        <InfoBlock label="Vendeur" value={vendor.fullName} icon="person" />
                        <InfoBlock label="Contact" value={vendor.phone || 'Non fourni'} icon="phone" />
                        <InfoBlock label="Score" value={`${vendor.trustScore || 0} pts`} icon="star" />
                    </div>

                    <div className="p-6 bg-slate-50 rounded-3xl border border-border/50">
                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Email</p>
                        <p className="text-sm font-bold text-deep-blue">{vendor.email}</p>
                    </div>

                    <div className="flex gap-4">
                        {vendor.kycStatus === 'PENDING' && (
                            <>
                                <button 
                                    onClick={() => { onApprove(vendor.id); onClose(); }}
                                    className="flex-1 bg-primary text-white font-black py-4 rounded-2xl active:scale-95 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
                                >
                                    Approuver
                                </button>
                                <button 
                                    onClick={() => { onReject(vendor.id); onClose(); }}
                                    className="flex-1 bg-red-50 text-red-500 font-black py-4 rounded-2xl active:scale-95 border border-red-100 uppercase tracking-widest text-xs"
                                >
                                    Refuser
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
