"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => string;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        
        if (type !== 'loading') {
            setTimeout(() => {
                hideToast(id);
            }, 3000);
        }
        return id;
    }, [hideToast]);

    const [isMounted, setIsMounted] = React.useState(false);
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {isMounted && (
                <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-300 flex flex-col gap-3 pointer-events-none">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={`pointer-events-auto flex items-center justify-between gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all animate-in slide-in-from-bottom-5 md:slide-in-from-right-10 fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' :
                                toast.type === 'error' ? 'bg-red-500 border-red-400 text-white' :
                                    toast.type === 'warning' ? 'bg-amber-500 border-amber-400 text-white' :
                                        toast.type === 'loading' ? 'bg-slate-800 border-slate-700 text-white' :
                                            'bg-blue-500 border-blue-400 text-white'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-xl ${toast.type === 'loading' ? 'animate-spin' : ''}`}>
                                {toast.type === 'success' ? 'check_circle' :
                                    toast.type === 'error' ? 'error' :
                                        toast.type === 'warning' ? 'warning' :
                                            toast.type === 'loading' ? 'sync' : 'info'}
                            </span>
                            <p className="font-bold text-sm">{toast.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
