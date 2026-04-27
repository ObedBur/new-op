"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./components/SearchBar";
import { ProfileDropdown } from "./components/ProfileDropdown";
import { MobileSidebar } from "./components/MobileSidebar";
import { DesktopHeader } from "./components/DesktopHeader";
import { useCart } from "@/features/cart/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { id: "/", label: "Accueil", icon: "home" },
  { id: "/products", label: "Produits", icon: "inventory_2" },
  { id: "/sellers", label: "Vendeurs", icon: "store" },
  { id: "/compare", label: "Comparer", icon: "compare_arrows" },
];

/**
 * Inner component keyed by `pathname`.
 * When the route changes, React remounts this component,
 * which naturally resets all overlay states to `false`.
 */
const HeaderOverlays = ({
  pathname,
  totalItems,
  isAuthenticated,
  user,
  logout,
}: {
  pathname: string;
  totalItems: number;
  isAuthenticated: boolean;
  user: ReturnType<typeof useAuth>["user"];
  logout: () => Promise<void>;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ].some((path) => pathname.startsWith(path));

  return (
    <>
      {/* --- NEW DESKTOP HEADER (Visible lg+) --- */}
      <DesktopHeader
        navLinks={navLinks}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
        totalItems={totalItems}
      />

      {/* --- MOBILE/TABLET HEADER (Visible < lg) --- */}
      <div
        className={`w-full px-4 md:px-6 h-16 md:h-20 flex lg:hidden items-center ${isAuthPage ? "justify-center" : "justify-between"} gap-2 relative`}
      >
        {/* --- AUTH PAGE: HOME BUTTON (Left) --- */}
        {isAuthPage && (
          <Link
            href="/"
            className="absolute left-4 p-2 rounded-full bg-[#E67E22]/10 text-[#E67E22] hover:bg-[#E67E22]/20 transition-all border border-[#E67E22]/20"
            title="Retour à l'accueil"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </Link>
        )}

        {/* --- LOGO SECTION --- */}
        {!isSearchExpanded && (
          <Link
            href="/"
            className={`flex items-center gap-1.5 md:gap-2 cursor-pointer shrink-0 animate-in fade-in duration-300 ${isAuthPage ? "mx-auto" : ""}`}
          >

            <h1 className="text-[18px] md:text-2xl font-black tracking-tighter uppercase">
              <span className="text-[#E67E22]">Wapi</span><span className="text-[#2D5A27]">Bei</span>
            </h1>
          </Link>
        )}

        {/* --- SEARCH BAR SECTION (Hidden on Auth Pages) --- */}
        {!isAuthPage && (
          <SearchBar
            isSearchExpanded={isSearchExpanded}
            setIsSearchExpanded={setIsSearchExpanded}
          />
        )}

        {/* --- ACTION GROUP (Hidden on Auth Pages) --- */}
        {!isSearchExpanded && !isAuthPage && (
          <div className="flex items-center gap-1 md:gap-3 shrink-0 animate-in fade-in duration-300">
            <button
              onClick={() => setIsSearchExpanded(true)}
              className="md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Rechercher"
            >
              <span className="material-symbols-outlined text-[24px]">
                search
              </span>
            </button>

            {pathname === "/settings" && (
              <div className="hidden md:flex">
                <ProfileDropdown
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={logout}
                  isProfileOpen={isProfileOpen}
                  setIsProfileOpen={setIsProfileOpen}
                />
              </div>
            )}

            {/* Burger Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
              aria-label="Ouvrir le menu mobile"
              aria-expanded={isSidebarOpen ? "true" : "false"}
            >
              <span className="material-symbols-outlined text-[24px] md:text-[28px] font-bold">
                menu
              </span>
            </button>
          </div>
        )}
      </div>

      {/* --- SIDEBAR --- */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navLinks={navLinks}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
      />
    </>
  );
};

export const Header = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/30 dark:bg-[#111]/30 backdrop-blur-md border-b border-gray-100/50 dark:border-white/5">
      <HeaderOverlays
        key={pathname}
        pathname={pathname}
        totalItems={totalItems}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
      />
    </header>
  );
};
