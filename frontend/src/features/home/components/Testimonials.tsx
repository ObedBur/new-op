'use client';

import React, { useState } from 'react';
import { Star, Quote, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useT } from '@/i18n/useT';

export const Testimonials = () => {
  const { user } = useAuth();
  const { t } = useT();

  const initialTestimonials = [
    {
      name: 'Sophie M.',
      role: t('home.testimonials.mock.t1Role'),
      content: t('home.testimonials.mock.t1Content'),
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=47',
      accent: '#E67E22',
    },
    {
      name: 'Marc D.',
      role: t('home.testimonials.mock.t2Role'),
      content: t('home.testimonials.mock.t2Content'),
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=11',
      accent: '#2D5A27',
    },
    {
      name: 'Aline K.',
      role: t('home.testimonials.mock.t3Role'),
      content: t('home.testimonials.mock.t3Content'),
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=32',
      accent: '#E67E22',
    },
    {
      name: 'Julien T.',
      role: t('home.testimonials.mock.t4Role'),
      content: t('home.testimonials.mock.t4Content'),
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=60',
      accent: '#2D5A27',
    }
  ];

  const [localTestimonials, setLocalTestimonials] = useState(initialTestimonials);
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newTestimonial = {
      name: user?.fullName || email.split('@')[0] || t('home.testimonials.visitor'),
      role: user?.role === 'VENDOR' ? t('home.testimonials.vendor') : t('home.testimonials.client'),
      content: comment,
      rating: 5,
      avatar: user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || email || 'V')}&background=random`,
      accent: '#E67E22',
    };

    // On ajoute le nouveau commentaire à l'état local
    setLocalTestimonials([newTestimonial, ...localTestimonials]);
    setComment('');
    setEmail('');
    toast.success(t('home.testimonials.success'));
  };

  // On duplique le tableau pour créer l'effet de boucle infinie sans coupure
  const duplicatedItems = [...localTestimonials, ...localTestimonials];

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#0a0a0a] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2D5A27]/5 via-transparent to-transparent dark:from-[#2D5A27]/10 pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#2D5A27] mb-4">
            {t('home.testimonials.pretitle')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            {t('home.testimonials.title')}{' '}
            <span className="text-[#2D5A27]">{t('home.testimonials.titleHighlight')}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {t('home.testimonials.description')}
          </p>
        </motion.div>

        {/* Marquee Infini */}
        <div className="relative w-full flex overflow-hidden group">
          {/* Gradient masks pour adoucir les bords */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-48 z-10 bg-gradient-to-r from-slate-50 dark:from-[#0a0a0a] to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-48 z-10 bg-gradient-to-l from-slate-50 dark:from-[#0a0a0a] to-transparent pointer-events-none" />
          
          <motion.div
            className="flex gap-6 w-max hover:[animation-play-state:paused]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: localTestimonials.length * 8, ease: "linear", repeat: Infinity }}
          >
            {duplicatedItems.map((t, i) => (
              <div
                key={i}
                className="w-[300px] md:w-[380px] shrink-0 relative flex flex-col bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.07] rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Quote
                  size={48}
                  className="absolute top-4 right-4 opacity-[0.05] dark:opacity-[0.07]"
                  style={{ color: t.accent }}
                />

                <div className="flex items-center gap-1 mb-5">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} size={14} fill="#E67E22" color="#E67E22" />
                  ))}
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed flex-1 mb-8 italic whitespace-normal">
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div
                    className="relative w-12 h-12 rounded-full overflow-hidden ring-2 shrink-0"
                    style={{ '--tw-ring-color': t.accent } as React.CSSProperties}
                  >
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Formulaire pour ajouter un avis */}
        <div className="max-w-2xl mx-auto mt-24">
          <div className="bg-white dark:bg-[#111] border border-slate-100 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t('home.testimonials.formTitle')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('home.testimonials.formDesc')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!user && (
                <div>
                  <input
                    type="email"
                    placeholder={t('home.testimonials.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] dark:text-white"
                    required
                  />
                </div>
              )}
              
              <div className="relative">
                <textarea
                  placeholder={t('home.testimonials.messagePlaceholder')}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] dark:text-white resize-none"
                  required
                />
                <button
                  type="submit"
                  className="absolute bottom-3 right-3 bg-[#E67E22] hover:bg-[#d6711a] text-white p-2 rounded-lg transition-colors flex items-center justify-center shadow-md shadow-[#E67E22]/20"
                >
                  <Send size={16} />
                </button>
              </div>
              
              {user && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden relative border border-slate-200 dark:border-white/10">
                    <Image src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}`} alt="Avatar" fill className="object-cover" unoptimized />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {t('home.testimonials.commentAs')} <strong className="text-slate-900 dark:text-white">{user.fullName}</strong>
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
