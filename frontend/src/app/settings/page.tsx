"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User, Store, Heart, Bell, ShieldCheck, Settings as SettingsIcon,
  ChevronRight, MapPin, BadgeCheck, TrendingDown, TrendingUp,
  Package, Plus, Hammer, Smartphone, Sprout, Search, Lock
} from "lucide-react";
import EditProfileModal from "../modal/EditProfileModal";

import { useAuth } from "@/context/AuthContext";

type SettingsTab = 'profile' | 'store' | 'favorites' | 'notifications' | 'security' | 'preferences';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const navItems = [
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: ShieldCheck },
    { id: 'preferences', label: 'Préférences', icon: SettingsIcon },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f4f9] dark:bg-[#0b1221]">
      {/* Modale d'édition */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto max-w-7xl px-4 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* --- SIDEBAR GAUCHE --- */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-white dark:bg-[#151b2c] rounded-[2rem] p-9 shadow-sm shadow-gray-200/50 sticky top-28">
                <h1 className="text-[28px] font-black text-[#1e293b] dark:text-white leading-none">Paramètres</h1>
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.15em] mt-3 mb-10">MON COMPTE WAPIBEI</p>

                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as SettingsTab)}
                      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[15px] font-bold transition-all duration-300 ${activeTab === item.id
                        ? "bg-[#eef2ff] text-[#4f46e5]"
                        : "text-[#64748b] hover:bg-gray-50"
                        }`}
                    >
                      <item.icon className={`size-5 ${activeTab === item.id ? "text-[#4f46e5]" : "text-[#94a3b8]"}`} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* --- ZONE CENTRALE --- */}
            <div className="flex-1 space-y-8">

              {/* Header Card Utilisateur */}
              <section className="bg-white dark:bg-[#151b2c] rounded-[2rem] p-8 shadow-sm shadow-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="size-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                      {user?.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.fullName || "Avatar"} width={96} height={96} className="object-cover w-full h-full"
                        />
                      ) : user?.fullName ? (
                        <Image
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`}
                          alt={user.fullName} width={96} height={96} className="object-cover"
                        />
                      ) : (
                        <div className="size-24 flex items-center justify-center">
                          <User className="size-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 -right-1 bg-[#0033ff] text-white size-8 rounded-full flex items-center justify-center border-4 border-white">
                      <BadgeCheck className="size-4" fill="currentColor" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-[26px] font-black text-[#1e293b] dark:text-white leading-tight">
                      {user?.fullName || "Utilisateur"}
                    </h2>
                    <div className="flex items-center gap-2 text-[#64748b] text-sm mt-1">
                      <MapPin className="size-4" />
                      <span className="font-semibold">{user?.province || "Goma, RDC"}</span>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-[#eff6ff] text-[#2563eb] rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-50">
                      <ShieldCheck className="size-3.5" />
                      {user?.role === 'VENDOR' ? 'VERIFIED SELLER' : 'VERIFIED CLIENT'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-9 py-4 bg-[#002db3] text-white rounded-2xl font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-blue-500/20 tracking-wide"
                >
                  Éditer Profil
                </button>
              </section>

              {/* Module Wapi-Bei Tracker */}
              <section className="bg-white dark:bg-[#151b2c] rounded-[2rem] p-10 shadow-sm shadow-gray-200/50 border border-gray-50">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-[#1e293b] dark:text-white">Wapi-Bei Tracker</h3>
                  <div className="px-3 py-1 bg-[#fff7ed] text-[#ea580c] rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <div className="size-1.5 bg-[#ea580c] rounded-full animate-pulse"></div>
                    LIVE MARKET
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "Sac de Ciment", location: "PRIX MOYEN GOMA", price: "14.50", icon: Hammer, trend: -2, active: true, trendColor: 'text-[#10b981]' },
                    { name: "iPhone 15", location: "PRIX IMPORT", price: "890.00", icon: Smartphone, trend: 0, active: false, trendColor: 'text-gray-400' },
                    { name: "Haricots (Sac 100kg)", location: "MARCHÉ VIRUNGA", price: "75.00", icon: Sprout, trend: 5, active: true, trendColor: 'text-[#f97316]' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-[#f8fafc] dark:bg-white/2 rounded-[1.5rem] border border-transparent hover:border-gray-100 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="size-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-gray-50">
                          <item.icon className="size-6 text-[#475569]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[16px] text-[#1e293b] dark:text-white leading-tight">{item.name}</h4>
                          <p className="text-[10px] font-bold text-[#94a3b8] mt-1.5 uppercase tracking-widest">{item.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-right">
                          <div className="text-[20px] font-black text-[#1e293b] dark:text-white tracking-tight">${item.price}</div>
                          <div className={`flex items-center justify-end gap-1 text-[11px] font-bold ${item.trendColor} mt-0.5`}>
                            {item.trend !== 0 && (item.trend < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />)}
                            {item.trend === 0 ? 'Stable' : `${item.trend > 0 ? '↑' : '↓'} ${Math.abs(item.trend)}%`}
                          </div>
                        </div>
                        {/* Custom Switch Toggle */}
                        <div className={`w-14 h-7 rounded-full relative transition-all duration-300 cursor-pointer ${item.active ? 'bg-[#002db3]' : 'bg-[#e2e8f0]'}`}>
                          <div className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all duration-300 ${item.active ? 'left-8' : 'left-1'}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-dashed border-gray-100">
                  <button className="w-full p-5 rounded-[1.5rem] border-2 border-dashed border-[#f97316] flex items-center justify-center gap-3 text-sm font-black text-[#f97316] hover:bg-[#fff7ed] transition-all group">
                    <div className="size-8 rounded-full bg-[#f97316] flex items-center justify-center text-white">
                      <Plus className="size-5" />
                    </div>
                    Suivre un nouveau produit
                  </button>
                </div>
              </section>
            </div>

            {/* --- STATS ET INFOS DROITE --- */}
            <aside className="w-full lg:w-80 space-y-8">
              <div className="bg-white dark:bg-[#151b2c] rounded-[2rem] p-8 shadow-sm shadow-gray-200/50">
                <h3 className="text-[18px] font-black text-[#1e293b] dark:text-white mb-8 leading-none">Activité</h3>
                <div className="space-y-8">
                  <div className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-[#eef2ff] flex items-center justify-center">
                        <Package className="size-5 text-[#4f46e5]" />
                      </div>
                      <span className="text-[14px] font-bold text-[#475569] dark:text-gray-300">Mes Annonces</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#1e293b] text-[10px] font-black text-white rounded-lg leading-none">12 Active</span>
                      <ChevronRight className="size-4 text-[#94a3b8] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-[#fff7ed] flex items-center justify-center">
                        <Heart className="size-5 text-[#f97316]" />
                      </div>
                      <span className="text-[14px] font-bold text-[#475569] dark:text-gray-300">Ma Wishlist</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#f97316] text-[10px] font-black text-white rounded-lg leading-none">5 Items</span>
                      <ChevronRight className="size-4 text-[#94a3b8] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151b2c] rounded-[2rem] p-8 shadow-sm shadow-gray-200/50">
                <h3 className="text-[18px] font-black text-[#1e293b] dark:text-white mb-8 leading-none">Sécurité & Confiance</h3>
                <div className="space-y-8">
                  <div className="flex gap-4 items-start">
                    <div className="size-11 rounded-xl bg-[#f8fafc] flex items-center justify-center shrink-0 border border-gray-50 shadow-sm">
                      <ShieldCheck size={20} className="text-[#1e293b]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-black text-[#1e293b] dark:text-white leading-tight">Vérification KYC (Identité)</p>
                      <p className="text-[11px] font-bold text-[#10b981]"> Approuvé</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="size-11 rounded-xl bg-[#f8fafc] flex items-center justify-center shrink-0 border border-gray-50 shadow-sm">
                      <Lock size={18} className="text-[#1e293b]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-black text-[#1e293b] dark:text-white leading-tight">Code PIN de transaction</p>
                      <p className="text-[11px] font-bold text-[#64748b]">Activé pour vos achats</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="size-11 rounded-xl bg-[#f8fafc] flex items-center justify-center shrink-0 border border-gray-50 shadow-sm">
                      <Search size={18} className="text-[#1e293b]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-black text-[#1e293b] dark:text-white leading-tight">Zone de recherche</p>
                      <p className="text-[11px] font-bold text-[#64748b]">Goma & Environs (25km)</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* --- FOOTER MINIMAL --- */}
      <footer className="bg-white dark:bg-[#0b1221] py-16 border-t border-gray-100 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm font-bold text-[#94a3b8] mb-6">WapiBei – La Marketplace de confiance en Afrique</p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-10">
            <Link href="#" className="text-[10px] font-black uppercase text-[#94a3b8] hover:text-[#4f46e5] transition-all tracking-widest">Terms of Service</Link>
            <Link href="#" className="text-[10px] font-black uppercase text-[#94a3b8] hover:text-[#4f46e5] transition-all tracking-widest">Privacy Policy</Link>
            <Link href="#" className="text-[10px] font-black uppercase text-[#94a3b8] hover:text-[#4f46e5] transition-all tracking-widest">Contact Support</Link>
          </div>
          <p className="text-[10px] font-bold text-[#cbd5e1] uppercase tracking-tighter">© 2024 WapiBei Marketplace. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
