import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CartProvider } from "@/features/cart/context/CartContext";
import { Toaster } from "@/components/ui/Toaster";
import { SplashScreen } from "@/components/layout/SplashScreen";
import RootLayoutContent from "./RootLayoutContent";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-outfit",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'WapiBei - Marketplace N&deg;1 en Afrique',
    template: '%s | WapiBei'
  },
  description: 'La Marketplace de confiance en Afrique. Comparez les prix des produits agricoles, high-tech et mode &agrave; travers tout le continent.',
  icons: {
    icon: '/icon.svg',
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
