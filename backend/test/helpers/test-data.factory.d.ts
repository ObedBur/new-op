import { User } from '@prisma/client';
export declare class TestDataFactory {
    private static userCounter;
    static createUser(overrides?: Partial<User>): Promise<User>;
    static createVendor(overrides?: Partial<User>): Promise<User>;
    static createVerifiedUser(overrides?: Partial<User>): Promise<User>;
    static createApprovedVendor(overrides?: Partial<User>): Promise<User>;
    static createAdmin(overrides?: Partial<User>): Promise<User>;
    static createRegisterDto(role?: 'CLIENT' | 'VENDOR'): {
        email: string;
        password: string;
        fullName: string;
        phone: string;
        province: string;
        commune: string;
        city: string;
        country: string;
        role: "VENDOR" | "CLIENT";
        address: string;
    } | {
        boutiqueName: string;
        email: string;
        password: string;
        fullName: string;
        phone: string;
        province: string;
        commune: string;
        city: string;
        country: string;
        role: "VENDOR" | "CLIENT";
        address: string;
    };
    static createOtp(): string;
    static createOtpHash(otp: string): Promise<string>;
    static createResetToken(): string;
    static createEmail(): string;
    static createPhone(): string;
    static reset(): void;
}
//# sourceMappingURL=test-data.factory.d.ts.map