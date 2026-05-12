<<<<<<< HEAD
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CartProvider } from "@/features/cart/context/CartContext";
import { Toaster } from "@/components/ui/Toaster";
import { SplashScreen } from "@/components/layout/SplashScreen";
import RootLayoutContent from "./RootLayoutContent";

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
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WapiBei - Marketplace N°1 en Afrique',
    description: 'La Marketplace de confiance en Afrique.',
    images: ['/shopping-cart.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`scroll-smooth ${outfit.variable}`}>
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
            <Toaster />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
=======
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

// 1. Configuration des polices
// "Inter" est la police principale du design system Kaskade
const sans = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// "JetBrains Mono" pour les éléments techniques (comme le compteur %)
const mono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// 2. Configuration SEO & Metadata avancée
export const metadata: Metadata = {
  metadataBase: new URL("https://kaskade.com"),
  title: {
    default: "Kaskade.com | L'Innovation Digitale",
    template: "%s | Kaskade.com",
  },
  description: "Plateforme immersive et solutions digitales de nouvelle génération.",
  applicationName: "Kaskade",
  authors: [{ name: "Kaskade Team", url: "https://kaskade.com" }],
  keywords: ["Digital", "Creative", "Agency", "Web3", "UI/UX"],
  creator: "Kaskade Team",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://kaskade.com",
    title: "Kaskade.com",
    description: "L'avenir du design numérique commence ici.",
    siteName: "Kaskade.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kaskade Preview",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

// 3. Configuration du Viewport (Mobile)
export const viewport: Viewport = {
  themeColor: "#FFFFFF", // Mise à jour vers Blanc (Light Mode)
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`
          ${sans.variable} ${mono.variable} ${serif.variable}
          bg-[#FFFFFF] text-[#1A1D21] 
          antialiased overflow-x-hidden selection:bg-[#f97415] selection:text-[#FFFFFF] font-sans
        `}
      >
        {/* Wrapper principal */}
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
             {children}
          </div>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
