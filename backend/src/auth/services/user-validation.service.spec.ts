import { Test, TestingModule } from '@nestjs/testing';
import { UserValidationService } from './user-validation.service';
import { UserRole, KycStatus, User } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

describe('UserValidationService', () => {
  let service: UserValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserValidationService],
    }).compile();

    service = module.get<UserValidationService>(UserValidationService);
  });

  describe('getInitialTrustScore', () => {
    it('should return client score for CLIENT role', () => {
      expect(service.getInitialTrustScore(UserRole.CLIENT)).toBe(AUTH_CONSTANTS.INITIAL_TRUST_SCORE_CLIENT);
    });

    it('should return vendor score for VENDOR role', () => {
      expect(service.getInitialTrustScore(UserRole.VENDOR)).toBe(AUTH_CONSTANTS.INITIAL_TRUST_SCORE_VENDOR);
    });
  });

  describe('validateLoginEligibility', () => {
    const mockUser = (overrides: Partial<User> = {}): User => ({
      id: '1',
      isVerified: true,
      role: UserRole.CLIENT,
      kycStatus: KycStatus.NOT_REQUIRED,
      ...overrides,
    } as User);

    it('should allow verified client', () => {
      expect(() => service.validateLoginEligibility(mockUser())).not.toThrow();
    });

    it('should throw if user is not verified', () => {
      const user = mockUser({ isVerified: false });
      expect(() => service.validateLoginEligibility(user)).toThrow(
        new HttpException('Account not verified', HttpStatus.FORBIDDEN)
      );
    });

    it('should allow approved vendor', () => {
      const vendor = mockUser({ role: UserRole.VENDOR, kycStatus: KycStatus.APPROVED });
      expect(() => service.validateLoginEligibility(vendor)).not.toThrow();
    });

    it('should throw for vendor with pending KYC', () => {
      const vendor = mockUser({ role: UserRole.VENDOR, kycStatus: KycStatus.PENDING });
      expect(() => service.validateLoginEligibility(vendor)).toThrow(
        new HttpException('KYC verification required', HttpStatus.FORBIDDEN)
      );
    });
  });

  describe('calculateScoreAfterVerification', () => {
    it('should add verification bonus to current score', () => {
      const result = service.calculateScoreAfterVerification(50);
      expect(result).toBe(50 + AUTH_CONSTANTS.VERIFICATION_BONUS_SCORE);
    });
  });
});

