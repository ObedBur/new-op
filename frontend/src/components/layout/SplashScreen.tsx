
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Bienvenue sur WapiBei",
    "Chargement du marketplace Africain",
    "Préparation des vendeurs du continent",
    "Sécurisation de vos achats",
    "Prêt dans un instant..."
  ];

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 3 seconds splash

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 600);

    return () => {
      clearTimeout(splashTimer);
      clearInterval(messageInterval);
    };
  }, [messages.length]);

  return (
    <div 
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white 
      transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]
      ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-gray-50/50 to-transparent"></div>
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Logo Container with Glow */}
        <div className="relative mb-12 animate-in fade-in zoom-in-95 duration-1000">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl animate-pulse"></div>
          
          {/* Main Logo Card */}
          <div className="relative flex items-center justify-center size-24 md:size-32 rounded-[2.5rem] bg-white p-6 shadow-[0_20px_50px_rgba(255,107,0,0.15)] border border-primary/10 animate-float">
            <Image 
              src="/favicon.ico" 
              alt="WapiBei Logo" 
              width={128} 
              height={128} 
              className="w-full h-full object-contain" 
            />
          </div>
          
          {/* Decorative Ring */}
          <div className="absolute -inset-2 border-2 border-primary/5 rounded-[3.5rem] animate-[spin_8s_linear_infinite]"></div>
        </div>

        <div className="text-center space-y-6">
          <div className="overflow-hidden">
            <h1 className="text-5xl md:text-6xl font-black tracking-[-0.05em] text-slate-900 leading-none animate-in slide-in-from-bottom-full duration-700">
              Wapi<span className="text-primary italic">Bei</span>
            </h1>
          </div>
          
          <div className="h-8 relative flex justify-center w-72 mx-auto">
             {messages.map((msg, idx) => (
                <p 
                  key={idx}
                  className={`absolute inset-0 text-center text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.3em] transition-all duration-700 ease-in-out
                  ${idx === messageIndex ? 'opacity-100 blur-none scale-100' : 'opacity-0 blur-sm scale-90 translate-y-2'}`}
                >
                  {msg}
                </p>
             ))}
          </div>
        </div>
      </div>

      {/* Modern Progress Bar */}
      <div className="absolute bottom-16 w-48 h-[2px] bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((messageIndex + 1) / messages.length) * 100}%` }}
        ></div>
      </div>

      <div className="absolute bottom-8 opacity-40">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Marketplace Afrique</p>
      </div>
    </div>
  );
};
