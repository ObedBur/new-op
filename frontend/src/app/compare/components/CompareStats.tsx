import React from 'react';

interface CompareStatsProps {
  count: number;
  avgPrice: string | number;
  minPrice: number;
  maxPrice: number;
  savings: number;
}

export const CompareStats: React.FC<CompareStatsProps> = ({
  count,
  avgPrice,
  minPrice,
  maxPrice,
  savings,
}) => {
  const stats = [
    { label: 'Offres', value: count },
    { label: 'Prix moyen', value: `${avgPrice} $` },
    { label: 'Meilleur prix', value: `${minPrice} $`, color: 'text-emerald-600' },
    { label: 'Prix max', value: `${maxPrice} $` },
    { label: 'Économie', value: `${savings} $`, color: 'text-[#E67E22]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center min-w-0">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center truncate w-full">{stat.label}</p>
          <p className={`text-xl font-black truncate w-full text-center ${stat.color || 'text-deep-blue dark:text-white'}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
