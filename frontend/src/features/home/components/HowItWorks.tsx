import React from "react";
import { useT } from "@/i18n/useT";

// On renomme EmboitementSteps en HowItWorks et on accepte les props attendues
export const HowItWorks = ({ steps }: any) => {
  const { t } = useT();
  return (
    <section className="py-20 px-4 bg-white dark:bg-black">
      <div className="container mx-auto max-w-7xl">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            {t('home.howItWorks.title')} <span className="text-[#E67E22]">{t('home.howItWorks.titleHighlight')}</span> ?
          </h2>
        </div>
        
        {/* Grille 2x2. Sur mobile (colonne simple), on désactive les découpes pour la lisibilité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {/* ÉTAPE 01 : En haut à gauche | Pointe vers la droite */}
          <div className="
            md:col-start-1 md:row-start-1
            md:[clip-path:polygon(0%_0%,calc(100%-24px)_0%,100%_50%,calc(100%-24px)_100%,0%_100%)]
            bg-slate-100 dark:bg-slate-800/50 p-8 md:pr-12 min-h-[220px] rounded-xl md:rounded-none
            flex flex-col justify-center
          ">
            <h3 className="text-4xl sm:text-5xl font-black text-[#E67E22] mb-2">01</h3>
            <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {t('home.howItWorks.steps.step1Title')}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t('home.howItWorks.steps.step1Desc')}
            </p>
            <div className="w-12 h-1 border-b-2 border-dashed border-slate-300 dark:border-slate-600 mt-4" />
          </div>

          {/* ÉTAPE 02 : En haut à droite | Reçoit à gauche, Pointe vers le bas */}
          <div className="
            md:col-start-2 md:row-start-1
            md:[clip-path:polygon(0%_0%,100%_0%,100%_calc(100%-24px),50%_100%,0%_calc(100%-24px),24px_50%)]
            bg-slate-100 dark:bg-slate-800/50 p-8 md:pl-12 md:pb-12 min-h-[220px] rounded-xl md:rounded-none
            flex flex-col justify-center
          ">
            <h3 className="text-4xl sm:text-5xl font-black text-[#E67E22] mb-2">02</h3>
            <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {t('home.howItWorks.steps.step2Title')}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t('home.howItWorks.steps.step2Desc')}
            </p>
            <div className="w-12 h-1 border-b-2 border-dashed border-slate-300 dark:border-slate-600 mt-4" />
          </div>

          {/* ÉTAPE 03 : En bas à droite | Reçoit en haut, Pointe vers la gauche */}
          <div className="
            md:col-start-2 md:row-start-2
            md:[clip-path:polygon(24px_0%,50%_24px,100%_0%,100%_100%,24px_100%,0%_50%)]
            bg-slate-100 dark:bg-slate-800/50 p-8 md:pl-12 md:pt-12 min-h-[220px] rounded-xl md:rounded-none
            flex flex-col justify-center
          ">
            <h3 className="text-4xl sm:text-5xl font-black text-[#E67E22] mb-2">03</h3>
            <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {t('home.howItWorks.steps.step3Title')}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t('home.howItWorks.steps.step3Desc')}
            </p>
            <div className="w-12 h-1 border-b-2 border-dashed border-slate-300 dark:border-slate-600 mt-4" />
          </div>

          {/* ÉTAPE 04 : En bas à gauche | Reçoit à droite */}
          <div className="
            md:col-start-1 md:row-start-2
            md:[clip-path:polygon(0%_0%,100%_0%,calc(100%-24px)_50%,100%_100%,0%_100%)]
            bg-slate-100 dark:bg-slate-800/50 p-8 md:pr-12 min-h-[220px] rounded-xl md:rounded-none
            flex flex-col justify-center
          ">
            <h3 className="text-4xl sm:text-5xl font-black text-[#E67E22] mb-2">04</h3>
            <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {t('home.howItWorks.steps.step4Title')}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t('home.howItWorks.steps.step4Desc')}
            </p>
            <div className="w-12 h-1 border-b-2 border-dashed border-slate-300 dark:border-slate-600 mt-4" />
          </div>

        </div>
      </div>
    </section>
  );
};
