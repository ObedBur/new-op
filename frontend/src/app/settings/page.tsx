"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Store, Heart, Bell, ShieldCheck, Settings as SettingsIcon,
  ChevronRight, MapPin, BadgeCheck, TrendingDown, TrendingUp,
  Package, Plus, Hammer, Smartphone, Sprout, Search, Lock,
  ShoppingBag, CheckCircle2, Clock, MoreVertical, SlidersHorizontal,
  Edit3, Camera, Trash2
} from "lucide-react";
import EditProfileModal from "../modal/EditProfileModal";

import { useAuth } from "@/context/AuthContext";
import { Language, Theme, useSettings } from "@/context/SettingsContext";
import { useRouter, useSearchParams } from 'next/navigation';
import { VendorSidebar } from "@/components/layout/VendorSidebar";
import { useAppNotifications } from "@/hooks/useAppNotifications";
import { getNotificationPreferences, saveNotificationPreferences, NotificationPreferences } from "@/features/notifications/services/preferences.service";
import { resolveNotificationUrl } from "@/types/notification";
import { toast } from "sonner";

import { getClientOrders, Order } from "@/features/vendors/services/orders.service";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Product } from "@/types/product.types";

type SettingsTab = 'profile' | 'store' | 'favorites' | 'notifications' | 'security' | 'preferences' | 'orders';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const getInitials = (name: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

function SettingsPageContent() {
  const { user } = useAuth();
  const { theme, setTheme, language, setLanguage } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') as SettingsTab) || 'profile';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clientOrders, setClientOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // État des préférences de notifications
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isSavingPref, setIsSavingPref] = useState(false);

  // Favoris / Wishlist states
  const { wishlist, toggleFavorite } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleClearAllFavorites = () => {
    if (confirm("Voulez-vous vraiment vider votre liste de favoris ?")) {
      [...wishlist].forEach(p => toggleFavorite(p));
      toast.success("Tous vos favoris ont été supprimés.");
    }
  };

  React.useEffect(() => {
    if (activeTab === 'orders') {
      setIsLoadingOrders(true);
      getClientOrders().then(res => {
        if (res.success) setClientOrders(res.data || []);
        setIsLoadingOrders(false);
      });
    }
    if (activeTab === 'notifications') {
      getNotificationPreferences().then(setPreferences);
    }
  }, [activeTab]);

  const handleSavePreferences = async () => {
    if (!preferences) return;
    setIsSavingPref(true);
    try {
      await saveNotificationPreferences(preferences);
      toast.success('Préférences de notifications sauvegardées !');
    } catch {
      toast.error('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSavingPref(false);
    }
  };

  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useAppNotifications();

  // Clic intelligent : marque comme lu + redirige vers l'URL contextuelle
  const handleNotificationClick = (n: any) => {
    if (!n.isRead) markAsRead(n.id);
    const url = resolveNotificationUrl(n, user?.role);
    if (url) router.push(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#080b14]">
      {/* Modale d'édition */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <main className="flex-grow p-4 md:p-8 lg:p-10 pb-20">
        <div className="container mx-auto max-w-5xl">
          <div className="w-full">
            <div className="space-y-6">

              {/* --- DYNAMIC SECTION --- */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {activeTab === 'notifications' && (
                    <div className="space-y-8">
                      {/* --- SECTION 1: PRÉFÉRENCES (DESIGN UNTITLED UI) --- */}
                      <section className="bg-white dark:bg-[#111827] rounded-none sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 border-y sm:border border-gray-100 dark:border-white/5 sm:shadow-2xl sm:shadow-gray-200/10">
                        <div className="mb-10">
                          <h3 className="text-xl font-black text-deep-blue dark:text-white tracking-tight">Paramètres des notifications</h3>
                          <p className="text-sm font-medium text-gray-500 mt-1">Choisissez comment vous souhaitez être informé de l'activité sur la plateforme.</p>
                        </div>

                        <div className="space-y-10">
                          {[
                            {
                              id: 'orders',
                              title: 'Commandes & Ventes',
                              desc: 'Alertes sur le statut de vos commandes, confirmations de paiement et livraisons.',
                              channels: [
                                { label: 'Push',   key: 'ordersPush' as keyof NotificationPreferences },
                                { label: 'Email',  key: 'ordersEmail' as keyof NotificationPreferences },
                                { label: 'In-App', key: 'ordersInApp' as keyof NotificationPreferences },
                              ]
                            },
                            {
                              id: 'follows',
                              title: 'Vendeurs Favoris',
                              desc: 'Soyez le premier informé quand vos vendeurs préférés publient un nouveau produit.',
                              channels: [
                                { label: 'Push',   key: 'followsPush' as keyof NotificationPreferences },
                                { label: 'Email',  key: 'followsEmail' as keyof NotificationPreferences },
                                { label: 'In-App', key: 'followsInApp' as keyof NotificationPreferences },
                              ]
                            },
                            {
                              id: 'promos',
                              title: 'Offres & Promotions',
                              desc: 'Recevez des alertes sur les baisses de prix et les meilleures opportunités du moment.',
                              channels: [
                                { label: 'Push',  key: 'promosPush' as keyof NotificationPreferences },
                                { label: 'Email', key: 'promosEmail' as keyof NotificationPreferences },
                              ]
                            },
                            {
                              id: 'security',
                              title: 'Sécurité & Compte',
                              desc: 'Alertes de connexion, vérification KYC et modifications importantes de profil.',
                              forced: true,
                              channels: [
                                { label: 'Email',  key: 'securityEmail' as keyof NotificationPreferences },
                                { label: 'In-App', key: 'securityInApp' as keyof NotificationPreferences },
                              ],
                            }
                          ].map((cat) => (
                            <div key={cat.id} className="group flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-10 border-b border-gray-50 dark:border-white/5 last:border-0 last:pb-0">
                              <div className="max-w-md">
                                <h4 className="text-base font-black text-deep-blue dark:text-white mb-1.5">{cat.title}</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{cat.desc}</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                                {cat.channels.map((channel) => (
                                  <div key={channel.label} className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={preferences ? Boolean(preferences[channel.key]) : true}
                                        disabled={cat.forced}
                                        onChange={(e) =>
                                          setPreferences(prev =>
                                            prev ? { ...prev, [channel.key]: e.target.checked } : prev
                                          )
                                        }
                                      />
                                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E67E22] peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                                      <span className="ml-3 text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{channel.label}</span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-12 flex justify-end">
                          <button
                            onClick={handleSavePreferences}
                            disabled={isSavingPref || !preferences}
                            className="px-8 py-4 bg-deep-blue dark:bg-white text-white dark:text-deep-blue rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {isSavingPref ? 'Enregistrement...' : 'Enregistrer les réglages'}
                          </button>
                        </div>
                      </section>

                      {/* --- SECTION 2: ACTIVITÉ RÉCENTE --- */}
                      <section className="bg-white dark:bg-[#111827] rounded-none sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border-y sm:border border-gray-100 dark:border-white/5 sm:shadow-2xl sm:shadow-gray-200/20">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-10">
                          <div className="space-y-1">
                            <h3 className="text-xl font-black text-deep-blue dark:text-white tracking-tight">Activités récentes</h3>
                            <p className="text-xs font-semibold text-gray-400 italic">Historique de vos alertes reçues</p>
                          </div>
                          {notifications.some(n => !n.isRead) && (
                            <button
                              onClick={() => markAllAsRead()}
                              className="group flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-gray-600 dark:text-gray-300 hover:text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              <CheckCircle2 size={14} />
                              Tout marquer comme lu
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4">
                              <div className="size-10 border-4 border-gray-100 dark:border-white/5 border-t-orange-500 rounded-full animate-spin"></div>
                            </div>
                          ) : notifications.length === 0 ? (
                            <div className="py-20 text-center">
                              <Bell size={40} className="mx-auto text-gray-200 mb-4" />
                              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aucune notification</p>
                            </div>
                          ) : (
                            <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
                                {notifications.map((n) => (
                                  <motion.div
                                    variants={fadeUp}
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${n.isRead ? 'bg-white dark:bg-white/0 border-gray-100 dark:border-white/5' : 'bg-orange-50/30 dark:bg-orange-500/5 border-orange-100/50 dark:border-orange-500/20 shadow-sm'}`}
                                  >
                                    <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-gray-50 text-gray-400 dark:bg-white/5' : 'bg-orange-100 text-orange-600'}`}>
                                      <Bell size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className={`text-sm font-black truncate ${n.isRead ? 'text-gray-900 dark:text-white' : 'text-orange-950 dark:text-orange-100'}`}>{n.title}</h4>
                                      <p className="text-[12px] text-gray-500 dark:text-gray-400 line-clamp-1">{n.message}</p>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-300 shrink-0">
                                      {new Date(n.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            </div>
                          )}
                        </div>
                      </section>
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <motion.div variants={fadeUp} className="bg-white dark:bg-[#111827] rounded-none sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border-y sm:border border-gray-100 dark:border-white/5 sm:shadow-2xl sm:shadow-gray-200/20 min-h-[80vh] sm:min-h-0">
                      <div className="mb-10">
                        <h3 className="text-xl md:text-xl font-black text-deep-blue dark:text-white tracking-tight leading-none">Mes Commandes</h3>
                        <p className="text-xs md:text-xs font-semibold text-gray-400 mt-2">Suivez vos achats et contactez les vendeurs</p>
                      </div>

                      {isLoadingOrders ? (
                        <div className="flex justify-center py-20">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
                        </div>
                      ) : clientOrders.length === 0 ? (
                        <div className="text-center py-20">
                          <Package className="size-16 text-gray-200 mx-auto mb-4" />
                          <p className="text-lg font-black text-deep-blue dark:text-white">Aucune commande pour le moment</p>
                          <Link href="/products" className="text-[#E67E22] font-bold text-sm hover:underline mt-4 block uppercase tracking-widest">
                            Découvrir les produits
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {clientOrders.map((order) => (
                            <div key={order.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-orange-200 dark:hover:border-orange-500/20 transition-all bg-gray-50/30 dark:bg-white/5">
                              <div className="size-20 rounded-2xl overflow-hidden bg-white shrink-0">
                                <Image src={order.product?.image || ""} alt={order.product?.name || ""} width={80} height={80} className="object-cover h-full w-full" />
                              </div>
                              <div className="flex-1 text-center sm:text-left">
                                <h4 className="font-black text-deep-blue dark:text-white text-lg leading-tight mb-1">{order.product?.name}</h4>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
                                  <span className="px-3 py-1 bg-white dark:bg-white/10 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100 dark:border-white/5">
                                    ID: {order.id.substring(0, 8)}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xl font-black text-[#E67E22]">{order.totalPrice.toLocaleString()} $</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                  {activeTab === 'profile' && (
                    <div className="space-y-8">
                      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
                        
                        {/* Cover Picture Banner */}
                        <div className="h-36 sm:h-48 w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                          {user?.coverUrl ? (
                            <img
                              src={user.coverUrl}
                              alt="Image de couverture"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2000&auto=format&fit=crop"
                              alt="Image de couverture par défaut"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25"></div>
                          
                          {/* Change cover button */}
                          <button 
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            className="absolute top-4 right-4 px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 z-10"
                          >
                            <Camera size={12} /> Modifier la couverture
                          </button>
                        </div>

                        {/* Floating Avatar & Details Overlay */}
                        <div className="px-6 sm:px-8 relative -mt-12 sm:-mt-16 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
                          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                            
                            {/* Avatar circle */}
                            <div className="relative group shrink-0 z-10">
                              <div className="size-24 sm:size-28 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white dark:border-[#111827] shadow-lg relative">
                                {user?.avatarUrl ? (
                                  <img src={user.avatarUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-3xl font-black tracking-tight">{getInitials(user?.fullName || '')}</span>
                                )}
                              </div>
                              <button 
                                type="button"
                                onClick={() => setIsEditModalOpen(true)}
                                className="absolute bottom-0 right-0 p-2 bg-[#E67E22] text-white rounded-full border-2 border-white dark:border-[#111827] shadow-md hover:scale-105 transition-transform active:scale-95 z-20"
                              >
                                <Camera size={11} />
                              </button>
                            </div>

                            {/* User name & role next to avatar */}
                            <div className="sm:pb-1">
                              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                                {user?.fullName || 'Utilisateur'}
                                <span className="text-[#2D5A27] dark:text-[#52c140] bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                                  Actif
                                </span>
                              </h3>
                              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1 uppercase tracking-wider">
                                {user?.role === 'VENDOR' ? 'Vendeur Certifié' : 'Client Vérifié'}
                              </p>
                            </div>
                          </div>

                          {/* Desktop modifier profile button */}
                          <div className="sm:pb-1 z-10">
                            <button 
                              type="button"
                              onClick={() => setIsEditModalOpen(true)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-[#E67E22] hover:bg-[#cf6d18] text-white rounded-xl text-xs font-semibold transition-all shadow-sm shadow-orange-500/10 active:scale-95 shrink-0"
                            >
                              <Edit3 size={14} /> Modifier le Profil
                            </button>
                          </div>
                        </div>

                        {/* Fields & Detailed Grid Section */}
                        <div className="px-6 sm:px-8 pb-8 space-y-6">
                          
                          <div className="pt-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Information</h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Mettez à jour les détails de votre profil d'utilisateur ici.</p>
                          </div>

                          {/* Fields Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* First Name */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Prénom</label>
                              <input 
                                type="text" 
                                readOnly
                                value={user?.fullName?.split(' ')[0] || ''}
                                className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-not-allowed"
                              />
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Nom de famille</label>
                              <input 
                                type="text" 
                                readOnly
                                value={user?.fullName?.split(' ').slice(1).join(' ') || ''}
                                className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-not-allowed"
                              />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Adresse e-mail</label>
                              <div className="relative">
                                <input 
                                  type="email" 
                                  readOnly
                                  value={user?.email || ''}
                                  className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl pl-4 pr-24 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-not-allowed"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-lg">
                                  <CheckCircle2 size={10} /> Vérifié
                                </span>
                              </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Numéro de téléphone</label>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  readOnly
                                  value={user?.phone || 'Non renseigné'}
                                  className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl pl-4 pr-24 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-not-allowed"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-lg">
                                  <CheckCircle2 size={10} /> Actif
                                </span>
                              </div>
                            </div>

                            {/* Province */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Province</label>
                              <input 
                                type="text" 
                                readOnly
                                value={user?.province || 'Non définie'}
                                className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-not-allowed"
                              />
                            </div>

                            {/* Commune */}
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ville / Commune</label>
                              <input 
                                type="text" 
                                readOnly
                                value={user?.commune || 'Non définie'}
                                className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-not-allowed"
                              />
                            </div>

                            {/* Boutique Name */}
                            {user?.role === 'VENDOR' && (
                              <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Nom de la Boutique</label>
                                <input 
                                  type="text" 
                                  readOnly
                                  value={user?.boutiqueName || 'Aucune boutique associée'}
                                  className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-not-allowed"
                                />
                              </div>
                            )}

                            {/* Membre depuis */}
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Membre depuis</label>
                              <input 
                                type="text" 
                                readOnly
                                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Récemment'}
                                className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-not-allowed"
                              />
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-8">
                      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-white/5 shadow-sm space-y-8 animate-fade-in">
                        
                        {/* Section Header */}
                        <div className="pb-6 border-b border-slate-100 dark:border-white/5">
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sécurité du Compte</h2>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Gérez votre mot de passe, votre PIN de transaction et surveillez vos connexions actives.</p>
                        </div>

                        {/* Password Change Card */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-[#E67E22] shrink-0">
                              <Lock size={18} />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Changer le mot de passe</h3>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Pour assurer la sécurité de votre compte, choisissez un mot de passe robuste.</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mot de passe actuel</label>
                              <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-850 dark:text-slate-200 outline-none focus:border-[#E67E22] transition-colors"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Nouveau mot de passe</label>
                              <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-855 dark:text-slate-200 outline-none focus:border-[#E67E22] transition-colors"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Confirmer le mot de passe</label>
                              <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-860 dark:text-slate-200 outline-none focus:border-[#E67E22] transition-colors"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-2 border-b border-slate-100 dark:border-white/5 pb-6">
                            <button 
                              type="button"
                              onClick={() => setIsEditModalOpen(true)}
                              className="px-5 py-2.5 bg-[#E67E22] hover:bg-[#cf6d18] text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                              Mettre à jour le mot de passe
                            </button>
                          </div>
                        </div>

                        {/* Transaction PIN Card */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 shrink-0">
                              <ShieldCheck size={18} />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Code PIN de Transaction</h3>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Requis pour valider vos retraits, virements et achats sur la plateforme.</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Nouveau code PIN (4 chiffres)</label>
                              <input 
                                type="text" 
                                maxLength={4}
                                placeholder="Ex: 1234"
                                className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-850 dark:text-slate-200 outline-none focus:border-emerald-500 transition-colors"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Confirmer le PIN</label>
                              <input 
                                type="text" 
                                maxLength={4}
                                placeholder="Ex: 1234"
                                className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-855 dark:text-slate-200 outline-none focus:border-emerald-500 transition-colors"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-2 border-b border-slate-100 dark:border-white/5 pb-6">
                            <button 
                              type="button"
                              onClick={() => setIsEditModalOpen(true)}
                              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                              Sauvegarder le code PIN
                            </button>
                          </div>
                        </div>

                        {/* Active Sessions */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 shrink-0">
                              <Smartphone size={18} />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sessions Actives & Connexions</h3>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Liste des appareils actuellement connectés à votre compte.</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {[
                              { device: "Chrome / Windows 11", location: "Kinshasa, RDC", time: "Session active", active: true },
                              { device: "Safari / iPhone 15 Pro", location: "Goma, RDC", time: "il y a 2 heures", active: false }
                            ].map((session, i) => (
                              <div key={i} className="flex justify-between items-center p-4 bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl">
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{session.device}</p>
                                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{session.location} • {session.time}</p>
                                </div>
                                {session.active ? (
                                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Actif</span>
                                ) : (
                                  <button 
                                    type="button"
                                    onClick={() => toast.success('Session déconnectée avec succès !')}
                                    className="text-[9px] font-bold text-red-500 hover:text-red-750 uppercase tracking-wider cursor-pointer"
                                  >
                                    Déconnexion
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {activeTab === 'preferences' && (
                    <div className="space-y-8">
                      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-white/5 shadow-sm space-y-8 animate-fade-in">
                        
                        {/* Section Header */}
                        <div className="pb-6 border-b border-slate-100 dark:border-white/5">
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Préférences de l'Application</h2>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Personnalisez votre expérience d'achat et de vente sur WapiBei.</p>
                        </div>

                        {/* Theme Section */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Thème d'affichage</h3>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">Choisissez le style visuel de l'interface.</p>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: 'Clair', value: 'light' as Theme },
                              { label: 'Sombre', value: 'dark' as Theme },
                              { label: 'Système', value: 'system' as Theme },
                            ].map((themeOption) => (
                              <button 
                                key={themeOption.value}
                                type="button"
                                onClick={() => {
                                  setTheme(themeOption.value);
                                  toast.success(`Thème ${themeOption.label} appliqué !`);
                                }}
                                className={`py-3.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                                  theme === themeOption.value
                                    ? "bg-[#080B1A] text-white border-transparent shadow-sm dark:bg-white dark:text-slate-950"
                                    : "bg-[#F9FAFB] dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                {themeOption.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Language Section */}
                        <div className="space-y-4 border-t border-slate-100 dark:border-white/5 pt-6">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Langue de l'interface</h3>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">Configurez la langue dans laquelle s'affichent les textes.</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                              { label: 'Français', desc: 'Langue principale', value: 'fr' as Language },
                              { label: 'English', desc: 'International language', value: 'en' as Language },
                            ].map((lang) => (
                              <button 
                                key={lang.label}
                                type="button"
                                onClick={() => {
                                  setLanguage(lang.value);
                                  toast.success(`Langue configurée sur ${lang.label}`);
                                }}
                                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                                  language === lang.value
                                    ? "bg-white dark:bg-[#111827] border-[#E67E22] shadow-sm relative ring-2 ring-orange-500/10"
                                    : "bg-[#F9FAFB] dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{lang.label}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{lang.desc}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Currency Section */}
                        <div className="space-y-4 border-t border-slate-100 dark:border-white/5 pt-6">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Devise de facturation</h3>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">Choisissez la monnaie dans laquelle s'affichent les prix.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              { label: 'USD ($)', desc: 'Dollar Américain (Taux actuel)' },
                              { label: 'CDF (FC)', desc: 'Franc Congolais (Taux réel)' }
                            ].map((currency, idx) => (
                              <button 
                                key={currency.label}
                                type="button"
                                onClick={() => toast.success(`Devise de facturation : ${currency.label}`)}
                                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                                  idx === 0
                                    ? "bg-white dark:bg-[#111827] border-[#E67E22] shadow-sm relative ring-2 ring-orange-500/10"
                                    : "bg-[#F9FAFB] dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{currency.label}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{currency.desc}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-white/5">
                          <button 
                            type="button"
                            onClick={() => toast.success('Vos préférences ont été enregistrées !')}
                            className="px-6 py-3 bg-[#E67E22] hover:bg-[#cf6d18] text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                          >
                            Enregistrer les préférences
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {activeTab === 'favorites' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
                          <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mes Favoris</h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">Gérez vos articles coup de cœur enregistrés pour plus tard.</p>
                          </div>
                          {wishlist.length > 0 && (
                            <button
                              type="button"
                              onClick={handleClearAllFavorites}
                              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                            >
                              <Trash2 size={13} /> Vider les favoris
                            </button>
                          )}
                        </div>

                        {/* Favorites Grid */}
                        {wishlist.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            {wishlist.map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                onQuickView={(p) => {
                                  setSelectedProduct(p);
                                  setIsQuickViewOpen(true);
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          /* Empty State */
                          <div className="p-12 sm:p-16 flex flex-col items-center justify-center text-center">
                            <div className="size-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                              <Heart size={36} fill="currentColor" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                              Votre liste de favoris est vide
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold max-w-sm mx-auto mb-8">
                              Parcourez nos catégories et cliquez sur l'icône cœur pour sauvegarder les articles qui vous plaisent le plus.
                            </p>
                            <Link
                              href="/"
                              className="bg-[#E67E22] text-white px-8 py-3.5 rounded-xl font-bold text-xs hover:bg-[#cf6d18] transition-all shadow-md shadow-[#E67E22]/15 hover:scale-[1.02] active:scale-95 cursor-pointer"
                            >
                              Découvrir des produits
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab !== 'notifications' && activeTab !== 'profile' && activeTab !== 'orders' && activeTab !== 'security' && activeTab !== 'preferences' && activeTab !== 'favorites' && (
                    <section className="bg-white dark:bg-[#111827] rounded-none sm:rounded-[2.5rem] p-12 sm:p-24 text-center border-y sm:border border-gray-100 sm:border-white dark:border-white/5 shadow-xl flex flex-col items-center justify-center space-y-10 min-h-[50vh] sm:min-h-0">
                      <div className="size-24 sm:size-32 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] sm:rounded-[3rem] flex items-center justify-center text-gray-200">
                        <ShoppingBag size={48} className="size-10 sm:size-12" />
                      </div>
                      <div className="space-y-3 px-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-deep-blue dark:text-white tracking-tight leading-none">Bientôt Disponible</h3>
                        <p className="text-sm sm:text-base font-bold text-gray-500 max-w-sm mx-auto">
                          La section <span className="text-[#E67E22] px-2.5 py-0.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-lg">{activeTab.toUpperCase()}</span> est en cours d'optimisation.
                        </p>
                      </div>
                      <Link href="/">
                        <button className="px-8 sm:px-10 py-4 sm:py-5 bg-deep-blue hover:bg-black text-white rounded-[1.25rem] sm:rounded-[1.5rem] font-black text-[11px] sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-blue-500/10 active:scale-95">
                          Retour à la boutique
                        </button>
                      </Link>
                    </section>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER MINIMAL INLINE --- */}
      <footer className="bg-white dark:bg-[#0b1221] py-10 border-t border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">© 2026 WapiBei</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-[10px] font-black uppercase text-gray-300 hover:text-blue-600 transition-all tracking-widest">Terms</Link>
            <Link href="#" className="text-[10px] font-black uppercase text-gray-300 hover:text-blue-600 transition-all tracking-widest">Privacy</Link>
            <Link href="#" className="text-[10px] font-black uppercase text-gray-300 hover:text-blue-600 transition-all tracking-widest">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageContent />
    </Suspense>
  );
}
