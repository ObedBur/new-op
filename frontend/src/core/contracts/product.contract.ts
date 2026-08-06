export interface BackendProduct {
    id: string;
    name: string;
    price: number;
    updatedAt: string;
    createdAt?: string;
    description?: string;
    category?: string;
    stock?: number;
    user?: {
        fullName: string;
        email?: string;
        phone?: string;
    };
    // Location: Pays > Province > Ville > Quartier
    quartier?: {
        name: string;
        ville?: string;
        province?: string;
        pays?: string;
    };
    /** @deprecated use quartier instead */
    market?: {
        name: string;
    };
}
