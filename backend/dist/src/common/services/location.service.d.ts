export interface Province {
    name: string;
    code: string;
    communes: string[];
}
export declare class LocationService {
    private readonly logger;
    private provinces;
    constructor();
    private getProvincesData;
    getAllProvinces(): string[];
    getCommunes(provinceName: string): string[];
    isValidProvince(provinceName: string): boolean;
    isValidCommune(provinceName: string, communeName: string): boolean;
}
