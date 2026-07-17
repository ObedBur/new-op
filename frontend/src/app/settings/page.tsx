"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Store,
  Heart,
  Bell,
  ShieldCheck,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BadgeCheck,
  TrendingDown,
  TrendingUp,
  Package,
  Plus,
  Hammer,
  Smartphone,
  Sprout,
  Search,
  Lock,
  ShoppingBag,
  CheckCircle2,
  Clock,
  MoreVertical,
  SlidersHorizontal,
  Edit3,
  Camera,
  Trash2,
  Globe,
  LogOut
} from "lucide-react";
import EditProfileModal from "../modal/EditProfileModal";
import { DeleteConfirmationModal } from "@/app/dashboard/products/components/DeleteConfirmationModal";

import { useAuth } from "@/context/AuthContext";
import { Language, Theme, Currency, useSettings } from "@/context/SettingsContext";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppNotifications } from "@/hooks/useAppNotifications";
import { getNotificationPreferences, saveNotificationPreferences, NotificationPreferences } from "@/features/notifications/services/preferences.service";
import { resolveNotificationUrl } from "@/types/notification";
import { toast } from "sonner";

import { getClientOrders, Order } from "@/features/vendors/services/orders.service";
import { useCurrency } from "@/hooks/useCurrency";
import { AddressBookSection } from "@/features/addresses/components/AddressBookSection";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Product } from "@/types/product.types";
import { ListSkeleton, TableSkeleton } from "@/components/ui/SkeletonLoaders";

type SettingsTab = 'profile' | 'store' | 'favorites' | 'notifications' | 'security' | 'preferences' | 'orders' | 'addresses';

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
  if (!name) return 'SP';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}

function SettingsPageContent() {
  const { user, logout } = useAuth();
  const { theme, setTheme, language, setLanguage, currency, setCurrency } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();
  const activeTab = (searchParams.get('tab') as SettingsTab) || null;
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
  const [isClearFavoritesModalOpen, setIsClearFavoritesModalOpen] = useState(false);
  const [isClearingFavorites, setIsClearingFavorites] = useState(false);

  const handleClearAllFavorites = async () => {
    setIsClearingFavorites(true);
    try {
      [...wishlist].forEach(p => toggleFavorite(p));
      toast.success("Tous vos favoris ont été supprimés.");
    } finally {
      setIsClearingFavorites(false);
      setIsClearFavoritesModalOpen(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie !");
      router.push("/");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  // Define menu items
  const menuItems = [
    { label: "Contact information", href: "/settings?tab=profile" },
    { label: "Abonnements", href: "#" },
    { label: "Historique des commandes", href: "/settings?tab=orders" },
    { label: "Méthode de paiement", href: "#" },
    { label: "Centre d'aide", href: "#" },
    { label: "Confidentialité", href: "#" },
    { label: "Signaler un bug", href: "#" },
  ];

  // If there is an active tab, render that tab's content
  // This unified view works on both mobile (full screen) and desktop (content area beside VendorSidebar)
  if (activeTab) {
    return (
      <div className="min-h-screen bg-[#F6F1E0] lg:bg-transparent">
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl lg:max-w-none lg:shadow-none lg:mx-0 lg:px-2">
          {/* Modale d'édition */}
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />
          {/* Header — back button only on mobile (desktop has VendorSidebar for nav) */}
          <header className="px-6 pt-12 pb-6 lg:pt-8 lg:pb-4">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors mr-4"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-black">
                {activeTab === 'profile' ? 'Profile' :
                  activeTab === 'store' ? 'Boutique' :
                    activeTab === 'favorites' ? 'Favoris' :
                      activeTab === 'notifications' ? 'Notifications' :
                        activeTab === 'security' ? 'Sécurité' :
                          activeTab === 'preferences' ? 'Préférences' :
                            activeTab === 'orders' ? 'Commandes' :
                              activeTab === 'addresses' ? 'Adresses' : 'Paramètres'}
              </h1>
            </div>
          </header>
          <main className="flex-grow px-6 pb-20">
            <div className="w-full">
              <div className="space-y-6">
                <DeleteConfirmationModal
                  isOpen={isClearFavoritesModalOpen}
                  onClose={() => setIsClearFavoritesModalOpen(false)}
                  onConfirm={handleClearAllFavorites}
                  itemName="tous vos favoris"
                  isDeleting={isClearingFavorites}
                />


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
                        <section className="bg-white p-4 space-y-6">
                          <div className="mb-6">
                            <h3 className="text-xl font-black text-black tracking-tight">Paramètres des notifications</h3>
                            <p className="text-sm font-medium text-gray-500 mt-1">Choisissez comment vous souhaitez être informé de l'activité sur la plateforme.</p>
                          </div>

                          <div className="space-y-6">
                            {[
                              {
                                id: 'orders',
                                title: 'Commandes & Ventes',
                                desc: 'Alertes sur le statut de vos commandes, confirmations de paiement et livraisons.',
                                channels: [
                                  { label: 'Push', key: 'ordersPush' as keyof NotificationPreferences },
                                  { label: 'Email', key: 'ordersEmail' as keyof NotificationPreferences },
                                  { label: 'In-App', key: 'ordersInApp' as keyof NotificationPreferences },
                                  { label: 'SMS', key: 'ordersSms' as keyof NotificationPreferences },
                                ]
                              },
                              {
                                id: 'follows',
                                title: 'Vendeurs Favoris',
                                desc: 'Soyez le premier informé quand vos vendeurs préférés publient un nouveau produit.',
                                channels: [
                                  { label: 'Push', key: 'followsPush' as keyof NotificationPreferences },
                                  { label: 'Email', key: 'followsEmail' as keyof NotificationPreferences },
                                  { label: 'In-App', key: 'followsInApp' as keyof NotificationPreferences },
                                  { label: 'SMS', key: 'followsSms' as keyof NotificationPreferences },
                                ]
                              },
                              {
                                id: 'promos',
                                title: 'Offres & Promotions',
                                desc: 'Recevez des alertes sur les baisses de prix et les meilleures opportunités du moment.',
                                channels: [
                                  { label: 'Push', key: 'promosPush' as keyof NotificationPreferences },
                                  { label: 'Email', key: 'promosEmail' as keyof NotificationPreferences },
                                  { label: 'SMS', key: 'promosSms' as keyof NotificationPreferences },
                                ]
                              },
                              {
                                id: 'security',
                                title: 'Sécurité & Compte',
                                desc: 'Alertes de connexion, vérification KYC et modifications importantes de profil.',
                                forced: true,
                                channels: [
                                  { label: 'Email', key: 'securityEmail' as keyof NotificationPreferences },
                                  { label: 'In-App', key: 'securityInApp' as keyof NotificationPreferences },
                                ],
                              }
                            ].map((cat) => (
                              <div key={cat.id} className="group flex flex-col gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className="max-w-md">
                                  <h4 className="text-base font-black text-black mb-1.5">{cat.title}</h4>
                                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{cat.desc}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
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

                          <div className="mt-8 flex justify-end">
                            <button
                              onClick={handleSavePreferences}
                              disabled={isSavingPref || !preferences}
                              className="px-8 py-4 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSavingPref ? 'Enregistrement...' : 'Enregistrer les réglages'}
                            </button>
                          </div>
                        </section>

                        {/* --- SECTION 2: ACTIVITÉ RÉCENTE --- */}
                        <section className="bg-white p-4 space-y-6">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div className="space-y-1">
                              <h3 className="text-xl font-black text-black tracking-tight">Activités récentes</h3>
                              <p className="text-xs font-semibold text-gray-400 italic">Historique de vos alertes reçues</p>
                            </div>
                            {notifications.some(n => !n.isRead) && (
                              <button
                                onClick={() => markAllAsRead()}
                                className="group flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                              >
                                <CheckCircle2 size={14} />
                                Tout marquer comme lu
                              </button>
                            )}
                          </div>

                          <div className="space-y-4">
                            {isLoading ? (
                              <ListSkeleton count={3} />
                            ) : notifications.length === 0 ? (
                              <div className="py-12 text-center">
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
                                      className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${n.isRead ? 'bg-white border-gray-100' : 'bg-orange-50/30 border-orange-100/50 shadow-sm'}`}
                                    >
                                      <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-gray-50 text-gray-400' : 'bg-orange-100 text-orange-600'}`}>
                                        <Bell size={18} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-black truncate ${n.isRead ? 'text-gray-900' : 'text-orange-950'}`}>{n.title}</h4>
                                        <p className="text-[12px] text-gray-500 line-clamp-1">{n.message}</p>
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

                    {activeTab === 'preferences' && (
                      <div className="space-y-8">
                        <div className="bg-white p-6 border border-slate-100 shadow-sm space-y-8">
                          <div className="pb-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-black">Préférences de l'Application</h2>
                            <p className="text-xs text-gray-500 font-semibold mt-1">Personnalisez votre expérience d'achat et de vente sur WapiBei.</p>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-sm font-bold text-black">Thème d'affichage</h3>
                            <p className="text-[11px] text-gray-500 font-semibold">Choisissez le style visuel de l'interface.</p>
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
                                  className={`py-3.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${theme === themeOption.value
                                    ? "bg-black text-white border-transparent shadow-sm"
                                    : "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                  {themeOption.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 border-t border-slate-100 pt-6">
                            <h3 className="text-sm font-bold text-black">Langue de l'interface</h3>
                            <p className="text-[11px] text-gray-500 font-semibold">Configurez la langue dans laquelle s'affichent les textes.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                  className={`p-4 rounded-full text-left transition-all border cursor-pointer ${language === lang.value
                                    ? "bg-white border-[#E67E22] shadow-sm relative ring-2 ring-orange-500/10"
                                    : "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                  <p className="text-xs font-bold text-black">{lang.label}</p>
                                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{lang.desc}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 border-t border-slate-100 pt-6">
                            <h3 className="text-sm font-bold text-black">Devise de facturation</h3>
                            <p className="text-[11px] text-gray-500 font-semibold">Choisissez la monnaie dans laquelle s'affichent les prix.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[
                                { label: 'USD ($)', value: 'USD' as Currency, desc: 'Dollar Américain (Taux actuel)' },
                                { label: 'CDF (FC)', value: 'CDF' as Currency, desc: 'Franc Congolais (Taux réel)' }
                              ].map((curr) => (
                                <button
                                  key={curr.label}
                                  type="button"
                                  onClick={() => {
                                    setCurrency(curr.value);
                                    toast.success(`Devise de facturation : ${curr.label}`);
                                  }}
                                  className={`p-4 rounded-full text-left transition-all border cursor-pointer ${currency === curr.value
                                    ? "bg-white border-[#E67E22] shadow-sm relative ring-2 ring-orange-500/10"
                                    : "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                  <p className="text-xs font-bold text-black">{curr.label}</p>
                                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{curr.desc}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'profile' && (
                      <div className="space-y-8">
                        <div className="bg-white overflow-hidden">
                          <div className="px-6 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-6 border-b border-gray-100 pt-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                              <div className="relative group shrink-0">
                                <div className="w-24 sm:w-28 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg relative">
                                  {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-3xl font-black tracking-tight">{getInitials(user?.fullName || '')}</span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsEditModalOpen(true)}
                                  className="absolute bottom-0 right-0 p-2 bg-[#E67E22] text-white rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform active:scale-95 z-20"
                                >
                                  <Edit3 size={11} />
                                </button>
                              </div>

                              <div className="sm:pb-1">
                                <h2 className="text-lg sm:text-xl font-bold text-black flex items-center justify-center sm:justify-start gap-2">
                                  {user?.fullName || 'Utilisateur'}
                                  {user?.isVerified && (
                                    <span className="text-[#2D5A27] bg-green-50 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                                      Actif
                                    </span>
                                  )}
                                </h2>
                                <p className="text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wider">
                                  {user?.role === 'VENDOR' ? 'Vendeur Certifié' : 'Client Vérifié'}
                                </p>
                              </div>
                            </div>

                            <div className="sm:pb-1 z-10">
                              <button
                                type="button"
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#E67E22] hover:bg-[#cf6d18] text-white rounded-full text-xs font-semibold transition-all shadow-sm shadow-orange-500/10 active:scale-95 shrink-0"
                              >
                                <Edit3 size={14} />
                                Modifier le Profil
                              </button>
                            </div>
                          </div>

                          <div className="px-6 pb-8 space-y-6 pt-6">
                            <div>
                              <h2 className="text-lg font-bold text-black">Account Information</h2>
                              <p className="text-xs text-gray-500 font-semibold mt-1">Mettez à jour les détails de votre profil d'utilisateur ici.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Prénom</label>
                                <input
                                  type="text"
                                  readOnly
                                  value={user?.fullName?.split(' ')[0] || ''}
                                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Nom de famille</label>
                                <input
                                  type="text"
                                  readOnly
                                  value={user?.fullName?.split(' ').slice(1).join(' ') || ''}
                                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Adresse e-mail</label>
                                <div className="relative">
                                  <input
                                    type="email"
                                    readOnly
                                    value={user?.email || ''}
                                    className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full pl-4 pr-24 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed"
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
                                    <CheckCircle2 size={10} />
                                    Vérifié
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Numéro de téléphone</label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    readOnly
                                    value={user?.phone || 'Non renseigné'}
                                    className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full pl-4 pr-24 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed"
                                  />
                                  {user?.phoneVerified && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
                                      <CheckCircle2 size={10} />
                                      Actif
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Province</label>
                                <input
                                  type="text"
                                  readOnly
                                  value={user?.province || 'Non définie'}
                                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Ville / Commune</label>
                                <input
                                  type="text"
                                  readOnly
                                  value={user?.commune || 'Non définie'}
                                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed"
                                />
                              </div>

                              {user?.role === 'VENDOR' && (
                                <div className="space-y-2 md:col-span-2">
                                  <label className="text-xs font-semibold text-gray-500">Nom de la Boutique</label>
                                  <input
                                    type="text"
                                    readOnly
                                    value={user?.boutiqueName || 'Aucune boutique associée'}
                                    className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed"
                                  />
                                </div>
                              )}

                              <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold text-gray-500">Membre depuis</label>
                                <input
                                  type="text"
                                  readOnly
                                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Récemment'}
                                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'orders' && (
                      <motion.div variants={fadeUp} className="bg-white p-4 min-h-[80vh] sm:min-h-0">
                        <div className="mb-6">
                          <h3 className="text-xl md:text-xl font-black text-black tracking-tight leading-none">Mes Commandes</h3>
                          <p className="text-xs md:text-xs font-semibold text-gray-400 mt-2">Suivez vos achats et contactez les vendeurs</p>
                        </div>

                        {isLoadingOrders ? (
                          <TableSkeleton rows={5} cols={4} />
                        ) : clientOrders.length === 0 ? (
                          <div className="text-center py-12">
                            <Package className="size-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-lg font-black text-black">Aucune commande pour le moment</p>
                            <Link href="/products" className="text-[#E67E22] font-bold text-sm hover:underline mt-4 block uppercase tracking-widest">
                              Découvrir les produits
                            </Link>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {clientOrders.map((order) => (
                              <div key={order.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl border border-gray-100 hover:border-orange-200 transition-all bg-gray-50/30">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0">
                                  <Image src={order.product?.image || ""} alt={order.product?.name || ""} width={80} height={80} className="object-cover h-full w-full" />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                  <h4 className="font-black text-black text-lg leading-tight mb-1">{order.product?.name}</h4>
                                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
                                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100">
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
                                  <p className="text-xl font-black text-[#E67E22]">{formatPrice(order.totalPrice)}</p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'favorites' && (
                      <div className="space-y-8">
                        <div className="bg-white p-6 border border-slate-100 shadow-sm space-y-6">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-black">Mes Favoris</h2>
                            {wishlist.length > 0 && (
                              <button
                                onClick={() => setIsClearFavoritesModalOpen(true)}
                                className="text-xs font-semibold text-red-600 hover:text-red-700"
                              >
                                Vider la liste
                              </button>
                            )}
                          </div>

                          {wishlist.length === 0 ? (
                            <div className="text-center py-12">
                              <Heart className="size-16 text-gray-200 mx-auto mb-4" />
                              <p className="text-lg font-black text-black">Aucun favori pour le moment</p>
                              <Link href="/products" className="text-[#E67E22] font-bold text-sm hover:underline mt-4 block uppercase tracking-widest">
                                Découvrir les produits
                              </Link>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {wishlist.map((product) => (
                                <ProductCard
                                  key={product.id}
                                  product={product}
                                  onQuickView={() => {
                                    setSelectedProduct(product);
                                    setIsQuickViewOpen(true);
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'security' && (
                      <div className="space-y-8">
                        <div className="bg-white p-6 border border-slate-100 shadow-sm space-y-8 animate-fade-in">
                          <div className="pb-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-black">Sécurité du Compte</h2>
                            <p className="text-xs text-gray-500 font-semibold mt-1">Gérez votre mot de passe, votre PIN de transaction et surveillez vos connexions actives.</p>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-orange-50 rounded-full text-[#E67E22] shrink-0">
                                <Lock size={18} />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-black">Changer le mot de passe</h3>
                                <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Pour assurer la sécurité de votre compte, choisissez un mot de passe robuste.</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Mot de passe actuel</label>
                                <input
                                  type="password"
                                  placeholder="••••••••"
                                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-850 outline-none focus:border-[#E67E22] transition-colors"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Nouveau mot de passe</label>
                                <input
                                  type="password"
                                  placeholder="••••••••"
                                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-850 outline-none focus:border-[#E67E22] transition-colors"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Confirmer le mot de passe</label>
                                <input
                                  type="password"
                                  placeholder="••••••••"
                                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-860 outline-none focus:border-[#E67E22] transition-colors"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end pt-2 border-b border-slate-100 pb-6">
                              <button
                                type="button"
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-5 py-2.5 bg-[#E67E22] hover:bg-[#cf6d18] text-white rounded-full text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                              >
                                Mettre à jour le mot de passe
                              </button>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-emerald-50 rounded-full text-emerald-600 shrink-0">
                                <ShieldCheck size={18} />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-black">Code PIN de Transaction</h3>
                                <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Requis pour valider vos retraits, virements et achats sur la plateforme.</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Nouveau code PIN (4 chiffres)</label>
                                <input
                                  type="text"
                                  maxLength={4}
                                  placeholder="Ex: 1234"
                                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-850 outline-none focus:border-emerald-500 transition-colors"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">Confirmer le PIN</label>
                                <input
                                  type="text"
                                  maxLength={4}
                                  placeholder="Ex: 1234"
                                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-855 outline-none focus:border-emerald-500 transition-colors"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end pt-2 border-b border-slate-100 pb-6">
                              <button
                                type="button"
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white rounded-full text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                              >
                                Sauvegarder le code PIN
                              </button>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-blue-50 rounded-full text-blue-600 shrink-0">
                                <Smartphone size={18} />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-black">Vérification du Téléphone</h3>
                                <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Ajoutez une couche supplémentaire de sécurité à votre compte.</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">Statut: {user?.phoneVerified ? 'Vérifié' : 'Non vérifié'}</span>
                              </div>
                              <button className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-900 transition-colors">
                                Vérifier
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Otherwise, render the main menu (mobile/tablet only — desktop uses VendorSidebar navigation)
  return (
    <>
      {/* ===== MOBILE / TABLET : App Shell account ===== */}
      <div className="lg:hidden min-h-screen bg-[#F6F1E0]">
        {/* Container */}
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl">
          {/* Modale d'édition */}
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />

          {/* Header */}
          <div className="px-6 pt-12 pb-8">
            <h1 className="text-3xl font-bold text-black">Account</h1>
          </div>

          {/* User Info */}
          <div className="px-6 pb-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 overflow-hidden">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getInitials(user?.fullName || '')}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-black truncate">{user?.fullName || 'Utilisateur'}</h2>
              <p className="text-sm text-gray-500 truncate">{user?.email || 'email@example.com'}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="border-t border-gray-200">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-black">{item.label}</span>
                <ChevronRight size={20} className="text-gray-400" />
              </Link>
            ))}
          </div>

          {/* Log Out Button */}
          <div className="px-6 pt-10 pb-4">
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 pb-12 pt-4 text-center">
            <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
              App v4.32.0 b3564
              <Globe size={16} />
            </p>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP : Affiche le profil par défaut (VendorSidebar gère la nav) ===== */}
      <div className="hidden lg:block px-8 py-8">
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold text-black mb-6">Mon Profil</h1>
          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-6 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{getInitials(user?.fullName || '')}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-black">{user?.fullName || 'Utilisateur'}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${user?.role === 'VENDOR' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {user?.role === 'VENDOR' ? 'Vendeur' : 'Client'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="shrink-0 px-4 py-2 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              Modifier le profil
            </button>
          </div>
          {/* Quick links */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-[#E67E22]/40 hover:bg-orange-50/30 transition-all group"
              >
                <span className="font-medium text-black group-hover:text-[#E67E22] transition-colors">{item.label}</span>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-[#E67E22]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
