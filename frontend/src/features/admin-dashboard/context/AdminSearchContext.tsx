"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminSearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    clearSearch: () => void;
}

const AdminSearchContext = createContext<AdminSearchContextType | undefined>(undefined);

export const AdminSearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const clearSearch = () => setSearchQuery('');

    return (
        <AdminSearchContext.Provider value={{ 
            searchQuery, 
            setSearchQuery,
            clearSearch
        }}>
            {children}
        </AdminSearchContext.Provider>
    );
};

export const useAdminSearch = () => {
    const context = useContext(AdminSearchContext);
    if (context === undefined) {
        throw new Error('useAdminSearch must be used within an AdminSearchProvider');
    }
    return context;
};
