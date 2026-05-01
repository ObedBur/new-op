'use client';

import React, { useState, useEffect } from 'react';
import { useLoading } from '@/context/LoadingContext';
import { getVendorStats } from '@/features/vendors/services/orders.service';
import {
    TrendingUp, Users, DollarSign, Package,
    ArrowUpRight, ArrowDownRight, BarChart3,
    Trophy, Zap, Target
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { setAppReady } = useLoading();

    useEffect(() => {
        // Dire au Splash Screen de disparaître !
        setAppReady(true);

        const fetchStats = async () => {
            try {
                const response = await getVendorStats();
                if (response?.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Erreur stats:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [setAppReady]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, iconColor, bgColor, trend }: any) => (
        <Card className="p-6 md:p-8 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500 ${iconColor}`}>
                <Icon size={120} />
            </div>
            <div className="relative z-10">
                <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 ${bgColor}`}>
                    <Icon className={iconColor} size={24} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{title}</p>
                <div className="flex items-end gap-3">
                    <h3 className="text-2xl md:text-3xl font-black text-deep-blue dark:text-white leading-none tracking-tighter">
                        {value}
                    </h3>
                    {trend && (
                        <div className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg mb-1">
                            <ArrowUpRight size={12} className="mr-0.5" />
                            +{trend}%
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-5xl font-black text-deep-blue dark:text-white tracking-tighter uppercase italic leading-none">
                    Performance <span className="text-[#E67E22]">Boutique</span>
                </h1>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
                    Analyse de vos ventes et revenus sur WapiBei
                </p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Chiffre d'Affaires" 
                    value={`${(stats?.totalRevenue || 0).toLocaleString()} $`} 
                    icon={DollarSign} 
                    iconColor="text-[#E67E22]"
                    bgColor="bg-[#E67E22]/10"
                    trend={stats?.recentPerformance}
                />
                <StatCard 
                    title="Ventes Totales" 
                    value={stats?.totalOrders || 0} 
                    icon={Package} 
                    iconColor="text-[#2D5A27]"
                    bgColor="bg-[#2D5A27]/10"
                    trend={8}
                />
                <StatCard 
                    title="Score Confiance" 
                    value="98%" 
                    icon={Target} 
                    iconColor="text-blue-600"
                    bgColor="bg-blue-600/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products */}
                <Card className="p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
                                <Trophy className="text-[#E67E22]" size={20} />
                            </div>
                            <h3 className="font-black text-lg text-deep-blue dark:text-white uppercase tracking-tight">Top Produits</h3>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Par Revenu</span>
                    </div>

                    <div className="space-y-6 flex-grow">
                        {(stats?.topProducts || []).length === 0 ? (
                            <p className="text-center py-10 text-gray-400 font-bold uppercase text-xs tracking-widest italic">Pas encore de ventes</p>
                        ) : (
                            stats.topProducts.map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center font-black text-gray-300">
                                            0{i+1}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm text-deep-blue dark:text-white group-hover:text-[#E67E22] transition-colors">{p.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.count} ventes</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-[#E67E22]">{p.revenue.toLocaleString()} $</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Growth Insights */}
                <Card className="p-8 h-full flex flex-col bg-gradient-to-br from-[#2D5A27] to-[#1a3a16] text-white border-none shadow-2xl shadow-green-900/20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Zap className="text-white" size={20} />
                        </div>
                        <h3 className="font-black text-lg uppercase tracking-tight">Conseils Croissance</h3>
                    </div>

                    <div className="space-y-6 flex-grow">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <h4 className="font-black text-[10px] uppercase tracking-widest mb-2 text-green-300">Optimisation Stock</h4>
                            <p className="text-sm font-medium leading-relaxed opacity-80">
                                Vos produits les plus vendus ont tendance à s'épuiser le weekend. Augmentez votre stock de 20% le vendredi.
                            </p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <h4 className="font-black text-[10px] uppercase tracking-widest mb-2 text-green-300">Visibilité</h4>
                            <p className="text-sm font-medium leading-relaxed opacity-80">
                                Ajouter 2 photos de haute qualité de plus par produit pourrait augmenter vos ventes de 15%.
                            </p>
                        </div>
                    </div>
                    
                    <button className="w-full mt-auto pt-8">
                        <div className="py-4 bg-white text-[#2D5A27] rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02] active:scale-95 transition-all">
                            Améliorer ma boutique
                        </div>
                    </button>
                </Card>
            </div>
        </div>
    );
}
