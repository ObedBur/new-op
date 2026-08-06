import React from 'react';
import { KycStatus } from '@/types';

interface FilterChipProps {
    label: string;
    active: boolean;
    onClick: () => void;
    count?: number;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, active, onClick, count }) => (
    <button
        onClick={onClick}
        className={`h-10 shrink-0 flex items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all cursor-pointer ${
            active
                ? 'bg-orange-500 border border-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
        }`}
    >
        <span className="uppercase tracking-wider">{label}</span>
        {count !== undefined && (
            <span className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black ${
                active ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
                {count}
            </span>
        )}
    </button>
);

interface VendorFiltersProps {
    activeFilter: 'Tous' | KycStatus;
    onFilterChange: (filter: 'Tous' | KycStatus) => void;
    totalCount: number;
}

export const VendorFilters: React.FC<VendorFiltersProps> = ({ activeFilter, onFilterChange, totalCount }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
                <FilterChip label="Tous" active={activeFilter === 'Tous'} onClick={() => onFilterChange('Tous')} />
                <FilterChip label="En attente" active={activeFilter === 'PENDING'} onClick={() => onFilterChange('PENDING')} />
                <FilterChip label="Approuvés" active={activeFilter === 'APPROVED'} onClick={() => onFilterChange('APPROVED')} />
                <FilterChip label="Rejetés" active={activeFilter === 'REJECTED'} onClick={() => onFilterChange('REJECTED')} />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap shrink-0">
                {totalCount} trouvé{totalCount > 1 ? 's' : ''}
            </span>
        </div>
    );
};
