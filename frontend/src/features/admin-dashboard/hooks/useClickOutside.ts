"use client";

import { useEffect, useRef } from 'react';

/**
 * Hook pour détecter les clics en dehors d'un élément
 * @param callback - Fonction appelée lors du clic en dehors
 * @returns ref - Ref à attacher à l'élément
 */
export const useClickOutside = <T extends HTMLElement>(
    callback: () => void
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [callback]);

    return ref;
};

