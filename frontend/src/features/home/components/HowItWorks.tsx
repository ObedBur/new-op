import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    tag: 'La Découverte',
    title: 'Trouvez la perle rare',
    description: 'Explorez le marché local depuis votre téléphone. Que ce soit des produits de la ferme, de l&apos;artisanat ou de la mode, tout est à portée de main.',
    icon: 'storefront',
    color: 'from-orange-400 to-primary'
  },
  {
    tag: 'Le Contact',
    title: 'Échangez en direct',
    description: 'Pas d&apos;intermédiaire. Discutez directement avec le vendeur sur WhatsApp. Posez vos questions, négociez et validez la qualité.',
    icon: 'forum',
    color: 'from-emerald-400 to-emerald-600'
  }/* ,
  {
    tag: 'La Rencontre',
    title: 'Recevez et vérifiez',
    description: 'Rencontrez le vendeur, touchez le produit, vérifiez sa qualité. Payez en toute confiance uniquement quand vous êtes satisfait.',
    icon: 'handshake',
    color: 'from-blue-400 to-blue-600'
  } */
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-white dark:bg-[#0c0c0c] overflow-hidden">
      {/* Background Decorative - Neutral & Subtle Sand */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#DDB88C]/5 rounded-full blur-[80px] -rotate-12 translate-x-1/2" />

      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Left Side: Narrative Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#E67E22] font-black uppercase tracking-[0.3em] text-xs mb-4">Notre Philosophie</h3>
              <h2 className="text-4xl md:text-6xl font-black text-[#2D5A27] dark:text-white leading-[1.1] tracking-tighter">
                Le commerce est avant tout <br /> une <span className="text-[#E67E22]">histoire humaine.</span>
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mt-6 leading-relaxed max-w-xl">
                Oubliez les processus complexes. Nous avons digitalisé le "bouche-à-oreille" pour vous offrir la simplicité du marché traditionnel avec la puissance du numérique.
              </p>
            </motion.div>
          </div>

          {/* Right Side: Visual Narrative Steps */}
          <div className="w-full lg:w-1/2 relative">
            <div className="space-y-12">
              {STEPS.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex gap-6 md:gap-8 group"
                >
                  <div className="flex flex-col items-center">
                    <div className={`size-16 md:size-20 rounded-2xl bg-white dark:bg-white/5 border border-[#DDB88C]/50 dark:border-white/10 shadow-lg shadow-black/5 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                      <span className={`text-3xl md:text-4xl font-black bg-linear-to-br ${step.color} bg-clip-text text-transparent`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    {index !== STEPS.length - 1 && (
                      <div className="w-0.5 flex-1 bg-linear-to-b from-[#DDB88C]/30 via-[#DDB88C]/10 to-transparent my-4" />
                    )}
                  </div>

                  <div className="pt-2 pb-8">
                    <span className="text-[10px] font-black text-[#E67E22] uppercase tracking-[0.2em]">{step.tag}</span>
                    <h3 className="text-xl md:text-2xl font-black text-[#2D5A27] dark:text-white mt-1 mb-3">{step.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Third human step (Handshake) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex gap-6 md:gap-8 group"
              >
                <div className="flex flex-col items-center">
                  <div className={`size-16 md:size-20 rounded-2xl bg-[#E67E22] text-white shadow-xl shadow-[#E67E22]/20 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                    <span className="text-3xl md:text-4xl font-black">03</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-black text-[#E67E22] uppercase tracking-[0.2em]">La Rencontre</span>
                  <h3 className="text-xl md:text-2xl font-black text-[#2D5A27] dark:text-white mt-1 mb-3">Recevez et vérifiez</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md">
                    C&apos;est ici que l&apos;humain reprend ses droits. Rencontrez le vendeur, vérifiez votre produit et payez uniquement si vous êtes satisfait.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

