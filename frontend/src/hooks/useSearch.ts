import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/axios';
import { Product } from '@/types';

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
    
    if (normalizedQuery.length < 3) {
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
        // En attendant un endpoint global, on utilise /products pour extraire les suggestions et produits
        // Si le backend a un endpoint spécifique, on remplacera ici.
        const res = await api.get('/products', { params: { search: normalizedQuery, limit: 10 } });
        
        if (requestId === latestRequestRef.current && res.data?.success) {
          const fetchedProducts: Product[] = res.data.data || [];
          
          // Extraire des shops uniques depuis les produits retournés (simulation si pas d'API vendors dédiée)
          
          const uniqueShopsMap = new Map<string, SearchVendor>();
fetchedProducts.forEach(p => {
  if (p.user && !uniqueShopsMap.has(p.user.id)) {
    uniqueShopsMap.set(p.user.id, {
      id: p.user.id,
      boutiqueName: p.user.boutiqueName || p.user.fullName || 'Inconnu',
      avatarUrl: p.user.avatarUrl,
      trustScore: p.user.trustScore || 0,
      isVerified: p.user.isVerified || false
    });
  }
});
          // Extraire des suggestions simples
          const suggestions = Array.from(new Set(fetchedProducts.map(p => p.name.toLowerCase()))).slice(0, 4);

          setResults({
            suggestions,
            shops: Array.from(uniqueShopsMap.values()).slice(0, 3),
            products: fetchedProducts.slice(0, 4)
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
