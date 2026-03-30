"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_validation_service_1 = require("./user-validation.service");
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../constants/auth.constants");
describe('UserValidationService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [user_validation_service_1.UserValidationService],
        }).compile();
        service = module.get(user_validation_service_1.UserValidationService);
    });
    describe('getInitialTrustScore', () => {
        it('should return client score for CLIENT role', () => {
            expect(service.getInitialTrustScore(client_1.UserRole.CLIENT)).toBe(auth_constants_1.AUTH_CONSTANTS.INITIAL_TRUST_SCORE_CLIENT);
        });
        it('should return vendor score for VENDOR role', () => {
            expect(service.getInitialTrustScore(client_1.UserRole.VENDOR)).toBe(auth_constants_1.AUTH_CONSTANTS.INITIAL_TRUST_SCORE_VENDOR);
        });
    });
    describe('validateLoginEligibility', () => {
        const mockUser = (overrides = {}) => ({
            id: '1',
            isVerified: true,
            role: client_1.UserRole.CLIENT,
            kycStatus: client_1.KycStatus.NOT_REQUIRED,
            ...overrides,
        });
        it('should allow verified client', () => {
            expect(() => service.validateLoginEligibility(mockUser())).not.toThrow();
        });
        it('should throw if user is not verified', () => {
            const user = mockUser({ isVerified: false });
            expect(() => service.validateLoginEligibility(user)).toThrow(new common_1.HttpException('Account not verified', common_1.HttpStatus.FORBIDDEN));
        });
        it('should allow approved vendor', () => {
            const vendor = mockUser({ role: client_1.UserRole.VENDOR, kycStatus: client_1.KycStatus.APPROVED });
            expect(() => service.validateLoginEligibility(vendor)).not.toThrow();
        });
        it('should throw for vendor with pending KYC', () => {
            const vendor = mockUser({ role: client_1.UserRole.VENDOR, kycStatus: client_1.KycStatus.PENDING });
            expect(() => service.validateLoginEligibility(vendor)).toThrow(new common_1.HttpException('KYC verification required', common_1.HttpStatus.FORBIDDEN));
        });
    });
    describe('calculateScoreAfterVerification', () => {
        it('should add verification bonus to current score', () => {
            const result = service.calculateScoreAfterVerification(50);
            expect(result).toBe(50 + auth_constants_1.AUTH_CONSTANTS.VERIFICATION_BONUS_SCORE);
        });
    });
});
//# sourceMappingURL=user-validation.service.spec.js.map