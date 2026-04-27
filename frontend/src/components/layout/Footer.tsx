"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image';


// --- Données externalisées pour plus de clarté ---
const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Produits", href: "/products" },
  { label: "Vendeurs", href: "/sellers" },
  { label: "Comment ça marche", href: "/#how-it-works" },
  { label: "Tarifs", href: "/pricing" },
];

const SECTORS = ["Agricole", "High-Tech", "Mode & Style", "Boutique Express", "Services & Travaux"];

// --- Sous-composant pour éviter la répétition ---
const FooterLink = ({ href, label, dotColor = "bg-[#E67E22]/30" }: { href: string; label: string; dotColor?: string }) => (
  <li>
    <Link href={href} className="text-sm font-bold text-slate-600 hover:text-[#E67E22] transition-colors flex items-center gap-2 group">
      <span className={`size-1 rounded-full group-hover:bg-[#E67E22] transition-colors ${dotColor}`}></span>
      {label}
    </Link>
  </li>
);

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-otp"];

  if (authPaths.some((path) => pathname?.startsWith(path))) return null;

  return (
    <footer className="bg-slate-50 text-slate-900 pt-24 pb-12 border-t border-slate-200 mt-auto relative overflow-hidden">
      {/* Effets de fond */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E67E22]/20 to-transparent" />
      <div className="absolute -top-64 -right-64 w-[500px] h-[500px] bg-[#E67E22]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">

          {/* Logo & Slogan (Col 4) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center size-25  rounded-[1.5rem] bg-white p-6  animate-float">
                <Image
                  src="/shopping-cart.png"
                  alt="WapiBei Shopping Cart"
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <h2 className="text-3xl font-black tracking-tighter">Wapi<span className="text-[#E67E22]">Bei</span></h2>
            </div>
            <p className="text-slate-600 text-base leading-relaxed font-medium max-w-sm">
              La Marketplace de confiance en Afrique. Connectez-vous aux meilleurs commerçants.
            </p>
          </div>

          {/* Navigation (Col 2) */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#E67E22]">Navigation</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => <FooterLink key={link.label} {...link} />)}
            </ul>
          </div>

          {/* Secteurs (Col 3) */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#E67E22]">Secteurs</h4>
            <ul className="space-y-4">
              {SECTORS.map((s) => <FooterLink key={s} label={s} href={`/products?category=${s}`} dotColor="bg-slate-300" />)}
            </ul>
          </div>

          {/* Contact (Col 3) */}
          <div className="lg:col-span-3 space-y-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#E67E22]">Service Client</h4>
            <ContactItem icon="call" label="Téléphone" value="+243 999 123 456" />
            <ContactItem icon="alternate_email" label="Email Support" value="contact@wapibei.cd" />
          </div>
        </div>

        {/* Bottom bar simplifiée */}
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <p>© 2026 WapiBei Marketplace.</p>
          <div className="flex gap-8 font-black uppercase tracking-widest text-slate-400">
            <Link href="/privacy" className="hover:text-[#E67E22]">Légal</Link>
            <Link href="/terms" className="hover:text-[#E67E22]">Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Petit composant utilitaire pour le contact
const ContactItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="flex items-start gap-4">
    <span className="material-symbols-outlined text-[#E67E22]">{icon}</span>
    <div>
      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-black text-slate-900">{value}</p>
    </div>
  </div>
);