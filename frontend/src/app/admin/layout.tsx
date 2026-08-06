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
        if (path.startsWith('/admin/notifications')) return 'Notifications';
        return 'Dashboard';
    };

    const activeView = getActiveView(pathname);

    return (
        <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">

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
