'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getVendorOrders, getVendorStats } from '@/features/vendors/services/orders.service';
import { getMyProducts } from '@/features/products/services/product.service';
import { useT } from '@/i18n/useT';
import {
  Package, ShoppingBag, TrendingUp, Settings,
  ArrowRight, Store
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useT();
  const [stats, setStats] = useState({
    ordersCount: 0,
    productsCount: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, statsRes, productsRes] = await Promise.all([
          getVendorOrders(),
          getVendorStats(),
          getMyProducts(),
        ]);

        setStats({
          ordersCount: ordersRes?.data?.length || 0,
          productsCount: productsRes?.data?.length || 0,
          revenue: statsRes?.data?.totalRevenue || 0,
        });
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickLinks = [
    {
      label: t('vendor.dashboard.orders'),
      href: '/dashboard/orders',
      icon: Package,
      count: stats.ordersCount,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
      label: t('vendor.dashboard.products'),
      href: '/dashboard/products',
      icon: ShoppingBag,
      count: stats.productsCount,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: t('vendor.dashboard.analytics'),
      href: '/dashboard/analytics',
      icon: TrendingUp,
      count: `${stats.revenue.toLocaleString()} $`,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: t('vendor.dashboard.myAccount'),
      href: '/settings',
      icon: Settings,
      count: null,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-deep-blue dark:text-white tracking-tighter">
          {t('vendor.dashboard.welcome').replace('{name}', user?.fullName?.split(' ')[0] || '')}
        </h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
          {t('vendor.dashboard.subtitle')}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white dark:bg-[#151b2c] rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`size-10 rounded-xl ${link.bg} flex items-center justify-center mb-4`}>
                <link.icon size={20} className={link.color} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {link.label}
              </p>
              <p className="text-xl font-black text-deep-blue dark:text-white">
                {link.count !== null ? link.count : t('vendor.dashboard.access')}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest px-1">
          {t('vendor.dashboard.quickAccess')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/orders"
            className="group flex items-center justify-between bg-white dark:bg-[#151b2c] rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                <Package size={24} className="text-orange-500" />
              </div>
              <div>
                <p className="font-black text-deep-blue dark:text-white">{t('vendor.dashboard.manageOrders')}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">{stats.ordersCount} {t('vendor.dashboard.orderCount')}</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/dashboard/products"
            className="group flex items-center justify-between bg-white dark:bg-[#151b2c] rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <ShoppingBag size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="font-black text-deep-blue dark:text-white">{t('vendor.dashboard.manageProducts')}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">{stats.productsCount} {t('vendor.dashboard.productCount')}</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/dashboard/analytics"
            className="group flex items-center justify-between bg-white dark:bg-[#151b2c] rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp size={24} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-black text-deep-blue dark:text-white">{t('vendor.dashboard.viewAnalytics')}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">{stats.revenue.toLocaleString()} {t('vendor.dashboard.revenueLabel')}</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/settings"
            className="group flex items-center justify-between bg-white dark:bg-[#151b2c] rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                <Store size={24} className="text-purple-500" />
              </div>
              <div>
                <p className="font-black text-deep-blue dark:text-white">{t('vendor.dashboard.shopSettings')}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">{t('vendor.dashboard.shopSettingsDesc')}</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
