import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/axios';
import { Product } from '@/types';
import { getActiveSellers } from '@/features/home/services/seller.service';

export type SearchSector = 'ALL' | 'PRODUCTS' | 'SHOPS';

export interface SearchVendor {
  id: string;
  boutiqueName: string;
  avatarUrl?: string;
  trustScore: number;
  isVerified: boolean;
}

export interface SearchData {
  suggestions: string[];
  shops: SearchVendor[];
  products: Product[];
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState<SearchSector>('ALL');
  
  const [results, setResults] = useState<SearchData>({ suggestions: [], shops: [], products: [] });
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const latestRequestRef = useRef(0);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('wapibei_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches(prev => {
      const newRecent = [term.trim(), ...prev.filter(t => t.toLowerCase() !== term.trim().toLowerCase())].slice(0, 5);
      localStorage.setItem('wapibei_recent_searches', JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('wapibei_recent_searches');
  };

  // Debounced API call
  useEffect(() => {
    const normalizedQuery = query.trim();
    
    if (normalizedQuery.length < 2) {
      const resetTimer = setTimeout(() => {
        setResults({ suggestions: [], shops: [], products: [] });
        setLoading(false);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const requestId = ++latestRequestRef.current;

      try {
        // Secteur BOUTIQUES : vraie recherche de vendeurs (endpoint /sellers)
        if (sector === 'SHOPS') {
          const sellers = await getActiveSellers();
          if (requestId !== latestRequestRef.current) return;

          const q = normalizedQuery.toLowerCase();
          const matched = sellers.filter((s) => s.boutiqueName.toLowerCase().includes(q));

          setResults({
            suggestions: matched.slice(0, 4).map((s) => s.boutiqueName),
            shops: matched.slice(0, 3).map((s) => ({
              id: s.id,
              boutiqueName: s.boutiqueName,
              avatarUrl: s.avatarUrl,
              trustScore: s.trustScore,
              isVerified: s.isVerified,
            })),
            products: [],
          });
          return;
        }

        // Produits + suggestions (endpoint d'autocomplétion unifié avec la barre mobile)
        const [res, suggRes] = await Promise.all([
          api.get('/products', { params: { search: normalizedQuery, limit: 10 } }),
          api.get('/products/suggestions', { params: { q: normalizedQuery } }),
        ]);

        if (requestId === latestRequestRef.current && res.data?.success) {
          const fetchedProducts: Product[] = res.data.data || [];

          const uniqueShopsMap = new Map<string, SearchVendor>();
          fetchedProducts.forEach(p => {
            if (p.user && !uniqueShopsMap.has(p.user.id)) {
              uniqueShopsMap.set(p.user.id, {
                id: p.user.id,
                boutiqueName: p.user.boutiqueName || p.user.fullName || 'Inconnu',
                avatarUrl: p.user.avatarUrl,
                trustScore: p.user.trustScore || 0,
                isVerified: p.user.isVerified || false,
              });
            }
          });

          const endpointSuggestions: string[] = (suggRes.data?.data || []).map((s: any) => s.text).filter(Boolean);
          const seen = new Set<string>();
          const suggestions = [...endpointSuggestions, ...fetchedProducts.map(p => p.name)].filter((s) => {
            const key = s.trim().toLowerCase();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
          }).slice(0, 5);

          setResults({
            suggestions,
            shops: Array.from(uniqueShopsMap.values()).slice(0, 3),
            products: fetchedProducts.slice(0, 4),
          });
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        if (requestId === latestRequestRef.current) {
          setLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, sector]);

  return {
    query,
    setQuery,
    sector,
    setSector,
    results,
    loading,
    isFocused,
    setIsFocused,
    recentSearches,
    addRecentSearch,
    clearRecentSearches
  };
}
