'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { VendorSidebar } from '@/components/layout/VendorSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <main className="flex-1 pt-10">
      <section className="container mx-auto max-w-7xl px-4 py-6 md:py-10 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Navigation - Handled globally by VendorSidebar */}
          <VendorSidebar user={user} />

          {/* Page Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
