import React from "react";

// On renomme EmboitementSteps en HowItWorks et on accepte les props attendues
export const HowItWorks = ({ steps }: any) => {
  return (
    <section className="py-20 px-4 bg-white dark:bg-black">
      <div className="container mx-auto max-w-7xl">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            Comment ça <span className="text-[#E67E22]">marche</span> ?
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
              Trouvez vos produits
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Explorez notre catalogue et ajoutez vos coups de cœur au panier.
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
              Achetez simplement
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Validez votre commande. Le vendeur est immédiatement alerté.
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
              Suivi en temps réel
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Suivez l'état de votre colis et discutez avec le vendeur sur WhatsApp.
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
              Recevez et profitez
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Réceptionnez vos achats en toute confiance et sécurité.
            </p>
            <div className="w-12 h-1 border-b-2 border-dashed border-slate-300 dark:border-slate-600 mt-4" />
          </div>

        </div>
      </div>
    </section>
  );
};
