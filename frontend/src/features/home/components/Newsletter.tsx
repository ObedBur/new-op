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
    <section className="py-24 px-4 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-[#0f1115] dark:bg-[#0a0a0a] border border-[#222] shadow-2xl shadow-[#E67E22]/10"
        >
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E67E22] rounded-full blur-[120px] opacity-[0.15] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#E67E22] rounded-full blur-[120px] opacity-[0.15] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 p-10 md:p-16">
            {/* Text */}
            <div className="text-white max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-bold tracking-wide text-white mb-6">
                <Sparkles size={14} className="text-[#E67E22]" />
                {t('home.newsletter.badge')}
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                {t('home.newsletter.title')}{' '}
                <span className="text-[#E67E22]">{t('home.newsletter.titleHighlight')}</span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                {t('home.newsletter.description')}
              </p>
            </div>

            {/* Form */}
            <div className="w-full md:w-auto flex-1 max-w-md">
              <form onSubmit={handleSubscribe} className="w-full">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    placeholder={t('home.newsletter.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-slate-400 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-all text-sm"
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#E67E22] hover:bg-orange-600 disabled:opacity-70 rounded-full flex items-center justify-center text-white transition-colors shadow-lg shrink-0 cursor-pointer"
                  >
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <Send size={16} className="-ml-0.5" />
                    }
                  </motion.button>
                </div>
                <p className="text-center md:text-left text-xs text-slate-400 mt-3 pl-2">
                  {t('home.newsletter.noSpam')}
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
