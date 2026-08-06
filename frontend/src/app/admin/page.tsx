'use client';

import React from 'react';
import { StatsSection, PriceChart, ProductTable, SellersValidation, RecentActivity } from '@/features/admin-dashboard/components/features/dashboard';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function AdminPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top KPI Stats */}
            <ErrorBoundary>
                <StatsSection />
            </ErrorBoundary>

            {/* Row 2: Price Evolution Chart (2 cols) & Sellers Validation (1 col) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                <div className="xl:col-span-2 flex flex-col">
                    <ErrorBoundary>
                        <PriceChart />
                    </ErrorBoundary>
                </div>
                <div className="xl:col-span-1 flex flex-col">
                    <ErrorBoundary>
                        <SellersValidation />
                    </ErrorBoundary>
                </div>
            </div>

            {/* Row 3: Product Inventory Table (2 cols) & Recent Activity (1 col) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                <div className="xl:col-span-2 flex flex-col">
                    <ErrorBoundary>
                        <ProductTable />
                    </ErrorBoundary>
                </div>
                <div className="xl:col-span-1 flex flex-col">
                    <ErrorBoundary>
                        <RecentActivity />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}
