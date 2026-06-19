'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // On peut logger l'erreur ici vers un service externe (Sentry, etc.)
    console.error('Next.js Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#022c22] transition-colors duration-500">
      <div className="max-w-md w-full glass-card p-10 rounded-[3rem] shadow-2xl border-0 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="size-24 bg-red-100 dark:bg-red-900/30 rounded-4xl flex items-center justify-center mx-auto text-red-600 dark:text-red-400 shadow-inner">
          <span className="material-symbols-outlined text-5xl">warning</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Une erreur critique est survenue
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Nous ne sommes pas en mesure de charger cette page pour le moment.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full h-16 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">restart_alt</span>
            Tenter de recharger
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full h-16 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all uppercase tracking-widest text-sm"
          >
            Retour à lapage accueil

          </button>
        </div>
      </div>
    </div>
  );
}
