'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/features/admin-dashboard/hooks';
import { AppNotification, resolveNotificationUrl } from '@/types/notification';
import {
    Bell,
    ShoppingBag,
    Sparkles,
    Info,
    CheckCircle2,
    ChevronRight,
    AlertTriangle,
    CheckCircle,
} from 'lucide-react';

const formatDistanceToNow = (date: Date): string => {
    try {
        const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return "à l'instant";
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } catch {
        return 'Récemment';
    }
};

type FilterType = 'all' | 'orders' | 'promo' | 'system';

const FILTERS: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Tout', icon: <Bell size={14} /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingBag size={14} /> },
    { id: 'promo', label: 'Promotions', icon: <Sparkles size={14} /> },
    { id: 'system', label: 'Système', icon: <Info size={14} /> },
];

const getTypeStyles = (type: string) => {
    if (type === 'SYSTEM_ALERT') return 'bg-emerald-50 text-emerald-600';
    if (type === 'ORDER_CONFIRMED' || type === 'PAYMENT_RECEIVED') return 'bg-green-50 text-green-600';
    if (type === 'PROMOTION') return 'bg-amber-50 text-amber-600';
    return 'bg-blue-50 text-blue-600';
};

const getTypeIcon = (type: string) => {
    if (type === 'SYSTEM_ALERT') return <AlertTriangle className="size-4" />;
    if (type === 'ORDER_CONFIRMED' || type === 'PAYMENT_RECEIVED') return <CheckCircle className="size-4" />;
    if (type === 'PROMOTION') return <Sparkles className="size-4" />;
    return <Info className="size-4" />;
};

export default function AdminNotificationsPage() {
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
    const { user } = useAuth();
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const filtered = notifications.filter((n) => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'orders') return n.type.includes('ORDER') || n.type.includes('REQUEST');
        if (activeFilter === 'promo') return n.type.includes('PROMO');
        if (activeFilter === 'system') return !n.type.includes('ORDER') && !n.type.includes('PROMO');
        return true;
    });

    const handleNotificationClick = (notification: AppNotification) => {
        if (!notification.isRead) markAsRead(notification.id);
        const url = resolveNotificationUrl(notification, user?.role);
        if (url && url !== '/admin/notifications') {
            router.push(url);
        }
    };

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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                        Notifications
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        Vous avez{' '}
                        <span className="text-orange-500">{unreadCount}</span> notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => markAllAsRead()}
                    disabled={unreadCount === 0}
                    className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                    <CheckCircle2 className="size-4" />
                    Tout marquer comme lu
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={`h-10 shrink-0 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                            activeFilter === f.id
                                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {f.icon}
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Notification list */}
            {filtered.length > 0 ? (
                <div className="space-y-2.5">
                    {filtered.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`group flex items-center gap-4 px-5 py-3.5 bg-white rounded-2xl border shadow-xs transition-all duration-200 cursor-pointer relative ${
                                n.isRead
                                    ? 'border-slate-200/80 opacity-60 hover:opacity-90'
                                    : 'border-orange-200/60 hover:shadow-md hover:border-orange-300'
                            }`}
                        >
                            {!n.isRead && (
                                <span className="absolute left-0 top-4 bottom-4 w-1 bg-orange-500 rounded-r-full" />
                            )}
                            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${getTypeStyles(n.type)}`}>
                                {getTypeIcon(n.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-3">
                                    <p className={`text-sm font-black truncate tracking-tight ${n.isRead ? 'text-slate-500' : 'text-slate-900'}`}>
                                        {n.title}
                                    </p>
                                    <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap shrink-0">
                                        {formatDistanceToNow(new Date(n.createdAt))}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{n.message}</p>
                            </div>
                            <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                        <Bell className="size-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Aucune notification</p>
                    <p className="text-xs text-slate-400 mt-1">Les nouvelles alertes apparaîtront ici en temps réel.</p>
                </div>
            )}
        </div>
    );
}
