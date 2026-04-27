/**
 * Interface Product pour l'affichage dans le dashboard admin.
 * Distincte du Product global car elle contient des champs spécifiques à l'admin.
 */
export interface AdminProduct {
    id: string;
    name: string;
    seller: string;      
    price: number;
    market: string;      
    lastUpdate: string;   
    iconBg: string;       
    iconColor: string;   
}
