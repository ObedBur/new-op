"use client";

import React from 'react';

interface PageLoaderProps {
  label?: string;
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ label = 'Chargement...', className = '' }) => (
  <div
    role="status"
    aria-live="polite"
    className={`flex min-h-screen flex-col items-center justify-center gap-5 bg-background text-foreground ${className}`}
  >
    <div className="size-12 animate-spin rounded-full border-4 border-[#E67E22] border-t-transparent" />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
      {label}
    </span>
  </div>
);
