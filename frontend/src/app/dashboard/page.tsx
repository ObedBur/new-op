'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Welcome Card */}
            <div className="bg-gradient-to-br from-[#E67E22] via-[#FF9D4D] to-[#F5B041] rounded-3xl lg:rounded-[2rem] p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl shadow-[#E67E22]/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10">
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.25em] mb-2">Tableau de bord</p>
                    <h1 className="text-3xl lg:text-4xl font-black mb-2">
                        Bienvenue, {user?.fullName?.split(' ')[0]}
                    </h1>
                    <p className="text-white/80 text-sm max-w-md">
                        Gérez votre compte, suivez vos commandes et profitez de la meilleure expérience WapiBei.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Commandes', value: '0', icon: 'shopping_bag', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                    { label: 'En cours', value: '0', icon: 'local_shipping', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/10' },
                    { label: 'Favoris', value: '0', icon: 'favorite', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
                    { label: 'Avis laissés', value: '0', icon: 'reviews', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-500/10' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`size-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                            <span className={`material-symbols-outlined text-[20px] ${stat.color}`}>{stat.icon}</span>
                        </div>
                        <p className="text-2xl font-black text-deep-blue dark:text-white">{stat.value}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Account Info */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-deep-blue dark:text-white">Mon Compte</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Informations personnelles</p>
                    </div>
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-black border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        Modifier
                    </Link>
                </div>
                <div className="p-6 lg:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                        {[
                            { label: 'Nom complet', value: user?.fullName || '—', icon: 'person' },
                            { label: 'Email', value: user?.email || '—', icon: 'alternate_email' },
                            { label: 'Rôle', value: user?.role === 'VENDOR' ? 'Vendeur' : 'Client', icon: 'badge' },
                            { label: 'Statut', value: 'Actif', icon: 'check_circle', color: 'text-green-600' },
                        ].map((info, idx) => (
                            <div key={idx} className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{info.label}</label>
                                <div className={`flex items-center gap-3 text-sm font-bold ${info.color || 'text-deep-blue dark:text-white'}`}>
                                    <span className="material-symbols-outlined text-gray-300 text-[20px]">{info.icon}</span>
                                    {info.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Parcourir les produits', icon: 'storefront', href: '/', color: 'from-blue-500 to-blue-600' },
                    { label: 'Suivre mes commandes', icon: 'package_2', href: '/dashboard/orders', color: 'from-orange-500 to-orange-600' },
                    { label: 'Mes paramètres', icon: 'settings', href: '/settings', color: 'from-gray-500 to-gray-600' },
                ].map((action, idx) => (
                    <Link
                        key={idx}
                        href={action.href}
                        className="group bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                        <div className={`size-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-white text-[24px]">{action.icon}</span>
                        </div>
                        <p className="font-bold text-sm text-deep-blue dark:text-white group-hover:text-[#E67E22] transition-colors">{action.label}</p>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 block">Accéder →</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
