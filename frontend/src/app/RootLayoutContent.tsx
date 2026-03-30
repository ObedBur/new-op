'use client';

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isDashboardPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings');

  if (isAdminPage) {
    return <>{children}</>;
  }

  if (isDashboardPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <div className="flex-1">
          {children}
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
