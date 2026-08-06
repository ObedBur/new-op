'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/features/admin-dashboard/api/admin.api';
import {
    Users,
    ShieldCheck,
    Store,
    User as UserIcon,
    ChevronRight,
    X,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Star,
    CheckCircle2,
    XCircle,
    Trash2,
    BadgeCheck,
    Crown,
    ShoppingBag,
} from 'lucide-react';

interface UserData {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    isVerified: boolean;
    city: string | null;
    country: string;
    createdAt: string;
    trustScore: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getRoleConfig = (role: string) => {
    switch (role) {
        case 'ADMIN': return { label: 'Admin', icon: <Crown className="size-3.5" />, className: 'bg-purple-50 text-purple-700 border border-purple-200/60', gradient: 'from-purple-500 to-purple-700' };
        case 'VENDOR': return { label: 'Vendeur', icon: <Store className="size-3.5" />, className: 'bg-blue-50 text-blue-700 border border-blue-200/60', gradient: 'from-blue-500 to-blue-700' };
        default: return { label: 'Client', icon: <UserIcon className="size-3.5" />, className: 'bg-slate-100 text-slate-600 border border-slate-200/60', gradient: 'from-slate-400 to-slate-600' };
    }
};

const getInitials = (name: string) =>
    (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

// ─── User Detail Modal ────────────────────────────────────────────────────────

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; accent?: boolean }> = ({ icon, label, value, accent }) => (
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

const UserDetailModal: React.FC<{
    user: UserData;
    onClose: () => void;
    onDelete: (id: string, name: string) => void;
}> = ({ user, onClose, onDelete }) => {
    const roleConfig = getRoleConfig(user.role);
    const initials = getInitials(user.fullName);

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

                {/* Header Banner */}
                <div className={`relative h-28 bg-gradient-to-br ${roleConfig.gradient} overflow-hidden`}>
                    <div className="absolute -top-6 -right-6 size-28 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -left-4 size-24 rounded-full bg-white/10" />
                    <button onClick={onClose} className="absolute top-4 right-4 size-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors cursor-pointer">
                        <X className="size-4" />
                    </button>
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 text-slate-700">
                            {roleConfig.icon}
                            {roleConfig.label}
                        </span>
                    </div>
                </div>

                {/* Avatar */}
                <div className="relative -mt-10 px-6 flex items-end gap-4 mb-4">
                    <div className={`size-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center bg-gradient-to-br ${roleConfig.gradient} shrink-0`}>
                        <span className="text-2xl font-black text-white">{initials}</span>
                    </div>
                    <div className="pb-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight truncate leading-tight">
                                {user.fullName || '—'}
                            </h3>
                            {user.isVerified && <BadgeCheck className="size-5 text-blue-500 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Star className="size-3 text-amber-400" />
                            <p className={`text-xs font-bold ${user.trustScore >= 80 ? 'text-emerald-600' : user.trustScore >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                                Score : {user.trustScore} pts
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info rows */}
                <div className="px-6 pb-2">
                    <InfoRow icon={<Mail className="size-4" />} label="Email" value={user.email} />
                    <InfoRow icon={<Phone className="size-4" />} label="Téléphone" value={user.phone || 'Non renseigné'} />
                    <InfoRow
                        icon={<MapPin className="size-4" />}
                        label="Localisation"
                        value={[user.city, user.country].filter(Boolean).join(', ') || 'Non spécifié'}
                    />
                    <InfoRow
                        icon={<Calendar className="size-4" />}
                        label="Inscrit le"
                        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                    />
                    <InfoRow
                        icon={user.isVerified ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                        label="Statut de vérification"
                        value={user.isVerified ? 'Compte vérifié' : 'Non vérifié'}
                        accent={user.isVerified}
                    />
                </div>

                {/* Actions */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl active:scale-95 transition-all text-sm cursor-pointer"
                    >
                        Fermer
                    </button>
                    <button
                        onClick={() => { onDelete(user.id, user.fullName || user.email); onClose(); }}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-3 rounded-2xl active:scale-95 transition-all text-sm cursor-pointer"
                    >
                        <Trash2 className="size-4" />
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── User Row Card ────────────────────────────────────────────────────────────

const UserRow: React.FC<{ user: UserData; onClick: () => void }> = ({ user, onClick }) => {
    const roleConfig = getRoleConfig(user.role);
    const initials = getInitials(user.fullName);

    return (
        <button
            onClick={onClick}
            className="w-full text-left group flex items-center gap-4 px-5 py-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        >
            {/* Avatar */}
            <div className={`size-11 rounded-xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white font-black text-xs shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                {initials}
            </div>

            {/* Name + email */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-slate-900 truncate tracking-tight">{user.fullName || '—'}</p>
                    {user.isVerified && <BadgeCheck className="size-4 text-blue-500 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">{user.email}</p>
            </div>

            {/* Score */}
            <div className="text-right shrink-0 hidden sm:block">
                <p className={`text-sm font-black ${user.trustScore >= 80 ? 'text-emerald-600' : user.trustScore >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                    {user.trustScore} pts
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">Score</p>
            </div>

            {/* Role Badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${roleConfig.className}`}>
                {roleConfig.icon}
                {roleConfig.label}
            </span>

            <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
    );
};

// ─── Page ────────────────────────────────────────────────────────────────────

type RoleFilter = 'Tous' | 'ADMIN' | 'VENDOR' | 'CLIENT';
const ROLE_FILTERS: RoleFilter[] = ['Tous', 'ADMIN', 'VENDOR', 'CLIENT'];
const ROLE_LABELS: Record<RoleFilter, string> = { Tous: 'Tous', ADMIN: 'Admins', VENDOR: 'Vendeurs', CLIENT: 'Clients' };

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [activeRole, setActiveRole] = useState<RoleFilter>('Tous');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data: any = await adminService.getTestUsers();
                const userData = data?.users || (Array.isArray(data) ? data : []);
                setUsers(userData);
            } catch (err) {
                console.error('Failed to load users', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (userId: string, userName: string) => {
        if (!window.confirm(`Voulez-vous vraiment supprimer ${userName} ? Cette action est irréversible.`)) return;
        try {
            await adminService.deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            console.error('Erreur lors de la suppression', error);
        }
    };

    const filtered = activeRole === 'Tous' ? users : users.filter(u => u.role === activeRole);

    if (isLoading) {
        return (
            <div className="space-y-3 animate-pulse">
                {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-[72px] bg-slate-100 rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Admins', count: users.filter(u => u.role === 'ADMIN').length, icon: <Crown className="size-4" />, bg: 'bg-purple-50 text-purple-600' },
                    { label: 'Vendeurs', count: users.filter(u => u.role === 'VENDOR').length, icon: <Store className="size-4" />, bg: 'bg-blue-50 text-blue-600' },
                    { label: 'Clients', count: users.filter(u => u.role === 'CLIENT').length, icon: <UserIcon className="size-4" />, bg: 'bg-slate-100 text-slate-600' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3">
                        <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
                        <div>
                            <p className="text-xl font-black text-slate-900 leading-none">{s.count}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Role filter bar */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
                    {ROLE_FILTERS.map(role => (
                        <button
                            key={role}
                            onClick={() => setActiveRole(role)}
                            className={`h-10 shrink-0 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                activeRole === role
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {ROLE_LABELS[role]}
                        </button>
                    ))}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap shrink-0">
                    {filtered.length} trouvé{filtered.length > 1 ? 's' : ''}
                </span>
            </div>

            {/* User list */}
            {filtered.length > 0 ? (
                <div className="space-y-2.5">
                    {filtered.map(user => (
                        <UserRow key={user.id} user={user} onClick={() => setSelectedUser(user)} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                        <Users className="size-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Aucun utilisateur trouvé</p>
                    <p className="text-xs text-slate-400 mt-1">Essayez de changer le filtre de rôle.</p>
                </div>
            )}

            {/* User detail modal */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
