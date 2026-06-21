'use client';

import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-grow p-4 md:p-8 lg:p-10">
      {children}
    </main>
  );
}
