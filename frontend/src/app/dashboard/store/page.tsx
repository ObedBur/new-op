import React from 'react';
import {
    LayoutDashboard, ShoppingBag, Box, TrendingUp,
    Plus, Rocket, Bell, Settings, LogOut
} from 'lucide-react';

export default function HorizontalDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* --- NOUVEAU HEADER AVEC NAVIGATION --- */}
            <nav className="bg-white border-b sticky top-0 z-50 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <div className="flex flex-col">
                            <h1 className="text-blue-900 font-black text-xl tracking-tight">WapiBei</h1>
                            <span className="text-[10px] text-blue-500 font-bold uppercase">Business</span>
            </div>

                        {/* Menu Horizontal */}
                        <div className="flex gap-1 items-center">
                            <HeaderTab icon={<LayoutDashboard size={18} />} label="Tableau de bord" active />
                            <HeaderTab icon={<ShoppingBag size={18} />} label="Catalogue" />
                            <HeaderTab icon={<Box size={18} />} label="Stocks" />
                            <HeaderTab icon={<TrendingUp size={18} />} label="Ventes" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-blue-900"><Bell size={20} /></button>
                        <button className="p-2 text-gray-400 hover:text-blue-900"><Settings size={20} /></button>
                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-bold text-blue-900 leading-none">Jean Kabulo</p>
                                <p className="text-[10px] text-green-600 font-medium">Vendeur Vérifié</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden">
                                <img src="/api/placeholder/40/40" alt="Avatar" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- CONTENU --- */}
            <main className="max-w-7xl mx-auto p-8">

                {/* Actions Rapides & Titre */}
                <header className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-blue-900">Tableau de Bord</h2>
                        <p className="text-gray-500">Bienvenue, Jean. Voici un aperçu de votre activité aujourd'hui.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg shadow-orange-200">
                            <Plus size={20} /> Produit
                        </button>
                        <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition">
                            <Rocket size={20} /> Publier
                        </button>
                    </div>
                </header>

                {/* La bannière bleue reste identique au design précédent... */}
                <section className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-[2.5rem] p-10 text-white mb-10 relative overflow-hidden shadow-xl shadow-blue-100">
                    {/* ... contenu de la bannière ... */}
                </section>

                {/* Grille de Produits */}
                <section>
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                        <h3 className="text-2xl font-bold text-blue-900">Gestion des Produits</h3>
                        {/* Filtres de statut */}
                        <div className="flex gap-6 text-sm font-bold">
                            <button className="text-blue-700 border-b-2 border-blue-700 pb-4">Tout (120)</button>
                            <button className="text-gray-400 hover:text-blue-900 pb-4 transition">En ligne (118)</button>
                            <button className="text-gray-400 hover:text-blue-900 pb-4 transition">Brouillons (2)</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Composants ProductCard ici... */}
                    </div>
                </section>
            </main>
        </div>
    );
}

// Sous-composant pour les onglets du header
interface HeaderTabProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

function HeaderTab({ icon, label, active = false }: HeaderTabProps) {
    return (
        <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-sm ${active
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:bg-gray-50 hover:text-blue-900'
            }`}>
            {icon}
            {label}
        </button>
    );
}