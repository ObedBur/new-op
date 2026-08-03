'use client';

import React, { useState } from 'react';
import { Plus, X, Lock, Truck, ShieldCheck, Headphones, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '@/i18n/useT';

export const WhyChooseUs = () => {
  const { t } = useT();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    {
      icon: <Lock className="text-[#E67E22]" size={24} strokeWidth={2} />,
      title: t('home.whyChooseUs.items.paymentTitle'),
      content: t('home.whyChooseUs.items.paymentContent'),
    },
    {
      icon: <Truck className="text-[#E67E22]" size={24} strokeWidth={2} />,
      title: t('home.whyChooseUs.items.deliveryTitle'),
      content: t('home.whyChooseUs.items.deliveryContent'),
    },
    {
      icon: <ShieldCheck className="text-[#E67E22]" size={24} strokeWidth={2} />,
      title: t('home.whyChooseUs.items.verifiedTitle'),
      content: t('home.whyChooseUs.items.verifiedContent'),
    },
    {
      icon: <Headphones className="text-[#E67E22]" size={24} strokeWidth={2} />,
      title: t('home.whyChooseUs.items.supportTitle'),
      content: t('home.whyChooseUs.items.supportContent'),
    },
    {
      icon: <Globe className="text-[#E67E22]" size={24} strokeWidth={2} />,
      title: t('home.whyChooseUs.items.localTitle'),
      content: t('home.whyChooseUs.items.localContent'),
    },
  ];

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-24 px-4 bg-white dark:bg-black relative overflow-hidden">
      {/* Subtle decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E67E22] rounded-full blur-[140px] opacity-[0.06] dark:opacity-[0.10] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2D5A27] rounded-full blur-[140px] opacity-[0.06] dark:opacity-[0.10] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#E67E22] mb-4">
            {t('home.whyChooseUs.pretitle')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            {t('home.whyChooseUs.title')}{' '}
            <span className="text-[#E67E22]">{t('home.whyChooseUs.titleHighlight')}</span>&nbsp;?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            {t('home.whyChooseUs.description')}
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="space-y-3"
        >
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#E67E22]/50 bg-[#E67E22]/5 dark:bg-[#E67E22]/[0.07] shadow-lg shadow-[#E67E22]/10'
                    : 'border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/[0.12]'
                }`}
              >
                {/* Row header */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl select-none">{item.icon}</span>
                    <span className={`text-base font-bold transition-colors duration-200 ${
                      isOpen
                        ? 'text-[#E67E22]'
                        : 'text-slate-900 dark:text-white group-hover:text-[#E67E22]'
                    }`}>
                      {item.title}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-200 ${
                      isOpen
                        ? 'bg-[#E67E22] border-[#E67E22] text-white'
                        : 'bg-white dark:bg-white/[0.06] border-slate-200 dark:border-white/[0.10] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </motion.div>
                </button>

                {/* Collapsible content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <p className="px-6 pb-6 pt-0 text-sm leading-relaxed text-slate-600 dark:text-slate-400 pl-[4.25rem]">
                        {item.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
