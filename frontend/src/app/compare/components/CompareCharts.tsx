'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { CompareProduct } from '@/features/compare/compare.service';

interface CompareChartsProps {
  products: CompareProduct[];
}

export const CompareCharts: React.FC<CompareChartsProps> = ({ products }) => {
  // Mock price history since we don't have it from the API
  const priceHistoryData = useMemo(() => {
    if (products.length === 0) return [];
    
    // Create a mock history based on the average price of current products
    const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
    
    return [
      { date: 'J-6', price: avgPrice * 1.05 },
      { date: 'J-5', price: avgPrice * 1.02 },
      { date: 'J-4', price: avgPrice * 0.98 },
      { date: 'J-3', price: avgPrice * 1.01 },
      { date: 'J-2', price: avgPrice * 0.97 },
      { date: 'J-1', price: avgPrice * 0.99 },
      { date: 'Auj.', price: avgPrice },
    ];
  }, [products]);

  // Price distribution
  const distributionData = useMemo(() => {
    if (products.length === 0) return [];
    
    // Group prices into 5 bins
    const prices = products.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    if (min === max) {
      return [{ range: `${min}$`, count: products.length }];
    }
    
    const binSize = (max - min) / 5;
    const bins = Array.from({ length: 5 }, (_, i) => ({
      range: `${(min + i * binSize).toFixed(1)} - ${(min + (i + 1) * binSize).toFixed(1)}$`,
      count: 0
    }));
    
    prices.forEach(price => {
      const binIndex = Math.min(4, Math.floor((price - min) / binSize));
      bins[binIndex].count++;
    });
    
    return bins.filter(b => b.count > 0); // Only return bins with data
  }, [products]);

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      {/* Évolution des prix */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">Évolution moyenne (7 jours)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: '#1a1a1a', color: '#fff' }}
                itemStyle={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px' }}
              />
              <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Prix Moyen ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Répartition des prix */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">Répartition des prix</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: '#1a1a1a', color: '#fff' }}
                itemStyle={{ color: '#E67E22', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px' }}
              />
              <Bar dataKey="count" fill="#E67E22" radius={[4, 4, 0, 0]} name="Nombre de vendeurs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
