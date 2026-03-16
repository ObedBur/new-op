'use client';

import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  isVisible: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Bienvenue sur WapiBei",
    "Chargement du marketplace Africain",
    "Préparation des vendeurs du continent",
    "Sécurisation de vos achats",
    "Prêt dans un instant..."
  ];

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 800);
    return () => clearInterval(interval);
  }, [isVisible, messages.length]);

  return (
    <div 
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white 
      transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
    >
      <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
        
        <div className="relative mb-8 group">
          <div className="flex items-center justify-center size-24 md:size-28 rounded-[2.5rem] bg-primary text-white shadow-2xl shadow-primary/30 animate-[heartbeat_2.5s_ease-in-out_infinite]">
            <span className="material-symbols-outlined text-[48px] md:text-[54px] select-none">storefront</span>
          </div>
          <div className="absolute -inset-2 border border-primary/10 rounded-[3rem] animate-[ping_3s_infinite_linear] opacity-30"></div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-800 leading-none">
            Wapi<span className="text-primary">Bei</span>
          </h1>
          
          <div className="h-6 relative overflow-hidden flex justify-center w-64">
             {messages.map((msg, idx) => (
                <p 
                  key={idx}
                  className={`absolute inset-0 text-center text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] transition-all duration-500 ease-out transform
                  ${idx === messageIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  {msg}
                </p>
             ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <div className="size-2 bg-primary rounded-full animate-[pulse_1.5s_infinite_ease-in-out] [animation-delay:-0.3s]"></div>
          <div className="size-2 bg-primary rounded-full animate-[pulse_1.5s_infinite_ease-in-out] [animation-delay:-0.15s]"></div>
          <div className="size-2 bg-primary rounded-full animate-[pulse_1.5s_infinite_ease-in-out]"></div>
        </div>
        <div className="flex items-center gap-2 opacity-30">
            <span className="h-px w-8 bg-slate-300"></span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Marketplace Afrique</span>
            <span className="h-px w-8 bg-slate-300"></span>
        </div>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

