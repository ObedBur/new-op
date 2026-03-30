/*
 * Interface Product pour l'affichage dans le dashboard admin.
 */
export interface Product {
    id: string;
    name: string;
    seller: string;      
    price: number;
    market: string;      
    lastUpdate: string;   
    iconBg: string;       
    iconColor: string;   
}
