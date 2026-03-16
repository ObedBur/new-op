import React from 'react';
import { KycStatus } from '@/types';

interface FilterChipProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`h-11 shrink-0 flex items-center justify-center gap-x-2 rounded-2xl px-7 text-sm transition-all border uppercase tracking-[0.1em] ${
            active 
            ? 'bg-primary border-primary text-white font-black shadow-xl shadow-primary/25 scale-105' 
            : 'bg-white border-border/60 text-muted font-bold hover:border-primary/40'
        }`}
    >
        {label}
    </button>
);

interface VendorFiltersProps {
    activeFilter: 'Tous' | KycStatus;
    onFilterChange: (filter: 'Tous' | KycStatus) => void;
    totalCount: number;
}

export const VendorFilters: React.FC<VendorFiltersProps> = ({ activeFilter, onFilterChange, totalCount }) => {
    return (
        <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                <FilterChip label="Tous" active={activeFilter === 'Tous'} onClick={() => onFilterChange('Tous')} />
                <FilterChip label="En attente" active={activeFilter === 'PENDING'} onClick={() => onFilterChange('PENDING')} />
                <FilterChip label="Approuvés" active={activeFilter === 'APPROVED'} onClick={() => onFilterChange('APPROVED')} />
                <FilterChip label="Rejetés" active={activeFilter === 'REJECTED'} onClick={() => onFilterChange('REJECTED')} />
            </div>

            <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted opacity-60">
                    {totalCount} Vendeurs trouvés
                </span>
            </div>
        </div>
    );
};
