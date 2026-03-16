'use client';

import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button'; // Assuming Button is available

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                         <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                Mon Espace
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400">
                                Bienvenue, {user?.fullName || 'Utilisateur'} !
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={handleLogout}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            Deconnexion
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Carte 1: Statut du compte */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200">Mon Compte</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Email:</span>
                                <span className="font-medium text-slate-900 dark:text-white">{user?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Rôle:</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    {user?.role}
                                </span>
                            </div>
                             <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <Link href="#" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                    Modifier mon profil &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Carte 2: Actions rapides */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200">Que souhaitez-vous faire ?</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200">
                                🛍️ Parcourir les produits
                            </button>
                             <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200">
                                📦 Suivre mes commandes
                            </button>
                             <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200">
                                💬 Contacter le support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
