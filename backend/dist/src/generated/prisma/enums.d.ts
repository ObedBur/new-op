export declare const UserRole: {
    readonly CLIENT: "CLIENT";
    readonly VENDOR: "VENDOR";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const KycStatus: {
    readonly NOT_REQUIRED: "NOT_REQUIRED";
    readonly PENDING: "PENDING";
    readonly UNDER_REVIEW: "UNDER_REVIEW";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type KycStatus = (typeof KycStatus)[keyof typeof KycStatus];
export declare const ProductAvailability: {
    readonly IN_STOCK: "IN_STOCK";
    readonly LIMITED_STOCK: "LIMITED_STOCK";
    readonly OUT_OF_STOCK: "OUT_OF_STOCK";
};
export type ProductAvailability = (typeof ProductAvailability)[keyof typeof ProductAvailability];
export declare const Market: {
    readonly VIRUNGA: "VIRUNGA";
    readonly BIRERE: "BIRERE";
    readonly CENTRE_VILLE: "CENTRE_VILLE";
    readonly HIMBI: "HIMBI";
    readonly KATINDO: "KATINDO";
    readonly KINSHASA: "KINSHASA";
    readonly LUBUMBASHI: "LUBUMBASHI";
    readonly BUKAVU: "BUKAVU";
    readonly KISANGANI: "KISANGANI";
    readonly KIGALI: "KIGALI";
    readonly NAIROBI: "NAIROBI";
    readonly KAMPALA: "KAMPALA";
    readonly DAR_ES_SALAAM: "DAR_ES_SALAAM";
    readonly AUTRE: "AUTRE";
};
export type Market = (typeof Market)[keyof typeof Market];
