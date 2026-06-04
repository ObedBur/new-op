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
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-[#080b14] text-[#1E293B] font-sans antialiased">
        {/* Left column sidebar for desktop (hidden on mobile) */}
        <div className="hidden lg:block shrink-0">
          <VendorSidebar user={user} isMobileOnly={false} />
        </div>
        
        {/* Right column: Navbar + Mobile Nav + Main Scrollable content */}
        <div className="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-hidden">
          <DashboardHeader />
          
          {/* Mobile Navigation (hidden on desktop) */}
          <div className="lg:hidden">
            <VendorSidebar user={user} isMobileOnly={true} />
          </div>

          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
