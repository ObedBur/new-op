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
}
