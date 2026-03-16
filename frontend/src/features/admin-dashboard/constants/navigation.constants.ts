import { ADMIN_VIEWS } from '@/constants/enums';
import { TRANSLATIONS } from './translations.constants';

export interface NavItem {
    id: string;
    label: string;
    translationKey: keyof typeof TRANSLATIONS.fr.nav;
    icon: string;
    view: string;
    href: string;
    badge?: number;
    badgeColor?: string;
}

export const NAV_ITEMS: NavItem[] = [
    { id: '1', label: 'Dashboard', translationKey: 'dashboard', icon: 'dashboard', view: ADMIN_VIEWS.DASHBOARD, href: '/admin' },
    { id: '2', label: 'Vendeurs', translationKey: 'vendors', icon: 'storefront', view: ADMIN_VIEWS.VENDORS, href: '/admin/vendors' },
    { id: '3', label: 'Produits', translationKey: 'products', icon: 'inventory_2', view: ADMIN_VIEWS.PRODUCTS, href: '/admin/products' },
    { id: '4', label: 'Utilisateurs', translationKey: 'users', icon: 'group', view: ADMIN_VIEWS.USERS, href: '/admin/users' },
    { id: '5', label: 'Rapports', translationKey: 'reports', icon: 'assessment', view: ADMIN_VIEWS.REPORTS, href: '/admin/reports' },
    { id: '6', label: 'Paramètres', translationKey: 'settings', icon: 'settings', view: ADMIN_VIEWS.SETTINGS, href: '/admin/settings' },
];

