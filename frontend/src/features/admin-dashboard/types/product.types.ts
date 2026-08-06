/**
 * Interface Product pour l'affichage dans le dashboard admin.
 * Distincte du Product global car elle contient des champs spécifiques à l'admin.
 * Structure de localisation : Pays > Province > Ville > Quartier
 */
export interface AdminProduct {
    id: string;
    name: string;
    seller: string;
    sellerEmail?: string;
    sellerPhone?: string;
    price: number;
    /** Quartier (ex: Virunga, Birere, Himbi...) */
    quartier: string;
    /** Ville du produit */
    ville?: string;
    /** Province du produit */
    province?: string;
    lastUpdate: string;
    createdAt?: string;
    category?: string;
    stock?: number;
    description?: string;
    iconBg: string;
    iconColor: string;
}
