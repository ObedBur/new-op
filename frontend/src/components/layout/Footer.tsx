"use client";

import React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ].some((path) => pathname?.startsWith(path));

  if (isAuthPage) return null;

  const socialLinks = [
    {
      name: "Facebook",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16.32a4.158 4.158 0 110-8.317 4.158 4.158 0 010 8.317zm4.961-10.405a1.44 1.44 0 112.88 0 1.44 1.44 0 01-2.88 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "X",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31 0 2.591.317 3.723.88l-.242 3.969c-1.202-.663-2.561-1.011-3.948-.993v3.918c1.554.004 3.036.564 4.186 1.583a6.164 6.164 0 011.938 4.6c-.004 1.638-.636 3.212-1.765 4.399a6.203 6.203 0 01-4.414 1.864c-1.642.001-3.219-.647-4.401-1.809a6.233 6.233 0 01-1.83-4.444c.002-1.636.654-3.204 1.819-4.382a6.202 6.202 0 014.436-1.803V0c-.171 0-.342.002-.513.007V4.02c-1.353 0-2.671.328-3.854.954-1.182.625-2.186 1.547-2.91 2.676a7.283 7.283 0 00-1.015 3.738c0 1.348.336 2.675.975 3.86a7.311 7.311 0 002.695 2.766 7.336 7.336 0 003.852.996c1.348-.001 2.674-.339 3.859-.982a7.312 7.312 0 002.76-2.696 7.337 7.337 0 00.992-3.857c0-.083-.001-.167-.004-.251A10.134 10.134 0 0024 7.23V3.126c-1.24.475-2.556.744-3.896.799V.02h-7.579z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-slate-50 text-slate-900 pt-24 pb-12 border-t border-slate-200 mt-auto relative overflow-hidden">
      {/* Subtle patterns for a clean "Light" pro look */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E67E22]/20 to-transparent"></div>
      <div className="absolute -top-64 -right-64 w-[500px] h-[500px] bg-[#E67E22]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-12 rounded-2xl bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/20">
                <span className="material-symbols-outlined text-[28px]">
                  storefront
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-slate-900">
                Wapi<span className="text-[#E67E22]">Bei</span>
              </h2>
            </div>
            <p className="text-slate-600 text-base leading-relaxed font-medium max-w-sm">
              La Marketplace de confiance en Afrique. Connectez-vous aux
              meilleurs commerçants du continent et achetez en toute sérénité.
            </p>

            {/* Social Icons - Clean Light Version */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  title={social.name}
                  className="size-11 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:border-[#E67E22] hover:text-[#E67E22] flex items-center justify-center transition-all duration-300 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#E67E22]">
              Navigation
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Accueil", href: "/" },
                { label: "Produits", href: "/products" },
                { label: "Vendeurs", href: "/sellers" },
                { label: "Comment ça marche", href: "/#how-it-works" },
                { label: "Tarifs", href: "/pricing" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm font-bold text-slate-600 hover:text-[#E67E22] transition-colors flex items-center gap-2 group"
                  >
                    <span className="size-1 bg-[#E67E22]/30 rounded-full group-hover:bg-[#E67E22] transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Catégories */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#E67E22]">
              Secteurs
            </h4>
            <ul className="space-y-4">
              {[
                "Agricole",
                "High-Tech",
                "Mode & Style",
                "Boutique Express",
                "Services & Travaux",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/products?category=${item}`}
                    className="text-sm font-bold text-slate-600 hover:text-[#E67E22] transition-colors flex items-center gap-2 group"
                  >
                    <span className="size-1 bg-slate-300 rounded-full group-hover:bg-[#E67E22] transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Local - Light Gradient Background */}
          <div className="lg:col-span-3 space-y-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#E67E22]">
              Service Client
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[#E67E22]">
                  call
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Téléphone
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    +243 999 123 456
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[#E67E22]">
                  alternate_email
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Email Support
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    contact@wapibei.cd
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[#E67E22]">
                  location_on
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Bureau Local
                  </p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    Siège : Goma, RD Congo • Présent dans toute l&apos;Afrique
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-medium text-slate-500">
            © 2026 WapiBei Marketplace. Tous droits réservés. Fait en Afrique,
            pour l&apos;Afrique. 🌍
          </p>
          <div className="flex items-center gap-8">
            <Link
              href="/privacy"
              className="text-[10px] font-black uppercase text-slate-400 hover:text-[#E67E22] tracking-widest transition-colors"
            >
              Légal
            </Link>
            <Link
              href="/terms"
              className="text-[10px] font-black uppercase text-slate-400 hover:text-[#E67E22] tracking-widest transition-colors"
            >
              Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
