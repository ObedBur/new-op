import React, { useState } from 'react';
import { User, KycStatus } from '@/types';
import { VendorCard } from './VendorCard';
import { VendorDetailModal } from './VendorDetailModal';
import { VendorFilters } from './VendorFilters';

interface VendorsListProps {
    vendors: User[];
    isLoading: boolean;
    filters: {
        status: 'Tous' | KycStatus;
    };
    onFilterChange: (status: 'Tous' | KycStatus) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export const VendorsList: React.FC<VendorsListProps> = ({ 
    vendors, 
    isLoading, 
    filters,
    onFilterChange,
    onApprove,
    onReject
}) => {
    const [selectedVendor, setSelectedVendor] = useState<User | null>(null);

    // --- Loading State Skeleton ---
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-48 bg-slate-100 rounded-3xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
            {/* Filters */}
            <VendorFilters 
                activeFilter={filters.status} 
                onFilterChange={onFilterChange} 
                totalCount={vendors.length} 
            />

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {vendors.map((vendor) => (
                    <VendorCard 
                        key={vendor.id} 
                        vendor={vendor} 
                        onViewBlockingDetails={setSelectedVendor}
                        onApprove={onApprove}
                    />
                ))}
            </div>

            {/* Modal */}
            {selectedVendor && (
                <VendorDetailModal
                    vendor={selectedVendor}
                    onClose={() => setSelectedVendor(null)}
                    onApprove={onApprove}
                    onReject={onReject}
                />
            )}
        </div>
    );
};
