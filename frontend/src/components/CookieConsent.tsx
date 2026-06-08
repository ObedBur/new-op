'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('wapibei_cookie_consent');
        if (!consent) setIsVisible(true);
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('wapibei_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        // La correction est ici : le ">" était manquant
        <div className="fixed bottom-6 right-6 z-[9999] w-[350px] glass-panel rounded-[var(--radius)] p-6 animate-in slide-in-from-bottom-8">
            <h4 className="font-display font-black text-foreground text-sm mb-3 uppercase tracking-wider">
                Confidentialité
            </h4>
            <p className="text-xs text-foreground/70 mb-6 leading-relaxed">
                WapiBei utilise des cookies pour optimiser votre expérience, mémoriser vos préférences et sécuriser vos transactions.
                En poursuivant votre navigation, vous acceptez notre politique d'utilisation.
            </p>

            <div className="flex flex-col gap-3"> {/* Le ">" est maintenant bien présent */}
                <button
                    onClick={acceptCookies}
                    className="btn-cta w-full py-3 rounded-[var(--radius-md)] text-[11px] uppercase tracking-widest"
                >
                    Accepter les cookies
                </button>

                <Link
                    href="/legal"
                    className="text-[10px] text-foreground/50 font-bold uppercase tracking-widest hover:text-primary transition-colors text-center"
                >
                    Lire nos engagements
                </Link>
            </div>
        </div>
    );
};