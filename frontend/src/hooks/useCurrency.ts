import { useSettings, Currency } from '@/context/SettingsContext';

const CDF_RATE = 2800; // 1 USD = 2800 CDF (Taux par défaut)

export const useCurrency = () => {
    const { currency, setCurrency } = useSettings();

    const formatPrice = (priceUsd: number): string => {
        if (currency === 'CDF') {
            return `${Math.round(priceUsd * CDF_RATE).toLocaleString('fr-CD')} FC`;
        }
        return `$${priceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const formatPriceParts = (priceUsd: number): { amount: string, symbol: string } => {
        if (currency === 'CDF') {
            return { amount: Math.round(priceUsd * CDF_RATE).toLocaleString('fr-CD'), symbol: 'FC' };
        }
        return { amount: priceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 }), symbol: '$' };
    };

    return { currency, setCurrency, formatPrice, formatPriceParts, CDF_RATE };
};
