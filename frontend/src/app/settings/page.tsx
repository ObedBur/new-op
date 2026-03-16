'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

type SettingsTab = 'profile' | 'orders' | 'favorites' | 'my-store' | 'notifications' | 'security' | 'preferences';

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') as SettingsTab | null;
  const activeTab: SettingsTab = tabParam || 'profile';

  const navGroups = [
    {
      title: "Compte",
      items: [
        { id: 'profile', label: 'Mon Profil', icon: 'person', color: 'bg-blue-100 text-blue-600' },
        { id: 'orders', label: 'Mes Commandes', icon: 'package_2', color: 'bg-green-100 text-green-600' },
        { id: 'favorites', label: 'Mes Favoris', icon: 'favorite', color: 'bg-red-100 text-red-600' },
      ]
    },
    {
      title: "Commerce",
      items: [
        { id: 'my-store', label: 'Ma Boutique', icon: 'storefront', color: 'bg-orange-100 text-orange-600' },
      ]
    },
    {
      title: "Application",
      items: [
        { id: 'notifications', label: 'Notifications', icon: 'notifications', color: 'bg-purple-100 text-purple-600' },
        { id: 'security', label: 'Sécurité', icon: 'lock_person', color: 'bg-green-100 text-green-600' },
        { id: 'preferences', label: 'Préférences', icon: 'tune', color: 'bg-gray-100 text-gray-600' },
      ]
    }
  ];

  const renderProfileContent = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
          <div>
              <h3 className="text-2xl font-black text-deep-blue dark:text-white">Mon Profil</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Informations personnelles et adresses</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-black border border-gray-200 dark:border-white/10">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Modifier le profil
          </button>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-4xl lg:rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col xl:flex-row">
          <div className="w-full xl:w-1/3 p-10 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-white/2 border-b xl:border-b-0 xl:border-r border-gray-100 dark:border-white/5">
              <div className="relative mb-6">
                  <div className="size-40 lg:size-44 rounded-[3rem] bg-white dark:bg-background-dark border-8 border-white dark:border-[#1a1a1a] shadow-2xl overflow-hidden">
                      <Image src="https://ui-avatars.com/api/?name=Justin+Kivu&background=f96f06&color=fff&size=200" alt="Justin Kivu" width={176} height={176} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white size-12 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-[#1a1a1a]">
                      <span className="material-symbols-outlined text-[24px]">verified</span>
                  </div>
              </div>
              <h4 className="text-2xl font-black text-deep-blue dark:text-white">Justin Kivu</h4>
              <p className="text-xs text-primary font-black uppercase tracking-widest mt-1">Membre Certifié</p>
          </div>

          <div className="flex-1 p-8 lg:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: "Email", val: "justin.k@wapibei.cd", icon: "alternate_email" },
                    { label: "Téléphone", val: "+243 999 123 456", icon: "call" },
                    { label: "Membre depuis", val: "Janvier 2024", icon: "calendar_today" },
                    { label: "Statut", val: "Acheteur Actif", icon: "check_circle", color: "text-green-600" }
                  ].map((info, idx) => (
                    <div key={idx} className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{info.label}</label>
                        <div className={`flex items-center gap-3 text-sm font-bold ${info.color || 'text-deep-blue dark:text-white'}`}>
                            <span className="material-symbols-outlined text-gray-300 text-[20px]">{info.icon}</span>
                            {info.val}
                        </div>
                    </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'profile': return renderProfileContent();
      default:
        return (
          <div className="py-20 text-center opacity-40 animate-in fade-in duration-500">
            <span className="material-symbols-outlined text-5xl">construction</span>
            <p className="mt-2 font-black uppercase text-xs tracking-widest">Bientôt disponible: {activeTab}</p>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 pt-20">
      <section className="container mx-auto max-w-7xl md:py-8 lg:py-16">
        <div className="hidden lg:flex gap-12">
          <aside className="w-72 shrink-0 space-y-2">
              <div className="px-4 mb-4">
                  <h2 className="text-3xl font-black text-deep-blue dark:text-white tracking-tight">Paramètres</h2>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1">Mon compte WapiBei</p>
              </div>
              <nav className="space-y-1">
                  {navGroups.flatMap(g => g.items).map((item) => (
                      <button 
                          key={item.id}
                          onClick={() => router.push(`/settings?tab=${item.id}`)}
                          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                              activeTab === item.id 
                              ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                          }`}
                      >
                          <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                          {item.label}
                      </button>
                  ))}
              </nav>
          </aside>

          <div className="flex-1 min-w-0">
              <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/5 p-12 min-h-[600px]">
                  {renderContent()}
              </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <main className="flex-1 pt-20">
        <section className="container mx-auto max-w-7xl md:py-8 lg:py-16">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="animate-pulse text-center">
              <span className="material-symbols-outlined text-5xl text-primary">settings</span>
              <p className="mt-2 font-black uppercase text-xs tracking-widest text-gray-400">Chargement...</p>
            </div>
          </div>
        </section>
      </main>
    }>
      <SettingsContent />
    </Suspense>
  );
}
