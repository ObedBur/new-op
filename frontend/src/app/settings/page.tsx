"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Store, Heart, Bell, ShieldCheck, Settings as SettingsIcon,
  ChevronRight, MapPin, BadgeCheck, TrendingDown, TrendingUp,
  Package, Plus, Hammer, Smartphone, Sprout, Search, Lock,
  ShoppingBag, CheckCircle2, Clock, MoreVertical, SlidersHorizontal
} from "lucide-react";
import EditProfileModal from "../modal/EditProfileModal";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from 'next/navigation';
import { VendorSidebar } from "@/components/layout/VendorSidebar";
import { useAppNotifications } from "@/hooks/useAppNotifications";

import { getClientOrders, Order } from "@/features/vendors/services/orders.service";

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

function SettingsPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') as SettingsTab) || 'profile';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clientOrders, setClientOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'orders') {
      setIsLoadingOrders(true);
      getClientOrders().then(res => {
        if (res.success) setClientOrders(res.data || []);
        setIsLoadingOrders(false);
      });
    }
  }, [activeTab]);

  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useAppNotifications();

  const handleNotificationClick = (n: any) => {
    if (!n.isRead) {
      markAsRead(n.id);
    }

    if (n.type === 'NEW_PRODUCT' && n.metadata?.productId) {
      router.push(`/products/${n.metadata.productId}`);
    } else if (n.type === 'ORDER_CREATED' || n.type === 'ORDER_CONFIRMED') {
      router.push(user?.role === 'VENDOR' ? '/dashboard/orders' : '/settings?tab=orders');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#080b14]">
      {/* Modale d'édition */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <main className="flex-grow pt-0 md:pt-10 pb-20">
        <div className="container mx-auto max-w-7xl px-0 sm:px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-0 sm:gap-6 lg:gap-10 items-stretch">

            {/* --- SIDEBAR GAUCHE (Modernized) --- */}
            <div className="lg:w-72 shrink-0 flex flex-col">
              <Suspense fallback={null}>
                <VendorSidebar user={user} />
              </Suspense>
            </div>
            {/* --- ZONE CENTRALE (Désormais plein écran) --- */}
            <div className="flex-1 space-y-6">

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
                              channels: ['Push', 'Email', 'In-App']
                            },
                            {
                              id: 'follows',
                              title: 'Vendeurs Favoris',
                              desc: 'Soyez le premier informé quand vos vendeurs préférés publient un nouveau produit.',
                              channels: ['Push', 'Email', 'In-App']
                            },
                            {
                              id: 'promos',
                              title: 'Offres & Promotions',
                              desc: 'Recevez des alertes sur les baisses de prix et les meilleures opportunités du moment.',
                              channels: ['Push', 'Email']
                            },
                            {
                              id: 'security',
                              title: 'Sécurité & Compte',
                              desc: 'Alertes de connexion, vérification KYC et modifications importantes de profil.',
                              channels: ['Email', 'In-App'],
                              forced: true
                            }
                          ].map((cat) => (
                            <div key={cat.id} className="group flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-10 border-b border-gray-50 dark:border-white/5 last:border-0 last:pb-0">
                              <div className="max-w-md">
                                <h4 className="text-base font-black text-deep-blue dark:text-white mb-1.5">{cat.title}</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{cat.desc}</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                                {cat.channels.map((channel) => (
                                  <div key={channel} className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" className="sr-only peer" defaultChecked={true} disabled={cat.forced && channel === 'Email'} />
                                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E67E22]"></div>
                                      <span className="ml-3 text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{channel}</span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-12 flex justify-end">
                          <button className="px-8 py-4 bg-deep-blue dark:bg-white text-white dark:text-deep-blue rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/10">
                            Enregistrer les réglages
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
                      <section className="bg-white dark:bg-[#111827] rounded-none sm:rounded-[2rem] md:rounded-[2.5rem] border-y sm:border border-gray-100 dark:border-white/5 sm:shadow-2xl sm:shadow-gray-200/20 overflow-hidden">

                        {/* --- COVER & BANNER --- */}
                        <div className="h-32 sm:h-48 w-full relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                          <Image
                            src={user?.coverUrl || (user?.role === 'VENDOR'
                              ? "/images/default-vendor-cover.png"
                              : "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2000&auto=format&fit=crop"
                            )}
                            alt="Image de couverture"
                            fill
                            className="object-cover"
                            priority
                          />
                          {/* Overlay subtil pour assurer un bon contraste */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 dark:to-black/30"></div>
                        </div>

                        <div className="px-6 md:px-12 pb-8 md:pb-12 relative">

                          {/* --- AVATAR & ACTIONS HEADER --- */}
                          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end -mt-16 sm:-mt-20 mb-4 sm:mb-6 gap-6 sm:gap-0">
                            <div className="relative group shrink-0 z-10 isolate">
                              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-green-600 rounded-[2.5rem] blur-xl opacity-20 sm:opacity-30 transition duration-500"></div>
                              <div className="relative size-32 sm:size-40 rounded-[2rem] border-4 border-white dark:border-[#111827] shadow-xl overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                                {user?.avatarUrl ? (
                                  <Image src={user.avatarUrl} alt={user.fullName || 'User'} fill className="object-cover" />
                                ) : (
                                  <span className="text-4xl md:text-5xl font-black text-gray-300">
                                    {user?.fullName?.charAt(0) || 'U'}
                                  </span>
                                )}
                                <button
                                  onClick={() => setIsEditModalOpen(true)}
                                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                                >
                                  <span className="text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <SettingsIcon size={14} /> Éditer
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* DESKTOP ACTIONS */}
                            <div className="hidden sm:flex w-full sm:w-auto flex-col sm:flex-row gap-3 sm:pb-2">
                              <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full sm:w-auto px-6 py-3 bg-[#E67E22] text-white rounded-[1rem] text-[11px] font-black uppercase tracking-widest hover:bg-[#cf6d18] transition-all shadow-lg shadow-orange-500/20"
                              >
                                Éditer Profil
                              </button>
                            </div>
                          </div>

                          {/* --- USER TITLE & BADGES --- */}
                          <div className="text-center sm:text-left space-y-2.5 mb-6 sm:mb-10">
                            <h2 className="text-2xl md:text-3xl font-black text-deep-blue dark:text-white capitalize tracking-tight">
                              {user?.fullName || 'Utilisateur'}
                            </h2>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 mt-1">
                              <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400">
                                {user?.email}
                              </p>
                              <div className="hidden sm:block text-gray-300 dark:text-gray-600 px-1">•</div>
                              <div className="flex items-center gap-2">
                                {user?.role === 'VENDOR' && (
                                  <span className="text-[#E67E22] bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                                    Vendeur
                                  </span>
                                )}
                                <span className="text-[#2D5A27] dark:text-[#52c140] bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                                  Actif
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* MOBILE ACTIONS */}
                          <div className="flex sm:hidden w-full flex-col gap-3 mb-8">
                            <button
                              onClick={() => setIsEditModalOpen(true)}
                              className="w-full px-6 py-3.5 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-[1rem] text-[11px] font-black uppercase tracking-widest active:bg-gray-50 transition-all shadow-sm"
                            >
                              Changer Sécurité
                            </button>
                            <button
                              onClick={() => setIsEditModalOpen(true)}
                              className="w-full px-6 py-3.5 bg-[#E67E22] text-white rounded-[1rem] text-[11px] font-black uppercase tracking-widest active:bg-[#cf6d18] transition-all shadow-lg shadow-orange-500/20"
                            >
                              Éditer Profil
                            </button>
                          </div>

                          {/* --- DETAILED INFO GRID --- */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 pt-8 border-t border-gray-100 dark:border-white/5">
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</p>
                              <p className="text-[15px] font-semibold text-deep-blue dark:text-white flex items-center gap-2.5">
                                <Smartphone size={16} className="text-gray-400" />
                                {user?.phone ? user.phone : <span className="text-gray-400 italic">Non renseigné</span>}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localisation</p>
                              <p className="text-[15px] font-semibold text-deep-blue dark:text-white flex items-center gap-2.5">
                                <MapPin size={16} className="text-gray-400" />
                                {user?.province || user?.commune ? `${user.commune || ''}, ${user.province || ''}`.trim().replace(/^,\s*/, '') : <span className="text-gray-400 italic">Non définie</span>}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom de la Boutique</p>
                              <p className="text-[15px] font-semibold text-deep-blue dark:text-white flex items-center gap-2.5">
                                <Store size={16} className="text-gray-400" />
                                {user?.boutiqueName ? user.boutiqueName : <span className="text-gray-400 italic">Aucune boutique associée</span>}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Membre Depuis</p>
                              <p className="text-[15px] font-semibold text-deep-blue dark:text-white flex items-center gap-2.5">
                                <Clock size={16} className="text-gray-400" />
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Récemment'}
                              </p>
                            </div>
                          </div>

                        </div>
                      </section>
                    </div>
                  )}

                  {activeTab !== 'notifications' && activeTab !== 'profile' && activeTab !== 'orders' && (
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
