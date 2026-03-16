'use client';

import React, { useEffect } from 'react';
import { useVendors } from '@/features/vendors/hooks/useVendors';
import { VendorsList } from '@/features/vendors/components/VendorsList';
import { useAdminSearch } from '@/features/admin-dashboard/context';

export default function VendorsPage() {
    const { searchQuery } = useAdminSearch();
    const { 
        vendors, 
        isLoading, 
        filters, 
        setStatusFilter, 
        setSearchQuery, 
        approveVendor, 
        rejectVendor 
    } = useVendors();

    // Sync global search from TopBar with local hook state
    useEffect(() => {
        setSearchQuery(searchQuery);
    }, [searchQuery, setSearchQuery]);

    return (
        <VendorsList
            vendors={vendors}
            isLoading={isLoading}
            filters={filters}
            onFilterChange={setStatusFilter}
            onApprove={approveVendor}
            onReject={rejectVendor}
        />
    );
}
