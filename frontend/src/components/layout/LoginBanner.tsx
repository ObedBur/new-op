import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const LoginBanner: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't show the banner if the user is already authenticated or if we're still loading the auth state
  if (isAuthenticated || isLoading) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pointer-events-none">
      <div className="container mx-auto max-w-lg pointer-events-auto">
        <div className="bg-[#ffebdb]/95 dark:bg-primary/20 backdrop-blur-md border border-white/50 dark:border-white/10 p-3 rounded-xl flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-3 pl-1">
            <div className="size-8 bg-white dark:bg-white/10 rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-primary text-xl">
                login
              </span>
            </div>
            <p className="text-[11px] font-black text-orange-900 dark:text-orange-100 leading-tight">
              Connecte-toi pour comparer <br /> plus de prix en Afrique
            </p>
          </div>
          <Link
            href="/login"
            className="h-9 px-3 text-sm bg-[#ff4400] hover:bg-[#ff4400]/90 text-white rounded-xl font-semibold transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
          >
            Connexion
          </Link>
        </div>
      </div>
    </div>
  );
};
