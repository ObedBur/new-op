"use client";

import React, { useState } from "react";
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
import { useSearchParams } from 'next/navigation';
import { VendorSidebar } from "@/components/layout/VendorSidebar";
import { useAppNotifications } from "@/hooks/useAppNotifications";

type SettingsTab = 'profile' | 'store' | 'favorites' | 'notifications' | 'security' | 'preferences';

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

export default function SettingsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') as SettingsTab) || 'profile';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useAppNotifications();

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
               <VendorSidebar user={user} />
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
                    <section className="bg-white dark:bg-[#111827] rounded-none sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border-y sm:border border-gray-100 dark:border-white/5 sm:shadow-2xl sm:shadow-gray-200/20 min-h-[80vh] sm:min-h-0">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-12">
                        <div className="space-y-1">
                          <h3 className="text-xl md:text-xl font-black text-deep-blue dark:text-white tracking-tight leading-none">Centre de Notifications</h3>
                          <p className="text-xs md:text-xs font-semibold text-gray-400">Restez informé de votre activité sur WapiBei</p>
                        </div>
                        {notifications.some(n => !n.isRead) && (
                          <button
                            onClick={markAllAsRead}
                            className="group flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-600/20"
                          >
                            <CheckCircle2 size={16} />
                            Tout marquer comme lu
                          </button>
                        )}
                      </div>

                      <div className="space-y-5">
                        {isLoading ? (
                          <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <div className="relative size-16">
                               <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-white/5"></div>
                               <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin"></div>
                            </div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Chargement des alertes...</p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="py-24 text-center space-y-6">
                            <div className="size-24 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] mx-auto flex items-center justify-center text-gray-200">
                               <Bell size={40} />
                            </div>
                            <div className="space-y-2">
                               <p className="text-xl font-black text-deep-blue dark:text-white">Aucun nouveau message</p>
                               <p className="text-sm font-semibold text-gray-400">Nous vous tiendrons au courant dès qu'il y a du nouveau.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="max-h-[75vh] sm:max-h-[60vh] overflow-y-auto pr-1 sm:pr-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 hover:scrollbar-thumb-gray-300 transition-colors">
                            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3 sm:space-y-4">
                              {notifications.map((n) => (
                                <motion.div 
                                  variants={fadeUp}
                                  key={n.id} 
                                  className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6 p-4 md:p-7 rounded-[1.25rem] md:rounded-[2rem] border transition-all duration-300 ${n.isRead ? 'bg-white dark:bg-white/0 border-gray-100 dark:border-white/5' : 'bg-[#FDF9F6] dark:bg-orange-500/5 border-orange-100 dark:border-orange-500/20 shadow-sm'}`}
                                >
                                  {/* Mobile-optimized Header Layout */}
                                  <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                                    <div className={`size-10 md:size-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-xs border transition-transform duration-500 group-hover:scale-110 ${n.isRead ? 'bg-gray-50 text-gray-400 border-gray-100 dark:bg-white/5 dark:border-white/10' : 'bg-orange-100 text-orange-600 border-orange-200'}`}>
                                      <Bell size={20} className="md:size-6 shrink-0" />
                                    </div>
                                    <div className="flex-1 min-w-0 sm:hidden">
                                      <div className="flex items-center justify-between mb-1">
                                        <h4 className={`text-base font-black truncate leading-tight pr-2 ${n.isRead ? 'text-gray-900 dark:text-white' : 'text-orange-950 dark:text-orange-100'}`}>
                                          {n.title}
                                        </h4>
                                        <div className="flex flex-col items-end shrink-0">
                                            <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                                                {new Date(n.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                      </div>
                                      <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-snug line-clamp-2">
                                        {n.message}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Desktop-optimized Layout */}
                                  <div className="hidden sm:block flex-1 min-w-0 pr-8">
                                    <div className="flex items-center justify-between mb-1.5">
                                      <h4 className="font-black text-base text-deep-blue dark:text-white leading-none pr-4">{n.title}</h4>
                                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                        <Clock size={10} />
                                        {new Date(n.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                      {n.message}
                                    </p>
                                    {!n.isRead && (
                                      <button
                                        onClick={() => markAsRead(n.id)}
                                        className="mt-5 px-5 py-2.5 bg-white dark:bg-white/10 text-orange-600 dark:text-orange-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-500/20 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                                      >
                                        Marquer comme lu
                                      </button>
                                    )}
                                  </div>
                                  <div className="absolute top-4 right-4 sm:top-7 sm:right-7 p-1 sm:p-2 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer">
                                    <MoreVertical size={18} className="size-4 sm:size-[18px]" />
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {activeTab === 'profile' && (
                    <div className="space-y-8">
                      <section className="bg-white dark:bg-[#111827] rounded-none sm:rounded-[2rem] md:rounded-[2.5rem] border-y sm:border border-gray-100 dark:border-white/5 sm:shadow-2xl sm:shadow-gray-200/20 overflow-hidden">
                        
                        {/* --- COVER & BANNER --- */}
                        <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-orange-100 to-green-100 dark:from-orange-900/30 dark:to-green-900/30 relative">
                            {/* Texture optionnelle */}
                            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                            <div className="absolute inset-0 opacity-10 dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
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
                                        className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-[1rem] text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/10 transition-all sm:shadow-sm"
                                    >
                                        Changer Sécurité
                                    </button>
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

                  {activeTab !== 'notifications' && activeTab !== 'profile' && (
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
