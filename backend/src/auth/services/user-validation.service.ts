import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRole, KycStatus, User } from '@prisma/client';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

@Injectable()
export class UserValidationService {
  /**
   * Determines the initial trust score based on user role
   */
  getInitialTrustScore(role: UserRole): number {
    return role === UserRole.CLIENT 
      ? AUTH_CONSTANTS.INITIAL_TRUST_SCORE_CLIENT 
      : AUTH_CONSTANTS.INITIAL_TRUST_SCORE_VENDOR;
  }

  /**
   * Determines the initial KYC status based on user role
   */
  getInitialKycStatus(role: UserRole): KycStatus {
    return role === UserRole.VENDOR
      ? KycStatus.PENDING
      : KycStatus.NOT_REQUIRED;
  }

  /**
   * Validates if a user is allowed to login based on their status
   */
  validateLoginEligibility(user: User): void {
    if (!user.isVerified) {
      throw new HttpException('Account not verified', HttpStatus.FORBIDDEN);
    }

    if (user.role === UserRole.VENDOR && user.kycStatus !== KycStatus.APPROVED) {
      throw new HttpException('KYC verification required', HttpStatus.FORBIDDEN);
    }
  }

  /**
   * Calculates the new trust score after OTP verification
   */
  calculateScoreAfterVerification(currentScore: number): number {
    return currentScore + AUTH_CONSTANTS.VERIFICATION_BONUS_SCORE;
  }
}

