'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isAppReady: boolean;
  setAppReady: (ready: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);

  const setAppReady = (ready: boolean) => {
    setIsAppReady(ready);
  };

  return (
    <LoadingContext.Provider value={{ isAppReady, setAppReady }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
