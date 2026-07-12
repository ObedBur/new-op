"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  ShoppingBag, 
  Info, 
  MessageCircle, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import { useAuth } from '@/context/AuthContext';
import { AppNotification, resolveNotificationUrl } from '@/types/notification';
const formatDistanceToNow = (date: Date): string => {
  try {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "à l'instant";
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return "Récemment";
  }
};

type FilterType = 'all' | 'orders' | 'promo' | 'system';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useAppNotifications();
  const { user } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters = [
    { id: 'all', label: 'Tout', icon: <Bell size={14} /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingBag size={14} /> },
    { id: 'promo', label: 'Promotions', icon: <Sparkles size={14} /> },
    { id: 'system', label: 'Système', icon: <Info size={14} /> },
  ];

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'orders') return n.type.includes('ORDER') || n.type.includes('REQUEST');
    if (activeFilter === 'promo') return n.type.includes('PROMO');
    if (activeFilter === 'system') return !n.type.includes('ORDER') && !n.type.includes('PROMO');
    return true;
  });

  const getIcon = (type: string) => {
    if (type.includes('ORDER') || type.includes('REQUEST')) return <ShoppingBag className="text-[#A64B2A]" size={20} />;
    if (type.includes('PROMO')) return <Sparkles className="text-amber-500" size={20} />;
    if (type.includes('WELCOME') || type.includes('SYSTEM')) return <Info className="text-blue-500" size={20} />;
    return <Bell className="text-gray-400" size={20} />;
  };

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    const url = resolveNotificationUrl(notification, user?.role);
    if (url) {
      router.push(url);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-black pt-28 pb-20 px-4 flex justify-center font-sans">
      <div className="container max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-transparent p-6 md:p-14 lg:p-20"
        >
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-black/[0.03] dark:border-white/5 pb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-[#A64B2A] uppercase tracking-[0.3em]">
                <span className="w-8 h-px bg-[#A64B2A]" />
                Centre d'activités
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-[#8B4513] dark:text-white tracking-tighter uppercase leading-none">
                Notifications
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                Vous avez <span className="text-black dark:text-white">{unreadCount}</span> message(s) non lu(s)
              </p>
            </div>

            <Button 
              variant="ghost"
              onClick={() => markAllAsRead()}
              disabled={unreadCount === 0}
              className="text-[10px] font-black uppercase tracking-widest text-[#A64B2A] hover:bg-[#A64B2A]/5 px-6 h-12 rounded-full border border-[#A64B2A]/20 transition-all"
            >
              Tout marquer comme lu
            </Button>
          </div>

          {/* TABS / FILTERS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as FilterType)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeFilter === f.id 
                    ? "bg-[#080B1A] text-white shadow-xl shadow-black/10 scale-105" 
                    : "bg-white dark:bg-white/5 text-gray-400 hover:text-black border border-black/[0.03] dark:border-white/5"
                }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          {/* NOTIFICATIONS LIST */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center gap-4 opacity-20">
                  <Bell className="animate-bounce" size={40} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Chargement...</p>
                </div>
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((n, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`group relative flex items-start gap-5 p-6 border-b transition-all cursor-pointer ${
                      n.isRead 
                        ? "bg-transparent border-transparent opacity-50 grayscale-[0.5]" 
                        : "bg-white/50 dark:bg-white/5 border-black/[0.03] dark:border-white/5 hover:bg-white dark:hover:bg-white/10"
                    }`}
                  >
                    {/* Unread Indicator */}
                    {!n.isRead && (
                      <div className="absolute top-8 left-2 w-1.5 h-1.5 bg-[#A64B2A] rounded-full shadow-[0_0_10px_#A64B2A]" />
                    )}

                    {/* Icon Box */}
                    <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                      n.isRead ? "bg-gray-100 dark:bg-white/5" : "bg-[#FDFBF7] dark:bg-black/20 shadow-sm"
                    }`}>
                      {getIcon(n.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-sm md:text-md font-black uppercase tracking-tight ${
                          n.isRead ? "text-gray-500" : "text-[#8B4513] dark:text-white"
                        }`}>
                          {n.title}
                        </h3>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap ml-4">
                          {formatDistanceToNow(new Date(n.createdAt))}
                        </span>
                      </div>
                      <p className={`text-xs md:text-sm font-medium leading-relaxed max-w-2xl ${
                        n.isRead ? "text-gray-400" : "text-gray-600 dark:text-gray-400"
                      }`}>
                        {n.message}
                      </p>
                    </div>

                    {/* Action Arrow */}
                    <div className="size-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/5 dark:hover:bg-white/5">
                      <ChevronRight size={18} className="text-gray-300" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center"
                >
                  <div className="size-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                    <Bell size={40} />
                  </div>
                  <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">
                    Silence Radio
                  </h3>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-2">
                    Aucune notification ne correspond à ce filtre.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
