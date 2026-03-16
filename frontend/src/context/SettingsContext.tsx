"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/utils/storage';

export type Theme = 'light' | 'dark' | 'emerald' | 'ocean';
export type Language = 'fr' | 'en' | 'sw';
export type FontSize = 'small' | 'medium' | 'large';

interface SettingsContextType {
    theme: Theme;
    language: Language;
    fontSize: FontSize;
    setTheme: (theme: Theme) => void;
    setLanguage: (lang: Language) => void;
    setFontSize: (size: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(storage.getTheme);
    const [language, setLanguageState] = useState<Language>(storage.getLanguage);
    const [fontSize, setFontSizeState] = useState<FontSize>(storage.getFontSize);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        storage.setTheme(newTheme);
    };

    const setLanguage = (newLang: Language) => {
        setLanguageState(newLang);
        storage.setLanguage(newLang);
    };

    const setFontSize = (newSize: FontSize) => {
        setFontSizeState(newSize);
        storage.setFontSize(newSize);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove('theme-light', 'theme-dark', 'theme-emerald', 'theme-ocean');
            root.classList.add(`theme-${theme}`);
        }
    }, [theme]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            // Remove old font classes if any (assuming prefix font-)
            root.classList.remove('font-sm', 'font-base', 'font-lg'); 
            root.classList.add(`font-${fontSize === 'small' ? 'sm' : fontSize === 'large' ? 'lg' : 'base'}`);
        }
    }, [fontSize]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-lang', language);
        }
    }, [language]);

    return (
        <SettingsContext.Provider value={{ theme, language, fontSize, setTheme, setLanguage, setFontSize }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
