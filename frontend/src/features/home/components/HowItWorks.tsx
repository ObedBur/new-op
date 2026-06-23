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
    title: "Trouvez",
    stepTag: "Étape 1",
    tagLine: "Vos Produits Favoris",
    description:
      "Explorez un vaste catalogue de produits locaux et internationaux (agricole, mode, tech). Ajoutez vos coups de cœur à votre panier en un clic.",
    isCard: true,
  },
  {
    key: "fallback-2",
    num: "02",
    title: "Achetez",
    stepTag: "Étape 2",
    tagLine: "En Toute Simplicité",
    description:
      "Validez votre panier instantanément sur la plateforme. Le vendeur reçoit immédiatement une alerte sur son tableau de bord pour préparer votre commande.",
    isCard: false,
  },
  {
    key: "fallback-3",
    num: "03",
    title: "Suivez",
    stepTag: "Étape 3",
    tagLine: "En Temps Réel",
    description:
      "Suivez l'état de votre commande (Confirmée, Expédiée) en temps réel. Discutez directement avec le vendeur sur WhatsApp pour le moindre détail.",
    isCard: false,
  },
  {
    key: "fallback-4",
    num: "04",
    title: "Recevez",
    stepTag: "Étape 4",
    tagLine: "Et Profitez",
    description:
      "Le vendeur vous expédie votre colis. Réceptionnez vos achats, vérifiez la qualité et finalisez la transaction en toute confiance.",
    isCard: true,
  },
];

export interface HowItWorksProps {
  steps?: HowItWorksStep[];
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ steps = [] }) => {
  const rows = useMemo(() => {
    if (steps.length === 0) return FALLBACK_ROWS;
    return steps.map((s, i) => ({
      key: s.id,
      num: String(i + 1).padStart(2, "0"),
      title: s.title,
      stepTag: `Étape ${i + 1}`,
      tagLine: "WapiBei",
      description: s.description,
      isCard: i === 0 || i === steps.length - 1,
    }));
  }, [steps]);

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-32 bg-[#111111] overflow-hidden"
    >
      <div className="container mx-auto max-w-6xl px-4 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-5"
        >
          {/* Eyebrow */}
          <p className="text-[#E67E22] font-bold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2">
            <span className="inline-block w-3 h-0.5 bg-[#E67E22]" />
            Notre Philosophie
          </p>

          {/* Main title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
            La Formule Parfaite pour un{" "}
            <br className="hidden sm:block" />
            Commerce de{" "}
            <span className="text-[#E67E22]">Confiance.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Chaque achat réussi suit un processus simple et humain. Notre
            approche relie directement vos besoins aux meilleurs vendeurs
            d'Afrique.
          </p>
        </motion.div>

        {/* ── Checkerboard Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {rows.map((row, index) => (
            <motion.div
              key={row.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.12, duration: 0.55, ease: "easeOut" }}
              className={`flex flex-col justify-between min-h-[280px] sm:min-h-[320px] p-8 md:p-10 rounded-[2rem] ${
                row.isCard
                  ? "bg-[#f0eeeb] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
                  : "bg-transparent border border-white/10"
              }`}
            >
              {/* Giant Number — top */}
              <span
                className={`text-[5rem] sm:text-[6rem] md:text-[7rem] leading-none font-black tracking-tighter select-none ${
                  row.isCard ? "text-[#111111]" : "text-white/90"
                }`}
              >
                {row.num}
              </span>

              {/* Content — bottom */}
              <div className="mt-4">
                <h3
                  className={`text-lg md:text-xl font-black leading-snug ${
                    row.isCard ? "text-[#111111]" : "text-white"
                  }`}
                >
                  {row.title}
                </h3>
                <p
                  className={`text-xs font-semibold mt-1 mb-3 ${
                    row.isCard ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <span className="uppercase tracking-widest">{row.stepTag}</span>{" "}
                  <span className="font-black">{row.tagLine}</span>
                </p>
                <p
                  className={`text-sm leading-relaxed ${
                    row.isCard ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {row.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA Footer ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 md:mt-28 text-center flex flex-col items-center gap-6"
        >
          <p className="text-white font-bold text-base md:text-lg leading-snug">
            Commencez vos achats dès maintenant.
            <br />
            <span className="text-gray-400 font-normal text-sm">
              Des milliers de produits africains vous attendent.
            </span>
          </p>
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#E67E22] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_8px_30px_-8px_rgba(230,126,34,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(230,126,34,0.8)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Explorer les Produits
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
