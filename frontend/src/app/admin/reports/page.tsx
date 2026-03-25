'use client';

import React from 'react';

export default function AdminReportsPage() {
  const stats = [
    { label: 'Revenus du mois', value: '0 $', icon: 'payments', color: 'from-emerald-500 to-teal-600', change: '+0%' },
    { label: 'Commandes totales', value: '0', icon: 'shopping_cart', color: 'from-blue-500 to-indigo-600', change: '+0%' },
    { label: 'Nouveaux utilisateurs', value: '0', icon: 'person_add', color: 'from-purple-500 to-violet-600', change: '+0%' },
    { label: 'Taux conversion', value: '0%', icon: 'trending_up', color: 'from-amber-500 to-orange-600', change: '+0%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Rapports</h1>
        <p className="text-sm text-slate-500 mt-1">Vue d&apos;ensemble des performances de la plateforme</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`size-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <span className="material-symbols-outlined text-white text-xl">{stat.icon}</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Placeholder Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Revenus mensuels</h3>
          <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl mb-2 block">bar_chart</span>
              <p className="text-sm font-medium">Les graphiques apparaîtront ici</p>
              <p className="text-xs mt-1">Avec les premières commandes</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Activité des utilisateurs</h3>
          <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl mb-2 block">timeline</span>
              <p className="text-sm font-medium">Statistiques d&apos;activité</p>
              <p className="text-xs mt-1">Données en temps réel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
