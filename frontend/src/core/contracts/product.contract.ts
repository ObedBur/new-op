export interface BackendProduct {
    id: string;
    name: string;
    price: number;
    updatedAt: string;
    user?: {
        fullName: string;
    };
    market?: {
        name: string;
    };
}
