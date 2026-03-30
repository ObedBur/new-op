"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OtpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const email_service_1 = require("../../common/email/email.service");
const auth_constants_1 = require("../constants/auth.constants");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
let OtpService = OtpService_1 = class OtpService {
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.logger = new common_1.Logger(OtpService_1.name);
    }
    async generateAndSend(userId, email) {
        const plainOtp = this.generateOtp();
        const otpHash = await bcrypt.hash(plainOtp, auth_constants_1.AUTH_CONSTANTS.BCRYPT_ROUNDS);
        const otpExpiresAt = new Date(Date.now() + auth_constants_1.AUTH_CONSTANTS.OTP_EXPIRY_MS);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                otpHash,
                otpExpiresAt,
                otpAttempts: 0,
            },
        });
        if (process.env.NODE_ENV !== 'production') {
            this.logger.debug(`[DEV OTP] ${email} -> ${plainOtp}`);
        }
        this.emailService.sendOtp(email, plainOtp).catch(err => this.logger.error(`Background email send failed: ${err.message}`));
        return plainOtp;
    }
    async verify(email, otp) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.HttpException('Invalid OTP request', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!user.otpHash || !user.otpExpiresAt || user.isVerified) {
            throw new common_1.HttpException('Invalid OTP request', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.otpAttempts >= auth_constants_1.AUTH_CONSTANTS.MAX_OTP_ATTEMPTS) {
            await this.clearOtp(user.id);
            throw new common_1.HttpException('Too many failed attempts. Please request a new OTP.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        if (user.otpExpiresAt < new Date()) {
            throw new common_1.HttpException('OTP expired', common_1.HttpStatus.BAD_REQUEST);
        }
        const isValid = await bcrypt.compare(otp, user.otpHash);
        if (!isValid) {
            await this.incrementAttempts(user.id);
            const remaining = auth_constants_1.AUTH_CONSTANTS.MAX_OTP_ATTEMPTS - (user.otpAttempts + 1);
            throw new common_1.HttpException(`Invalid OTP. ${remaining} attempt(s) remaining.`, common_1.HttpStatus.BAD_REQUEST);
        }
        return true;
    }
    async clearOtp(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                otpHash: null,
                otpExpiresAt: null,
                otpAttempts: 0,
            },
        });
    }
    async incrementAttempts(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                otpAttempts: { increment: 1 },
            },
        });
    }
    generateOtp() {
        return crypto.randomInt(100000, 999999).toString();
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = OtpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], OtpService);
//# sourceMappingURL=otp.service.js.map