"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminLayoutContextType {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export const AdminLayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
    const setSidebarCollapsed = (collapsed: boolean) => setIsSidebarCollapsed(collapsed);

    return (
        <AdminLayoutContext.Provider value={{ 
            isSidebarCollapsed, 
            toggleSidebar, 
            setSidebarCollapsed 
        }}>
            {children}
        </AdminLayoutContext.Provider>
    );
};

export const useAdminLayout = () => {
    const context = useContext(AdminLayoutContext);
    if (context === undefined) {
        throw new Error('useAdminLayout must be used within an AdminLayoutProvider');
    }
    return context;
};
