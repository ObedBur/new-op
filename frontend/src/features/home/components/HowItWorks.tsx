import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { HowItWorksStep } from "../services/content.service";

const STEP_GRADIENTS = [
  "from-orange-400 to-primary",
  "from-emerald-400 to-emerald-600",
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
] as const;

type RowBadge = "gradient-number" | "solid-number" | "icon-on-gradient";

type DisplayRow = {
  key: string;
  tag: string;
  title: string;
  description: string;
  gradient: string;
  badge: RowBadge;
  materialIcon?: string;
};

const FALLBACK_ROWS: DisplayRow[] = [
  {
    key: "fallback-1",
    tag: "La Découverte",
    title: "Trouvez la perle rare",
    description:
      "Explorez le marché local depuis votre téléphone. Produits de la ferme, artisanat ou mode : tout est à portée de main.",
    gradient: STEP_GRADIENTS[0],
    badge: "gradient-number",
  },
  {
    key: "fallback-2",
    tag: "Le Contact",
    title: "Échangez en direct",
    description:
      "Pas d'intermédiaire. Discutez avec le vendeur sur WhatsApp, posez vos questions et validez la qualité.",
    gradient: STEP_GRADIENTS[1],
    badge: "gradient-number",
  },
  {
    key: "fallback-3",
    tag: "La Rencontre",
    title: "Recevez et vérifiez",
    description:
      "C'est ici que l'humain reprend ses droits. Rencontrez le vendeur, vérifiez votre produit et payez uniquement si vous êtes satisfait.",
    gradient: STEP_GRADIENTS[2],
    badge: "solid-number",
  },
];

function rowsFromApi(steps: HowItWorksStep[]): DisplayRow[] {
  return steps.map((s, i) => ({
    key: s.id,
    tag: `Étape ${String(i + 1).padStart(2, "0")}`,
    title: s.title,
    description: s.description,
    gradient: STEP_GRADIENTS[i % STEP_GRADIENTS.length],
    badge: s.icon ? "icon-on-gradient" : "gradient-number",
    materialIcon: s.icon || undefined,
  }));
}

function StepBadge({
  index,
  row,
}: {
  index: number;
  row: DisplayRow;
}) {
  const n = String(index + 1).padStart(2, "0");

  if (row.badge === "solid-number") {
    return (
      <div className="size-16 md:size-20 rounded-2xl bg-[#E67E22] text-white shadow-xl shadow-[#E67E22]/20 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500">
        <span className="text-3xl md:text-4xl font-black">{n}</span>
      </div>
    );
  }

  if (row.badge === "icon-on-gradient" && row.materialIcon) {
    return (
      <div
        className={`size-16 md:size-20 rounded-2xl bg-linear-to-br ${row.gradient} shadow-lg shadow-black/10 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500`}
      >
        <span
          className="material-symbols-outlined text-3xl md:text-4xl text-white select-none"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}
        >
          {row.materialIcon}
        </span>
      </div>
    );
  }

  return (
    <div className="size-16 md:size-20 rounded-2xl bg-white dark:bg-white/5 border border-[#DDB88C]/50 dark:border-white/10 shadow-lg shadow-black/5 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500">
      <span
        className={`text-3xl md:text-4xl font-black bg-linear-to-br ${row.gradient} bg-clip-text text-transparent`}
      >
        {n}
      </span>
    </div>
  );
}

export interface HowItWorksProps {
  /** Étapes depuis l’API `/content/homepage` ; si vide, contenu par défaut. */
  steps?: HowItWorksStep[];
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ steps = [] }) => {
  const rows = useMemo(
    () => (steps.length > 0 ? rowsFromApi(steps) : FALLBACK_ROWS),
    [steps],
  );

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-32 bg-white dark:bg-[#0c0c0c] overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#DDB88C]/5 rounded-full blur-[80px] -rotate-12 translate-x-1/2" />

      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#E67E22] font-black uppercase tracking-[0.3em] text-xs mb-4">
                Notre Philosophie
              </h3>
              <h2 className="text-4xl md:text-6xl font-black text-[#2D5A27] dark:text-white leading-[1.1] tracking-tighter">
                Le commerce est avant tout <br /> une{" "}
                <span className="text-[#E67E22]">histoire humaine.</span>
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mt-6 leading-relaxed max-w-xl">
                Oubliez les processus complexes. Nous avons digitalisé le
                &quot;bouche-à-oreille&quot; pour vous offrir la simplicité du
                marché traditionnel avec la puissance du numérique.
              </p>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="space-y-12">
              {rows.map((row, index) => (
                <motion.div
                  key={row.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex gap-6 md:gap-8 group"
                >
                  <div className="flex flex-col items-center">
                    <StepBadge index={index} row={row} />
                    {index !== rows.length - 1 && (
                      <div className="w-0.5 flex-1 bg-linear-to-b from-[#DDB88C]/30 via-[#DDB88C]/10 to-transparent my-4" />
                    )}
                  </div>

                  <div className="pt-2 pb-8">
                    <span className="text-[10px] font-black text-[#E67E22] uppercase tracking-[0.2em]">
                      {row.tag}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-[#2D5A27] dark:text-white mt-1 mb-3">
                      {row.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md">
                      {row.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
