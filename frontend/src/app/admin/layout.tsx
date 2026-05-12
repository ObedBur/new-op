<<<<<<< HEAD
'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard';
import { Sidebar, Header, MobileNav, AdminFooter } from '@/features/admin-dashboard/components/layout';
import { useAdminLayout, AdminLayoutProvider, AdminSearchProvider } from '@/features/admin-dashboard/context';
import { usePathname } from 'next/navigation';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
    const { isSidebarCollapsed } = useAdminLayout();
    const pathname = usePathname();

    // Mapping pathname to activeView for UI consistency
    const getActiveView = (path: string) => {
        if (path === '/admin') return 'Dashboard';
        if (path.startsWith('/admin/vendors')) return 'Vendeurs';
        if (path.startsWith('/admin/products')) return 'Produits';
        if (path.startsWith('/admin/users')) return 'Utilisateurs';
        if (path.startsWith('/admin/reports')) return 'Rapports';
        if (path.startsWith('/admin/settings')) return 'Paramètres';
        return 'Dashboard';
    };

    const activeView = getActiveView(pathname);

    return (
        <div className="min-h-screen bg-background flex relative overflow-hidden">
            {/* Background Mesh Gradients */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Desktop Sidebar */}
            <Sidebar activeView={activeView} />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header 
                    activeView={activeView} 
                />
                
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>

                <AdminFooter />
            </div>

            {/* Mobile Navigation */}
            <MobileNav activeView={activeView} />
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard allowedRoles={['ADMIN']}>
            <AdminLayoutProvider>
                <AdminSearchProvider>
                    <AdminLayoutInner>
                        {children}
                    </AdminLayoutInner>
                </AdminSearchProvider>
            </AdminLayoutProvider>
        </AuthGuard>
    );
=======
"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#FCFBF7] min-h-screen text-[#321B13] font-sans selection:bg-[#FF6B00]/10">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "" : ""}`}>
        <AdminNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 min-w-0 lg:ml-72 px-4 md:px-10 py-6 md:py-8">
          <div className="max-w-[1600px] mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
}
