'use client';

import React from 'react';
import { CurrencyType } from '../types';

interface CurrencySelectorProps {
  value: CurrencyType;
  onChange: (value: CurrencyType) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange }) => {
  const currencies: { label: string; value: CurrencyType; symbol: string }[] = [
    { label: 'Dollar', value: 'USD', symbol: '$' },
    { label: 'Franc', value: 'FRF', symbol: 'Fr' },
  ];

  return (
    <div className="inline-flex items-center gap-1.5 bg-white dark:bg-white/10 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/20">
      <span className="text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">Devise:</span>
      <div className="flex items-center gap-1">
        {currencies.map((currency) => (
          <button
            key={currency.value}
            onClick={() => onChange(currency.value)}
            title={currency.label}
            aria-label={`Choisir ${currency.label}`}
            type="button"
            className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all border ${
              value === currency.value
                ? 'bg-[#E67E22] text-white border-[#E67E22] shadow-lg'
                : 'bg-gray-50 dark:bg-white/5 text-[#2D5A27] dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            {currency.symbol}
          </button>
        ))}
      </div>
    </div>
  );
};
