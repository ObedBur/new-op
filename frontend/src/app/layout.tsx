import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CartProvider } from "@/features/cart/context/CartContext";
import { Toaster } from "@/components/ui/Toaster";
import { SplashScreen } from "@/components/layout/SplashScreen";
import RootLayoutContent from "./RootLayoutContent";
import { CookieConsent } from "@/components/CookieConsent";
import { cookies } from 'next/headers';

// Utilisation d'une pile de polices système moderne pour éviter les délais de téléchargement Google Fonts
const outfit = {
  variable: "--font-outfit",
  className: "font-sans",
};

export const metadata: Metadata = {
  title: {
    default: 'WapiBei - Marketplace N°1 en Afrique',
    template: '%s | WapiBei'
  },
  description: 'La Marketplace de confiance en Afrique. Comparez les prix des produits agricoles, high-tech et mode à travers tout le continent.',
  icons: {
    icon: '/icon.svg',
  },
  metadataBase: new URL('https://wapibei.com'),
  openGraph: {
    title: 'WapiBei - Marketplace N°1 en Afrique',
    description: 'La Marketplace de confiance en Afrique. Comparez les prix des produits agricoles, high-tech et mode à travers tout le continent.',
    url: 'https://wapibei.com',
    siteName: 'WapiBei',
    images: [
      {
        url: '/shopping-cart.png',
        width: 1200,
        height: 630,
        alt: 'WapiBei Shopping Cart Logo',
      },
    ],
    type: 'website',
    // default locale (server can override by cookie using html lang below)
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WapiBei - Marketplace N°1 en Afrique',
    description: 'La Marketplace de confiance en Afrique.',
    images: ['/shopping-cart.png'],
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read language cookie server-side (available in server components)
  const cookieStore = await cookies();
  const lang = cookieStore.get('language')?.value ?? 'fr';

  return (
    <html lang={lang} className={`scroll-smooth ${outfit.variable}`} data-scroll-behavior="smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${outfit.className} antialiased text-deep-blue dark:text-white min-h-screen flex flex-col`}>
        <Providers>
          <CartProvider>
            <SplashScreen />
            <RootLayoutContent>{children}</RootLayoutContent>

            <CookieConsent />

            <Toaster />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
