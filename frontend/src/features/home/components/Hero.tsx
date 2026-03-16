"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSlide } from "../services/content.service";

interface HeroSlideshowProps {
  slides: HeroSlide[];
}

const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds for a more relaxed feel
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full h-full min-h-[350px] md:min-h-[500px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/10 bg-gray-100 dark:bg-white/5 flex items-center justify-center">
        <p className="text-gray-400 font-medium">Initialisation du visuel...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[350px] md:min-h-[500px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/10 group bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Ken Burns Effect Image */}
          <motion.div
            initial={{ scale: 1.2, rotate: 1 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentIndex].imageUrl}
              alt={slides[currentIndex].title}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

          {/* Content Animation */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="max-w-md"
            >
              {slides[currentIndex].label && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Badge className="mb-4 bg-primary/20 backdrop-blur-md border-primary/30 text-primary-foreground">
                    {slides[currentIndex].label}
                  </Badge>
                </motion.div>
              )}

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-2xl md:text-5xl font-black text-white leading-[1.1] tracking-tight"
              >
                {slides[currentIndex].title}
              </motion.h3>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex items-center gap-3 mt-4"
              >
                <div className="h-px w-8 bg-primary/50" />
                <p className="text-white/70 text-xs md:text-sm font-bold uppercase tracking-widest">
                  WapiBei Exclusive
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-8 z-30 flex gap-1.5 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="group relative"
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-700 ${index === currentIndex ? "w-8 bg-primary shadow-sm shadow-primary/50" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface HeroProps {
  slides: HeroSlide[];
}

const LOCAL_SLIDES: HeroSlide[] = [
  { id: 'slide-1', title: "L'excellence à portée de main", imageUrl: '/hero/slide1.png', label: 'PREMIUM' },
  { id: 'slide-2', title: "L'élégance du détail", imageUrl: '/hero/slide2.png', label: 'LUXE' },
  { id: 'slide-3', title: "Qualité supérieure", imageUrl: '/hero/slide3.png', label: 'QUALITÉ' },
  { id: 'slide-4', title: "Le meilleur choix", imageUrl: '/hero/slide4.png', label: 'SÉLECTION' },
  { id: 'slide-5', title: "Style & Confort", imageUrl: '/hero/slide5.png', label: 'MODERNE' },
];

export const Hero: React.FC<HeroProps> = ({ slides }) => {
  // On utilise TOUJOURS les 5 images locales demandées
  const activeSlides = LOCAL_SLIDES;

  return (
    <section className="relative px-4 py-12 md:py-20 lg:py-24 container mx-auto max-w-7xl overflow-hidden">
      <div className="absolute inset-0 bg-grid-tech radial-mask -z-20 opacity-40 pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tighter text-deep-blue dark:text-white">
              <span className="text-[#E67E22]">Les meilleures produits des</span> <br />
              <span className="relative inline-block">
                {/* Conteneur pour l'effet d'écriture et le changement de couleurs fluide */}
                <motion.span
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                      },
                    },
                  }}
                  className="relative z-10"
                >
                  {"africaines".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
                        visible: {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          color: ["#0f7a01ff", "#3e8135ff", "#2D5A27", "#1E3D1A"],
                          transition: {
                            opacity: { duration: 0.5 },
                            y: { duration: 0.5 },
                            filter: { duration: 0.5 },
                            color: {
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear",
                              delay: index * 0.1,
                            },
                          },
                        },
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>

                {/* SVG qui se dessine tout seul avec un mouvement fluide */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2 pointer-events-none"
                  viewBox="0 0 200 20"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: 1,
                      stroke: ["#E67E22", "#F39C12", "#D35400", "#E67E22"],
                    }}
                    transition={{
                      pathLength: {
                        delay: 1.2,
                        duration: 1.5,
                        ease: "easeInOut",
                      },
                      opacity: { delay: 1.2, duration: 1.5, ease: "easeInOut" },
                      stroke: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 1.2,
                      },
                    }}
                    d="M5 15Q100 0 195 15"
                    stroke="#E67E22"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              <br className="hidden md:block" />
              au juste prix.
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 pt-4">
              Comparez les prix des produits agricoles, high-tech et mode à
              travers toute l&apos;Afrique. Contactez les vendeurs locaux sans
              frais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {/* Bouton Principal avec Shimmer et Rebond Spring */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group h-14 px-8 rounded-xl bg-[#E67E22] text-white font-bold overflow-hidden transition-all shadow-lg hover:shadow-[#E67E22]/40"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explorer les produits
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </span>

              {/* L'effet de brillance (Shimmer) */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 transition-transform bg-linear-to-r from-transparent via-white/30 to-transparent" />
            </motion.button>

            {/* Bouton Secondaire avec Inversion de couleur au Hover */}
            <motion.button
              whileHover={{ y: -2 }}
              className="h-14 px-8 rounded-xl border-2 border-[#2D5A27]/20 text-[#2D5A27] font-bold hover:bg-[#2D5A27] hover:text-white dark:border-white/10 dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
            >
              Devenir vendeur
            </motion.button>
          </div>
        </div>

        <div className="relative w-full animate-in zoom-in fade-in duration-1000">
          <HeroSlideshow slides={activeSlides} />
          <div className="absolute -z-10 -top-6 -right-6 size-48 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -z-10 -bottom-10 -left-10 size-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};
