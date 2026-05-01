'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, MessageCircle, ArrowRight, Home, Package, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CheckoutSuccessPage() {
    const [orderInfo, setOrderInfo] = useState<any>(null);

    useEffect(() => {
    
    }, []);

    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-[#080b14] pt-28 pb-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="flex flex-col items-center text-center">
                    
                    {/* Success Icon Animation */}
                    <motion.div 
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="size-28 md:size-40 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-emerald-500/20 border-4 border-white dark:border-white/5"
                    >
                        <CheckCircle2 size={64} strokeWidth={2.5} />
                    </motion.div>

                    {/* Main Title */}
                    <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
                        <h1 className="text-4xl md:text-6xl font-black text-deep-blue dark:text-white tracking-tighter mb-4 uppercase italic">
                            Commande <span className="text-[#E67E22]">Validée !</span>
                        </h1>
                        <div className="h-1.5 w-24 bg-[#E67E22] rounded-full mx-auto mb-8"></div>
                    </motion.div>

                    {/* Description Text */}
                    <motion.div 
                        {...fadeUp} 
                        transition={{ delay: 0.3 }}
                        className="space-y-6 mb-12"
                    >
                        <p className="text-lg md:text-xl font-bold text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
                            Félicitations ! Votre demande a été transmise avec succès aux vendeurs concernés.
                        </p>
                        
                        <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/20 rounded-[2rem] p-6 md:p-8 max-w-lg mx-auto">
                            <h3 className="text-[11px] font-black text-[#E67E22] uppercase tracking-[0.25em] mb-3 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">info</span>
                                Rappel Paiement
                            </h3>
                            <p className="text-sm font-bold text-orange-950 dark:text-orange-100/70 leading-relaxed">
                                Comme convenu, le site est actuellement **gratuit**. Le paiement s'effectue directement entre vous et le vendeur selon les modalités que vous arrangerez ensemble (Cash, Mobile Money, etc.).
                            </p>
                        </div>
                    </motion.div>

                    {/* Instruction Step */}
                    <motion.div 
                        {...fadeUp} 
                        transition={{ delay: 0.4 }}
                        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
                    >
                        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-3xl flex items-start gap-4 text-left group hover:border-[#E67E22]/30 transition-all">
                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <MessageCircle className="text-[#E67E22]" size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-[#1e293b] dark:text-white text-sm uppercase tracking-tight mb-1">Contactez le vendeur</h4>
                                <p className="text-xs font-medium text-gray-500">Utilisez WhatsApp pour finaliser la livraison rapidement.</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-3xl flex items-start gap-4 text-left group hover:border-[#E67E22]/30 transition-all">
                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Bell className="text-[#E67E22]" size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-[#1e293b] dark:text-white text-sm uppercase tracking-tight mb-1">Suivi In-App</h4>
                                <p className="text-xs font-medium text-gray-500">Vous recevrez une notification dès que le vendeur confirme.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div 
                        {...fadeUp} 
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                    >
                        <Link href="/" className="w-full sm:w-auto">
                            <Button 
                                variant="outline" 
                                className="w-full sm:px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2"
                            >
                                <Home size={18} /> Retour Accueil
                            </Button>
                        </Link>
                        
                        <Link href="/products" className="w-full sm:w-auto">
                            <Button 
                                className="w-full sm:px-10 h-14 bg-[#E67E22] hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-orange-500/20 flex items-center gap-2 group"
                            >
                                <ShoppingBag size={18} /> Continuer mes achats <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Footer decoration */}
                    <motion.div 
                        {...fadeUp} 
                        transition={{ delay: 0.7 }}
                        className="mt-20 pt-10 border-t border-gray-100 dark:border-white/5 w-full flex items-center justify-center gap-8 opacity-20"
                    >
                        <Package size={32} />
                        <div className="size-2 bg-gray-300 rounded-full"></div>
                        <CheckCircle2 size={32} />
                        <div className="size-2 bg-gray-300 rounded-full"></div>
                        <MessageCircle size={32} />
                    </motion.div>

                </div>
            </div>
        </main>
    );
}
