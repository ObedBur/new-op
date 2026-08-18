'use client';

import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useT } from '@/i18n/useT';

export const Newsletter = () => {
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulation
    toast.success(t('home.newsletter.success'));
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Fond gradient distinctif */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E67E22] via-[#d4691a] to-[#2D5A27]" />
      {/* Motif géométrique en overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Blob décoratif */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16"
        >
          {/* Text */}
          <div className="text-white max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 text-xs font-black tracking-wide text-white mb-5">
              <Sparkles size={14} />
              {t('home.newsletter.badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3 leading-tight tracking-tight">
              {t('home.newsletter.title')}{' '}
              <span className="underline decoration-white/40 underline-offset-4">{t('home.newsletter.titleHighlight')}</span>
            </h2>
            <p className="text-white/80 text-base leading-relaxed">
              {t('home.newsletter.description')}
            </p>
          </div>

          {/* Form */}
          <div className="w-full md:w-auto flex-1 max-w-md">
            <div className="w-full relative flex flex-col gap-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  disabled
                  placeholder="Newsletter (Bientôt disponible)"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-full py-4 pl-6 pr-6 cursor-not-allowed transition-all text-sm backdrop-blur-sm"
                />
              </div>
              <p className="text-center md:text-left text-xs text-white/50 pl-2">
                Nous préparons un nouveau système de newsletter. Restez à l'écoute !
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
