'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { VendorSidebar } from "@/components/layout/VendorSidebar";
import { useAuth } from "@/context/AuthContext";

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdminPage = pathname?.startsWith('/admin');
  const isDashboardPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings');

  // Reset scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isAdminPage) {
    return <>{children}</>;
  }

  if (isDashboardPage) {
    return (
      <div className="flex flex-row min-h-screen bg-[#F8FAFC] dark:bg-[#080b14] text-[#1E293B] font-sans antialiased">
        {/* Left column sidebar (narrow on mobile, wide on desktop) */}
        <div className="shrink-0 z-50">
          <VendorSidebar user={user} />
        </div>

        {/* Right column: Navbar + Main Scrollable content */}
        <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden">
          <DashboardHeader />

          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
