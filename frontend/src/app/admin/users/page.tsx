'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/features/admin-dashboard/api/admin.api';
import useT from '@/i18n/useT';
import { ApiResponse } from '@/core/contracts/api.contract';

interface User {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    isVerified: boolean;
    city?: string | null;
    country?: string;
    createdAt: string;
    trustScore: number;
}

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
    const { t } = useT();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const data: ApiResponse<User[]> = await adminService.getAllUsers({ page, limit: PAGE_SIZE });
                setUsers(data?.data || []);
                setTotal(data?.pagination?.total || 0);
                setPages(data?.pagination?.pages || 0);
            } catch (err) {
                console.error('Failed to load users', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [page]);

    const handleDelete = async (userId: string, userName: string) => {
        if (!window.confirm(t('adminPage.deleteConfirm').replace('{name}', userName))) {
            return;
        }

        try {
            await adminService.deleteUser(userId);
            // Mettre à jour la liste localement
            setUsers(prev => prev.filter(u => u.id !== userId));
            alert(t('adminPage.deleteSuccess'));
        } catch (error) {
            console.error('Erreur lors de la suppression', error);
            alert(t('adminPage.usersDeleteError'));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin size-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'VENDOR':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('adminPage.usersTitle')}</h1>
                    <p className="text-sm text-slate-500 mt-1">{total} {t('adminPage.usersCount')}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: t('adminPage.admins'), count: users.filter(u => u.role === 'ADMIN').length, icon: 'admin_panel_settings', color: 'from-purple-500 to-purple-600' },
                    { label: t('adminPage.vendors'), count: users.filter(u => u.role === 'VENDOR').length, icon: 'storefront', color: 'from-blue-500 to-blue-600' },
                    { label: t('adminPage.clients'), count: users.filter(u => u.role === 'CLIENT').length, icon: 'person', color: 'from-slate-500 to-slate-600' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4 shadow-sm">
                        <div className={`size-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                            <span className="material-symbols-outlined text-white text-xl">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.count}</p>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">{t('adminPage.name')}</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">{t('adminPage.email')}</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">{t('adminPage.phone')}</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">{t('adminPage.role')}</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">{t('adminPage.verified')}</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">{t('adminPage.score')}</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">{t('adminPage.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        {t('adminPage.noUsers')}
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                    {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '??'}
                                                </div>
                                                <span className="font-medium text-slate-900 dark:text-white">{user.fullName || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{user.phone || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isVerified ? (
                                                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-slate-300 text-lg">cancel</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-bold ${user.trustScore >= 80 ? 'text-emerald-600' : user.trustScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                                {user.trustScore}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user.id, user.fullName || user.email)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                 title={t('adminPage.deleteTitle')}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            {t('adminPage.showing')} {(page - 1) * PAGE_SIZE + (users.length > 0 ? 1 : 0)}-{(page - 1) * PAGE_SIZE + users.length} / {total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('adminPage.prev')}
                            </button>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                {page} / {pages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pages, p + 1))}
                                disabled={page >= pages}
                                className="px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('adminPage.next')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
