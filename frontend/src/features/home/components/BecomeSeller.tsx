import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export const BecomeSeller: React.FC = () => {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-24">
      <div className="relative overflow-hidden bg-[#1a1a1a] dark:bg-[#0f172a] rounded-[3rem] md:rounded-[5rem] p-8 md:p-20 flex flex-col lg:flex-row items-center gap-16 shadow-2xl border border-[#DDB88C]/20 shadow-black/20">

        {/* Background Decorative - Subtle Sand only */}
        <div className="absolute top-0 right-0 w-2/3 h-full -z-0 opacity-5 pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full fill-[#DDB88C] blur-3xl">
            <path d="M100,200 Q150,50 300,100 T350,300 T150,350 Z" />
          </svg>
        </div>

        {/* Left Side: Human Story & Value */}
        <div className="flex-1 relative z-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-[#E67E22] text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E67E22] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E67E22]"></span>
              </span>
              Votre communauté vous attend
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tighter">
              Donnez du souffle à votre <span className="text-[#E67E22] italic">boutique africaine.</span>
            </h2>

            <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Bien plus qu&apos;un site, WapiBei est le point de rencontre entre votre savoir-faire et des milliers de clients locaux qui cherchent vos produits.
            </p>

            <div className="pt-8 flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-[#0g172a] hover:bg-orange-600 text-white font-black text-lg transition-all shadow-xl shadow-[#E67E22]/30 hover:-translate-y-1">
                Lancer ma boutique
              </Button>
              <Button variant="ghost" size="lg" className="h-16 px-8 rounded-2xl border border-white/20 text-white font-bold hover:bg-white/10">
                Voir comment ça marche
              </Button>
            </div>

            <div className="pt-10 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="size-10 rounded-full border-2 border-[#2D5A27] bg-white/10 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=seller${i}`} alt="Vendeur" className="w-full h-full object-cover opacity-80" />
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm font-bold">
                <span className="text-white">500+</span> vendeurs font déjà grandir leur business ici
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Human Success Visual */}
        <div className="w-full lg:w-[400px] shrink-0 relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Card */}
            <div className="w-72 md:w-80 aspect-[4/5] bg-black/20 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 flex flex-col justify-end relative z-10 overflow-hidden shadow-3xl">
              {/* Background Image from /hero */}
              <div className="absolute inset-0 -z-10">
                <img
                  src="/hero/slide2.png"
                  alt="Vendeur WapiBei"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 " />
              </div>

              <div className="p-8 space-y-4">
                <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#E67E22] text-3xl">local_mall</span>
                </div>
                <h3 className="text-2xl font-black text-white leading-tight">Vendez partout, <br /> tout le temps.</h3>
                <p className="text-[#DDB88C] text-xs font-bold uppercase tracking-widest">Digitalisation simplifiée</p>
              </div>
            </div>

            {/* Floating Elements - Human Context */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white text-[#2D5A27] px-5 py-3 rounded-2xl shadow-xl font-black text-xs z-20 flex items-center gap-2 border border-[#DDB88C]/30"
            >
              <span className="material-symbols-outlined text-[16px]">celebration</span>
              Nouvelle vente !
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-8 bg-white p-4 rounded-2xl shadow-2xl z-20 border border-[#DDB88C]/20"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#E67E22]/10 flex items-center justify-center text-[#E67E22]">
                  <span className="material-symbols-outlined text-xl">favorite</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Avis Client</p>
                  <p className="text-xs font-bold text-[#2D5A27]">Vendeur au top !</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
