import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../common/email/email.service';
import { UserRole } from '@prisma/client';
import { AUTH_CONSTANTS } from './constants/auth.constants';

import { TokenService } from './services/token.service';
import { OtpService } from './services/otp.service';
import { PasswordService } from './services/password.service';
import { UserValidationService } from './services/user-validation.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly passwordService: PasswordService,
    private readonly userValidationService: UserValidationService,
    private readonly emailService: EmailService,
  ) {}

  // ========================= REGISTER =========================

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    if (dto.role === UserRole.VENDOR && !dto.boutiqueName) {
      throw new HttpException(
        'Boutique name is required for vendors',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validation du mot de passe (Production Ready)
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
      requiresKyc: dto.role === UserRole.VENDOR,
    };
  }

  // ========================= VERIFY OTP =========================

  async verifyOtp(dto: VerifyOtpDto) {
    await this.otpService.verify(dto.email, dto.otp);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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

    return { success: true, message: 'Account verified successfully' };
  }

  // ========================= LOGIN =========================

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!(await this.passwordService.compare(dto.password, user.password))) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
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

  // ========================= FORGOT PASSWORD =========================

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) return { success: true };

    const { token, hash: tokenHash } = await this.passwordService.generateResetToken();

    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`[DEV RESET TOKEN] ${dto.email} -> ${token}`);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: new Date(Date.now() + AUTH_CONSTANTS.RESET_TOKEN_EXPIRY_MS),
      },
    });

    await this.emailService.sendPasswordReset(dto.email, token);
    return { success: true };
  }

  // ========================= RESET PASSWORD (CORRIG) =========================

  async resetPassword(dto: ResetPasswordDto) {
    // VRIFICATION PAR EMAIL - CORRECTION CRITIQUE
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
    }

    if (!user.resetTokenHash || !user.resetTokenExpiresAt) {
      throw new HttpException('No active reset request', HttpStatus.BAD_REQUEST);
    }

    if (new Date() > user.resetTokenExpiresAt) {
      // Nettoyer le token expir
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetTokenHash: null,
          resetTokenExpiresAt: null,
        },
      });
      throw new HttpException('Reset token has expired', HttpStatus.BAD_REQUEST);
    }

    const isValid = await this.passwordService.verifyResetToken(dto.token, user.resetTokenHash);
    if (!isValid) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await this.passwordService.hash(dto.newPassword),
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
    });

    // Invalidate all sessions after password change
    await this.tokenService.revokeAllRefreshTokens(user.id);

    return { success: true, message: 'Password reset successful' };
  }

  // ========================= LOGOUT =========================

  async logout(userId: string, refreshToken: string) {
    const revoked = await this.tokenService.revokeRefreshToken(userId, refreshToken);

    return {
      success: true,
      message: revoked ? 'Session logged out successfully' : 'Session already terminated',
    };
  }

  async logoutAll(userId: string) {
    await this.tokenService.revokeAllRefreshTokens(userId);
    return { success: true, message: 'All sessions logged out' };
  }

  // ========================= REFRESH =========================

  async refreshTokens(userId: string, refreshToken: string) {
    return this.tokenService.refreshTokenPair(userId, refreshToken);
  }

  // ========================= UTILITY =========================

  async getUserProfile(userId: string) {
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
        createdAt: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return { success: true, user };
  }

  async resendOtp(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.isVerified) {
      return { success: true };
    }

    await this.otpService.generateAndSend(user.id, user.email);
    return { success: true, message: 'New OTP sent' };
  }

  // ========================= DEV METHODS =========================

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
}

