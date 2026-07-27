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
import { getNotificationPreferences, saveNotificationPreferences, NotificationPreferences } from "@/features/notifications/services/preferences.service";
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
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie !");
      router.push("/");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const menuItems =
    user?.role === "VENDOR"
      ? [
          { label: "Mon Profil", href: "/settings?tab=profile" },
          { label: "Mes Ventes", href: "/dashboard/orders" },
          { label: "Mes Produits", href: "/dashboard/products" },
          { label: "Analytiques", href: "/dashboard/analytics" },
          { label: "Notifications", href: "/settings?tab=notifications" },
          { label: "Sécurité", href: "/settings?tab=security" },
          { label: "Préférences", href: "/settings?tab=preferences" },
        ]
      : [
          { label: "Mon Profil", href: "/settings?tab=profile" },
          { label: "Mes Commandes", href: "/settings?tab=orders" },
          { label: "Mes Favoris", href: "/settings?tab=favorites" },
          { label: "Notifications", href: "/settings?tab=notifications" },
          { label: "Sécurité", href: "/settings?tab=security" },
          { label: "Carnet d'adresses", href: "/settings?tab=addresses" },
          { label: "Préférences", href: "/settings?tab=preferences" },
          { label: "Centre d'aide", href: "#" },
        ];

  // If there is an active tab, render that tab's content
  // This unified view works on both mobile (full screen) and desktop (content area beside VendorSidebar)
  if (activeTab) {
    const activeTabLabel =
      activeTab === 'profile' ? 'Mon Profil' :
      activeTab === 'store' ? 'Boutique' :
      activeTab === 'favorites' ? 'Mes Favoris' :
      activeTab === 'notifications' ? 'Notifications' :
      activeTab === 'security' ? 'Sécurité' :
      activeTab === 'preferences' ? 'Préférences' :
      activeTab === 'orders' ? 'Mes Commandes' :
      activeTab === 'addresses' ? "Carnet d'adresses" :
      'Paramètres';

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
                onClick={() => router.push('/settings')}
                className="lg:hidden flex items-center gap-1.5 -ml-2 pr-3 pl-2 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={24} />
                <span className="text-sm font-bold text-black">{activeTabLabel}</span>
              </button>
              <h1 className="hidden lg:block text-2xl font-bold text-black">{activeTabLabel}</h1>
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
                                title: user?.role === 'VENDOR' ? 'Ventes & Boutique' : 'Mes Commandes',
                                desc: user?.role === 'VENDOR'
                                  ? 'Alertes sur les nouvelles commandes reçues, statuts de paiement et demandes de retraits.'
                                  : 'Alertes sur le statut de vos commandes, confirmations de paiement et livraisons.',
                                channels: [
                                  { label: 'Push', key: 'ordersPush' as keyof NotificationPreferences },
                                  { label: 'Email', key: 'ordersEmail' as keyof NotificationPreferences },
                                  { label: 'In-App', key: 'ordersInApp' as keyof NotificationPreferences },
                                  { label: 'SMS', key: 'ordersSms' as keyof NotificationPreferences },
                                ]
                              },
                              ...(user?.role !== 'VENDOR' ? [
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
                                }
                              ] : []),
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
                      <motion.div variants={fadeUp} className="bg-white p-4 sm:p-6">
                        {user?.role === 'VENDOR' ? (
                          <div className="text-center py-12">
                            <h3 className="text-xl font-black text-black mb-4">Accès non autorisé</h3>
                            <p className="text-sm font-medium text-gray-500 mb-6">L'historique des achats est réservé aux comptes clients. Veuillez vous rendre sur votre Tableau de Bord Vendeur pour voir vos ventes.</p>
                            <Link href="/dashboard/orders" className="px-6 py-3 bg-[#E67E22] text-white rounded-xl font-bold hover:bg-[#cf6d18] transition-colors inline-block">Aller au Tableau de Bord</Link>
                          </div>
                        ) : (
                          <>
                            {/* Header + stats */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                              <div>
                                <h3 className="text-xl font-black text-black tracking-tight leading-none">Mes Commandes</h3>
                                <p className="text-xs font-semibold text-gray-400 mt-1">Suivez vos achats et contactez les vendeurs</p>
                              </div>
                              {clientOrders.length > 0 && (
                                <div className="flex items-center gap-3">
                                  <span className="px-3 py-1.5 bg-orange-50 text-[#E67E22] rounded-full text-xs font-black">
                                    {clientOrders.length} commande{clientOrders.length > 1 ? 's' : ''}
                                  </span>
                                  <span className="px-3 py-1.5 bg-green-50 text-[#2D5A27] rounded-full text-xs font-black">
                                    {clientOrders.filter(o => o.status === 'DELIVERED').length} livré{clientOrders.filter(o => o.status === 'DELIVERED').length > 1 ? 's' : ''}
                                  </span>
                                </div>
                              )}
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
                              <div className="divide-y divide-gray-100">
                                {clientOrders.map((order) => (
                                  <div
                                    key={order.id}
                                    className="flex items-center gap-3 sm:gap-5 py-4 first:pt-0 last:pb-0 hover:bg-orange-50/30 -mx-2 px-2 sm:-mx-4 sm:px-4 rounded-xl transition-colors"
                                  >
                                    {/* Image — toujours à gauche */}
                                    <div className="size-14 sm:size-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                      <Image
                                        src={order.product?.image || ""}
                                        alt={order.product?.name || ""}
                                        width={64}
                                        height={64}
                                        className="object-cover h-full w-full"
                                      />
                                    </div>

                                    {/* Info produit — au centre, flex-1 */}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-black text-gray-900 text-sm sm:text-base leading-tight truncate">
                                        {order.product?.name}
                                      </h4>
                                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                          ID: {order.id.substring(0, 8).toUpperCase()}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                                          order.status === 'DELIVERED'
                                            ? 'bg-green-50 text-[#2D5A27]'
                                            : order.status === 'CANCELLED'
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-orange-50 text-[#E67E22]'
                                        }`}>
                                          {order.status === 'DELIVERED' ? 'Livré'
                                            : order.status === 'CANCELLED' ? 'Annulé'
                                            : order.status === 'PENDING' ? 'En attente'
                                            : order.status}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Prix + date — toujours à droite */}
                                    <div className="text-right shrink-0">
                                      <p className="text-sm sm:text-base font-black text-[#E67E22]">
                                        {formatPrice(order.totalPrice)}
                                      </p>
                                      <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 mt-0.5">
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                          day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                            )}
                          </>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'favorites' && (
                      <div className="space-y-4">
                        <div className="bg-white p-4 sm:p-6 border border-slate-100 shadow-sm space-y-5">
                          {user?.role === 'VENDOR' ? (
                            <div className="text-center py-12">
                              <h3 className="text-xl font-black text-black mb-4">Accès non autorisé</h3>
                              <p className="text-sm font-medium text-gray-500 mb-6">Les favoris sont réservés aux comptes clients.</p>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                  <h2 className="text-xl font-black text-black">Mes Favoris</h2>
                                  {wishlist.length > 0 && (
                                    <p className="text-xs font-semibold text-gray-400 mt-0.5">
                                      {wishlist.length} article{wishlist.length > 1 ? 's' : ''} sauvegardé{wishlist.length > 1 ? 's' : ''}
                                    </p>
                                  )}
                                </div>
                                {wishlist.length > 0 && (
                                  <button
                                    onClick={() => setIsClearFavoritesModalOpen(true)}
                                    className="text-xs font-bold text-red-500 hover:text-red-600 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all"
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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
                            </>
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

                    {activeTab === 'addresses' && (
                      <div className="space-y-8 animate-fade-in">
                        <div className="bg-white p-6 border border-slate-100 shadow-sm rounded-2xl">
                          {user?.role === 'VENDOR' ? (
                            <div className="text-center py-12">
                              <h3 className="text-xl md:text-xl font-black text-black mb-4">Accès non autorisé</h3>
                              <p className="text-sm font-medium text-gray-500">Le carnet d'adresses de livraison est réservé aux comptes clients. Les adresses de boutique sont gérées dans votre profil vendeur (Dashboard).</p>
                            </div>
                          ) : (
                            <AddressBookSection />
                          )}
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
          <div className="px-6 pb-8 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600 overflow-hidden ring-4 ring-gray-50">
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
            <div className="flex-1 min-w-0 w-full px-4">
              <h2 className="font-bold text-black text-xl truncate">{user?.fullName || 'Utilisateur'}</h2>
              <p className="text-sm text-gray-500 truncate mt-0.5">{user?.email || 'email@example.com'}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{user?.role === 'VENDOR' ? 'Vendeur Actif' : 'Client Vérifié'}</span>
              </div>
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

      {/* ===== DESKTOP : Affiche le profil complet par défaut ===== */}
      <div className="hidden lg:block px-8 py-8">
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
        <div className="max-w-3xl space-y-8">
          <div className="bg-white overflow-hidden">
            {/* Header avatar + bouton */}
            <div className="px-6 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-6 border-b border-gray-100 pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <div className="relative group shrink-0">
                  <div className="w-24 sm:w-28 rounded-full overflow-hidden bg-gradient-to-br from-[#E67E22] to-[#2D5A27] flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg relative">
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

            {/* Champs d'information */}
            <div className="px-6 pb-8 space-y-6 pt-6">
              <div>
                <h2 className="text-lg font-bold text-black">Informations du compte</h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">Mettez à jour les détails de votre profil d'utilisateur ici.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500">Prénom</label>
                  <input type="text" readOnly value={user?.fullName?.split(' ')[0] || ''}
                    className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500">Nom de famille</label>
                  <input type="text" readOnly value={user?.fullName?.split(' ').slice(1).join(' ') || ''}
                    className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500">Adresse e-mail</label>
                  <div className="relative">
                    <input type="email" readOnly value={user?.email || ''}
                      className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full pl-4 pr-24 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
                      <CheckCircle2 size={10} />
                      Vérifié
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500">Numéro de téléphone</label>
                  <div className="relative">
                    <input type="text" readOnly value={user?.phone || 'Non renseigné'}
                      className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full pl-4 pr-24 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed" />
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
                  <input type="text" readOnly value={user?.province || 'Non définie'}
                    className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500">Ville / Commune</label>
                  <input type="text" readOnly value={user?.commune || 'Non définie'}
                    className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed" />
                </div>

                {user?.role === 'VENDOR' && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500">Nom de la Boutique</label>
                    <input type="text" readOnly value={user?.boutiqueName || 'Aucune boutique associée'}
                      className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed" />
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500">Membre depuis</label>
                  <input type="text" readOnly
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Récemment'}
                    className="w-full bg-[#F9FAFB] border border-gray-100 rounded-full px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
