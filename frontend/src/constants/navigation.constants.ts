export interface NavItem {
    id: string;
    label: string;
    icon: string;
    view: string;
    badge?: number;
    badgeColor?: string;
}

export const NAV_ITEMS: NavItem[] = [
    { id: '1', label: 'Dashboard', icon: 'dashboard', view: 'Dashboard' },
    { id: '2', label: 'Vendeurs', icon: 'storefront', view: 'Vendeurs' },
    { id: '3', label: 'Produits', icon: 'inventory_2', view: 'Produits' },
    { id: '4', label: 'Utilisateurs', icon: 'group', view: 'Utilisateurs' },
    { id: '5', label: 'Rapports', icon: 'assessment', view: 'Rapports' },
    { id: '6', label: 'Paramètres', icon: 'settings', view: 'Paramètres' },
];
