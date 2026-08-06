'use client';

import React from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    UserPlus,
    DollarSign,
    Package,
    Calendar,
    Download,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';

const StatCard: React.FC<{
    label: string;
    value: string;
    change: string;
    positive: boolean;
    icon: React.ReactNode;
    bg: string;
}> = ({ label, value, change, positive, icon, bg }) => (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
        <div className="flex items-center justify-between mb-4">
            <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${bg} group-hover:scale-105 transition-transform`}>
                {icon}
            </div>
            <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                positive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-red-50 text-red-600 border border-red-200/60'
            }`}>
                {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {change}
            </span>
        </div>
        <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
    </div>
);

const ChartPlaceholder: React.FC<{ title: string; subtitle: string; icon: React.ReactNode }> = ({ title, subtitle, icon }) => (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">{title}</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>
            </div>
            <button className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 uppercase tracking-widest hover:underline cursor-pointer">
                <Download className="size-3" />
                Export
            </button>
        </div>
        <div className="h-52 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60">
            <div className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                {icon}
            </div>
            <div className="text-center">
                <p className="text-xs font-bold text-slate-500">Données en attente</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Disponible avec les premières commandes</p>
            </div>
        </div>
    </div>
);

const ActivityRow: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => (
    <div className="space-y-1.5">
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">{label}</span>
            <span className="text-xs font-black text-slate-900">{value}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
            />
        </div>
    </div>
);

export default function AdminReportsPage() {
    const stats = [
        { label: 'Revenus du mois', value: '0 FC', change: '+0%', positive: true, icon: <DollarSign className="size-5 text-emerald-600" />, bg: 'bg-emerald-50' },
        { label: 'Commandes totales', value: '0', change: '+0%', positive: true, icon: <ShoppingCart className="size-5 text-orange-600" />, bg: 'bg-orange-50' },
        { label: 'Nouveaux utilisateurs', value: '0', change: '+0%', positive: true, icon: <UserPlus className="size-5 text-blue-600" />, bg: 'bg-blue-50' },
        { label: 'Taux conversion', value: '0%', change: '0%', positive: false, icon: <TrendingUp className="size-5 text-purple-600" />, bg: 'bg-purple-50' },
    ];

    const activityData = [
        { label: 'Virunga', value: 12, color: 'bg-blue-500' },
        { label: 'Birere', value: 8, color: 'bg-emerald-500' },
        { label: 'Alanine', value: 5, color: 'bg-purple-500' },
    ];
    const maxActivity = Math.max(...activityData.map(a => a.value));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* Page header actions */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Période actuelle</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Calendar className="size-4 text-orange-500" />
                        <span className="text-sm font-black text-slate-900">Août 2026</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-xs cursor-pointer">
                    <RefreshCw className="size-3.5" />
                    Actualiser
                </button>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <StatCard key={s.label} {...s} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartPlaceholder
                    title="Évolution des Revenus"
                    subtitle="Données mensuelles"
                    icon={<BarChart3 className="size-6" />}
                />
                <ChartPlaceholder
                    title="Activité des Utilisateurs"
                    subtitle="Inscriptions & connexions"
                    icon={<TrendingUp className="size-6" />}
                />
            </div>

            {/* Bottom Row: Market Activity + Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity by Market */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                    <h3 className="text-base font-black text-slate-900 tracking-tight mb-1">Activité par Marché</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-6">Transactions par marché</p>
                    <div className="space-y-5">
                        {activityData.map(a => (
                            <ActivityRow key={a.label} {...a} max={maxActivity} />
                        ))}
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                    <h3 className="text-base font-black text-slate-900 tracking-tight mb-1">Résumé Plateforme</h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-5">État général du système</p>
                    <div className="space-y-3">
                        {[
                            { label: 'Vendeurs actifs', value: '—', icon: <Package className="size-4 text-emerald-600" />, bg: 'bg-emerald-50' },
                            { label: 'Produits en ligne', value: '—', icon: <ShoppingCart className="size-4 text-orange-600" />, bg: 'bg-orange-50' },
                            { label: 'Commandes ce mois', value: '0', icon: <TrendingUp className="size-4 text-blue-600" />, bg: 'bg-blue-50' },
                            { label: 'KYC en attente', value: '—', icon: <UserPlus className="size-4 text-amber-600" />, bg: 'bg-amber-50' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
                                    {item.icon}
                                </div>
                                <span className="text-sm font-bold text-slate-700 flex-1">{item.label}</span>
                                <span className="text-sm font-black text-slate-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
