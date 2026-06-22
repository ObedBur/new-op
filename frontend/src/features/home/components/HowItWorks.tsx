import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { HowItWorksStep } from "../services/content.service";

type DisplayRow = {
  key: string;
  num: string;
  title: string;
  stepTag: string;
  tagLine: string;
  description: string;
  isCard: boolean;
};

const FALLBACK_ROWS: DisplayRow[] = [
  {
    key: "fallback-1",
    num: "01",
    title: "Trouvez vos favoris",
    stepTag: "Étape 1",
    tagLine: "La Découverte",
    description:
      "Explorez un vaste catalogue de produits locaux et internationaux (agricole, mode, tech). Ajoutez vos coups de cœur à votre panier en un clic.",
    isCard: true,
  },
  {
    key: "fallback-2",
    num: "02",
    title: "Achetez avec simplicité",
    stepTag: "Étape 2",
    tagLine: "La Commande",
    description:
      "Validez votre panier instantanément sur la plateforme. Le vendeur reçoit immédiatement une alerte sur son tableau de bord pour préparer votre commande.",
    isCard: false,
  },
  {
    key: "fallback-3",
    num: "03",
    title: "Restez informé",
    stepTag: "Étape 3",
    tagLine: "Le Suivi & Le Contact",
    description:
      "Suivez l'état de votre commande en temps réel. Discutez directement avec le vendeur sur WhatsApp pour le moindre détail.",
    isCard: false,
  },
  {
    key: "fallback-4",
    num: "04",
    title: "Recevez et profitez",
    stepTag: "Étape 4",
    tagLine: "La Réception",
    description:
      "Le vendeur vous expédie votre colis. Réceptionnez vos achats, vérifiez la qualité et finalisez la transaction en toute confiance.",
    isCard: true,
  },
];

export interface HowItWorksProps {
  /** Étapes depuis l’API `/content/homepage` ; si vide, contenu par défaut. */
  steps?: HowItWorksStep[];
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ steps = [] }) => {
  // If we receive data from the API, we can adapt it to the new structure
  const rows = useMemo(() => {
    if (steps.length === 0) return FALLBACK_ROWS;
    
    return steps.map((s, i) => ({
      key: s.id,
      num: String(i + 1).padStart(2, "0"),
      title: s.title,
      stepTag: `Étape ${i + 1}`,
      tagLine: "Processus WapiBei",
      description: s.description,
      isCard: i === 0 || i === 3, // 01 and 04 are cards (indices 0 and 3)
    }));
  }, [steps]);

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-32 bg-[#fafafa] dark:bg-[#0c0c0c] overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#DDB88C]/5 rounded-full blur-[100px] -rotate-12 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#E67E22]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-6"
        >
          <h3 className="text-[#E67E22] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2">
            <span className="w-4 h-0.5 bg-[#E67E22]"></span>
            NOTRE PROCESSUS
          </h3>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-deep-blue dark:text-white leading-[1.1] tracking-tighter">
            La Formule Parfaite pour un <br />
            Commerce de Confiance
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-xl mx-auto">
            Chaque achat réussi suit un processus réfléchi. Notre approche relie directement vos besoins aux meilleurs vendeurs d'Afrique.
          </p>
        </motion.div>

        {/* Checkerboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8 lg:gap-y-16 max-w-5xl mx-auto">
          {rows.map((row, index) => {
            const isCard = row.isCard;
            
            return (
              <motion.div
                key={row.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`flex flex-col sm:flex-row items-start gap-6 md:gap-8 lg:gap-10 ${
                  isCard 
                    ? "bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none p-8 sm:p-10" 
                    : "p-8 sm:p-10"
                }`}
              >
                {/* Giant Number */}
                <div className="shrink-0">
                  <span className="text-[5rem] lg:text-[7rem] leading-none font-black tracking-tighter text-deep-blue dark:text-white/90 drop-shadow-sm">
                    {row.num}
                  </span>
                </div>

                {/* Content Block */}
                <div className="flex-1 pt-2 lg:pt-4">
                  <h3 className="text-2xl md:text-3xl font-black text-deep-blue dark:text-white leading-tight mb-2">
                    {row.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      {row.stepTag}
                    </span>
                    <span className="text-sm font-black text-deep-blue dark:text-gray-300">
                      {row.tagLine}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                    {row.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 md:mt-32 text-center space-y-8 flex flex-col items-center"
        >
          <p className="text-lg md:text-xl font-black text-deep-blue dark:text-white">
            Commencez vos achats dès maintenant.
          </p>
          <Link href="/products" className="group relative inline-flex items-center justify-center px-8 md:px-10 py-4 font-black text-white bg-[#E67E22] rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(230,126,34,0.5)] duration-300">
            <span className="relative z-10 uppercase tracking-widest text-xs md:text-sm flex items-center gap-3">
              Explorer les produits
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
