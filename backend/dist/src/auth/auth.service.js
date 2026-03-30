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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../common/email/email.service");
const client_1 = require("@prisma/client");
const auth_constants_1 = require("./constants/auth.constants");
const token_service_1 = require("./services/token.service");
const otp_service_1 = require("./services/otp.service");
const password_service_1 = require("./services/password.service");
const user_validation_service_1 = require("./services/user-validation.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, tokenService, otpService, passwordService, userValidationService, emailService) {
        this.prisma = prisma;
        this.tokenService = tokenService;
        this.otpService = otpService;
        this.passwordService = passwordService;
        this.userValidationService = userValidationService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.email }, { phone: dto.phone }],
            },
        });
        if (existingUser) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.CONFLICT);
        }
        if (dto.role === client_1.UserRole.VENDOR && !dto.boutiqueName) {
            throw new common_1.HttpException('Boutique name is required for vendors', common_1.HttpStatus.BAD_REQUEST);
        }
        if (process.env.NODE_ENV === 'production') {
            this.passwordService.validateComplexity(dto.password);
        }
        const passwordHash = await this.passwordService.hash(dto.password);
        const trustScore = this.userValidationService.getInitialTrustScore(dto.role);
        const kycStatus = this.userValidationService.getInitialKycStatus(dto.role);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: passwordHash,
                fullName: dto.fullName,
                phone: dto.phone,
                province: dto.province,
                commune: dto.commune,
                city: dto.city || dto.commune,
                country: dto.country || "RD Congo",
                address: dto.address,
                boutiqueName: dto.boutiqueName,
                role: dto.role,
                kycStatus,
                trustScore,
                dailyPublications: 0,
            },
        });
        await this.otpService.generateAndSend(user.id, user.email);
        return {
            success: true,
            message: 'Registration successful. Verify OTP.',
            requiresKyc: dto.role === client_1.UserRole.VENDOR,
        };
    }
    async verifyOtp(dto) {
        await this.otpService.verify(dto.email, dto.otp);
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                otpHash: null,
                otpExpiresAt: null,
                otpAttempts: 0,
                trustScore: this.userValidationService.calculateScoreAfterVerification(user.trustScore),
            },
        });
        this.emailService.sendWelcomeEmail(user.email, user.fullName).catch(err => this.logger.error(`Failed to send welcome email to ${user.email}`, err));
        return { success: true, message: 'Account verified successfully' };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            this.logger.debug(`Utilisateur non trouvé: ${dto.email}`);
            throw new common_1.HttpException('Identifiants invalides', common_1.HttpStatus.UNAUTHORIZED);
        }
        this.logger.debug(`Tentative de connexion pour: ${dto.email}, Password Length: ${dto.password?.length}`);
        const isPasswordValid = await this.passwordService.compare(dto.password, user.password);
        this.logger.debug(`Mot de passe valide: ${isPasswordValid}`);
        if (!isPasswordValid) {
            throw new common_1.HttpException('Identifiants invalides', common_1.HttpStatus.UNAUTHORIZED);
        }
        this.userValidationService.validateLoginEligibility(user);
        const tokens = await this.tokenService.generateTokenPair(user);
        await this.tokenService.saveRefreshToken(user.id, tokens.refresh_token);
        return {
            success: true,
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                trustScore: user.trustScore,
                city: user.city,
                country: user.country,
            },
        };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            return { success: true };
        const { token, hash: tokenHash } = await this.passwordService.generateResetToken();
        if (process.env.NODE_ENV !== 'production') {
            this.logger.debug(`[DEV RESET TOKEN] ${dto.email} -> ${token}`);
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetTokenHash: tokenHash,
                resetTokenExpiresAt: new Date(Date.now() + auth_constants_1.AUTH_CONSTANTS.RESET_TOKEN_EXPIRY_MS),
            },
        });
        await this.emailService.sendPasswordReset(dto.email, token);
        return { success: true };
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.HttpException('Invalid or expired token', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!user.resetTokenHash || !user.resetTokenExpiresAt) {
            throw new common_1.HttpException('No active reset request', common_1.HttpStatus.BAD_REQUEST);
        }
        if (new Date() > user.resetTokenExpiresAt) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    resetTokenHash: null,
                    resetTokenExpiresAt: null,
                },
            });
            throw new common_1.HttpException('Reset token has expired', common_1.HttpStatus.BAD_REQUEST);
        }
        const isValid = await this.passwordService.verifyResetToken(dto.token, user.resetTokenHash);
        if (!isValid) {
            throw new common_1.HttpException('Invalid token', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: await this.passwordService.hash(dto.newPassword),
                resetTokenHash: null,
                resetTokenExpiresAt: null,
            },
        });
        await this.tokenService.revokeAllRefreshTokens(user.id);
        return { success: true, message: 'Password reset successful' };
    }
    async logout(userId, refreshToken) {
        const revoked = await this.tokenService.revokeRefreshToken(userId, refreshToken);
        return {
            success: true,
            message: revoked ? 'Session logged out successfully' : 'Session already terminated',
        };
    }
    async logoutAll(userId) {
        await this.tokenService.revokeAllRefreshTokens(userId);
        return { success: true, message: 'All sessions logged out' };
    }
    async refreshTokens(userId, refreshToken) {
        return this.tokenService.refreshTokenPair(userId, refreshToken);
    }
    async getUserProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                province: true,
                commune: true,
                city: true,
                country: true,
                address: true,
                boutiqueName: true,
                kycStatus: true,
                trustScore: true,
                isVerified: true,
                avatarUrl: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return { success: true, user };
    }
    async resendOtp(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user || user.isVerified) {
            return { success: true };
        }
        await this.otpService.generateAndSend(user.id, user.email);
        return { success: true, message: 'New OTP sent' };
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.HttpException('Utilisateur non trouvé', common_1.HttpStatus.NOT_FOUND);
        }
        const data = {};
        if (dto.fullName)
            data.fullName = dto.fullName;
        if (dto.email)
            data.email = dto.email;
        if (dto.phone)
            data.phone = dto.phone;
        if (dto.province)
            data.province = dto.province;
        if (dto.commune)
            data.commune = dto.commune;
        if (dto.address)
            data.address = dto.address;
        if (dto.city)
            data.city = dto.city;
        if (dto.boutiqueName)
            data.boutiqueName = dto.boutiqueName;
        if (dto.avatarUrl)
            data.avatarUrl = dto.avatarUrl;
        if (dto.profilePicture && typeof dto.profilePicture === 'string') {
            data.avatarUrl = dto.profilePicture;
        }
        if (dto.password) {
            if (!dto.oldPassword) {
                throw new common_1.HttpException('L\'ancien mot de passe est requis', common_1.HttpStatus.BAD_REQUEST);
            }
            const isOldPasswordValid = await this.passwordService.compare(dto.oldPassword, user.password);
            if (!isOldPasswordValid) {
                throw new common_1.HttpException('L\'ancien mot de passe est incorrect', common_1.HttpStatus.UNAUTHORIZED);
            }
            data.password = await this.passwordService.hash(dto.password);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                province: true,
                commune: true,
                city: true,
                country: true,
                address: true,
                boutiqueName: true,
                kycStatus: true,
                trustScore: true,
                isVerified: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return { success: true, user: updatedUser };
    }
    async getUsersForTesting() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                isVerified: true,
                kycStatus: true,
                boutiqueName: true,
                province: true,
                commune: true,
                city: true,
                country: true,
                trustScore: true,
                createdAt: true,
            },
        });
    }
    async clearUsersForTesting() {
        await this.prisma.refreshToken.deleteMany({});
        await this.prisma.user.deleteMany({});
        this.logger.warn('All users and tokens cleared (DEV)');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        token_service_1.TokenService,
        otp_service_1.OtpService,
        password_service_1.PasswordService,
        user_validation_service_1.UserValidationService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map