export declare class PasswordService {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
    validateComplexity(password: string): void;
    generateResetToken(): Promise<{
        token: string;
        hash: string;
    }>;
    verifyResetToken(token: string, hash: string): Promise<boolean>;
}
