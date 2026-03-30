"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_constants_1 = require("../constants/auth.constants");
let UserValidationService = class UserValidationService {
    getInitialTrustScore(role) {
        return role === client_1.UserRole.CLIENT
            ? auth_constants_1.AUTH_CONSTANTS.INITIAL_TRUST_SCORE_CLIENT
            : auth_constants_1.AUTH_CONSTANTS.INITIAL_TRUST_SCORE_VENDOR;
    }
    getInitialKycStatus(role) {
        return role === client_1.UserRole.VENDOR
            ? client_1.KycStatus.PENDING
            : client_1.KycStatus.NOT_REQUIRED;
    }
    validateLoginEligibility(user) {
        if (!user.isVerified) {
            throw new common_1.HttpException('Account not verified', common_1.HttpStatus.FORBIDDEN);
        }
        if (user.role === client_1.UserRole.VENDOR && user.kycStatus !== client_1.KycStatus.APPROVED) {
            throw new common_1.HttpException('KYC verification required', common_1.HttpStatus.FORBIDDEN);
        }
    }
    calculateScoreAfterVerification(currentScore) {
        return currentScore + auth_constants_1.AUTH_CONSTANTS.VERIFICATION_BONUS_SCORE;
    }
};
exports.UserValidationService = UserValidationService;
exports.UserValidationService = UserValidationService = __decorate([
    (0, common_1.Injectable)()
], UserValidationService);
//# sourceMappingURL=user-validation.service.js.map