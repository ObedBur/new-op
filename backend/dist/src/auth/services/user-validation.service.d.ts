import { UserRole, KycStatus, User } from '@prisma/client';
export declare class UserValidationService {
    getInitialTrustScore(role: UserRole): number;
    getInitialKycStatus(role: UserRole): KycStatus;
    validateLoginEligibility(user: User): void;
    calculateScoreAfterVerification(currentScore: number): number;
}
