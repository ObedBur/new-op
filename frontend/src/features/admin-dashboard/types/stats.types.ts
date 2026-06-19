export interface StatItem {
    id: string;
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    bgColor: string;
    iconColor: string;
}

export interface PriceData {
    week: string;
    riz: number;
    sucre: number;
}

