'use client';

import React from 'react';
import { StatsSection, PriceChart, ProductTable, SellersValidation, RecentActivity } from '@/features/admin-dashboard/components/features/dashboard';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function AdminPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ErrorBoundary>
                <StatsSection />
            </ErrorBoundary>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    <ErrorBoundary>
                        <PriceChart />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <ProductTable />
                    </ErrorBoundary>
                </div>
                <div className="space-y-8">
                    <ErrorBoundary>
                        <SellersValidation />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <RecentActivity />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}
