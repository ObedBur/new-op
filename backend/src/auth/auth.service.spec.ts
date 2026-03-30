import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../common/email/email.service';
import { TokenService } from './services/token.service';
import { OtpService } from './services/otp.service';
import { PasswordService } from './services/password.service';
import { UserValidationService } from './services/user-validation.service';
import { AUTH_CONSTANTS } from './constants/auth.constants';
import { UserRole, KycStatus, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

// ============================================================================
// MOCKS
// ============================================================================

const createMockPrismaService = () => ({
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  refreshToken: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
});

const createMockEmailService = () => ({
  sendOtp: jest.fn().mockResolvedValue(undefined),
  sendPasswordReset: jest.fn().mockResolvedValue(undefined),
  sendWelcome: jest.fn().mockResolvedValue(undefined),
});

const createMockTokenService = () => ({
  generateTokenPair: jest.fn().mockResolvedValue({
    access_token: 'mock.access.token',
    refresh_token: 'mock.refresh.token',
  }),
  saveRefreshToken: jest.fn().mockResolvedValue(undefined),
  revokeRefreshToken: jest.fn().mockImplementation((userId, token) => {
    if (!token) {
      throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);
    }
    return Promise.resolve(true);
  }),
  revokeAllRefreshTokens: jest.fn().mockResolvedValue(1),
  refreshTokenPair: jest.fn().mockImplementation((userId, token) => {
    if (!token) {
      throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);
    }
    return Promise.resolve({
      access_token: 'new.access.token',
      refresh_token: 'new.refresh.token',
    });
  }),
});

const createMockOtpService = () => ({
  generateAndSend: jest.fn().mockResolvedValue('123456'),
  verify: jest.fn().mockResolvedValue(true),
  clearOtp: jest.fn().mockResolvedValue(undefined),
});

const createMockPasswordService = () => ({
  hash: jest.fn().mockImplementation((p) => Promise.resolve(`$2a$10$hashed_${p}`)),
  compare: jest.fn().mockImplementation((p, h) => Promise.resolve(h === `$2a$10$hashed_${p}`)),
  validateComplexity: jest.fn().mockReturnValue(undefined),
  generateResetToken: jest.fn().mockResolvedValue({ token: 'mock-reset-token', hash: 'mock-reset-hash' }),
  verifyResetToken: jest.fn().mockImplementation((t, h) => Promise.resolve(h === 'mock-reset-hash')),
});

const createMockUserValidationService = () => ({
  getInitialTrustScore: jest.fn().mockReturnValue(70),
  getInitialKycStatus: jest.fn().mockReturnValue(KycStatus.NOT_REQUIRED),
  validateLoginEligibility: jest.fn().mockReturnValue(undefined),
  calculateScoreAfterVerification: jest.fn().mockReturnValue(90),
});

// ============================================================================
// TEST DATA
// ============================================================================

const createMockUser = (overrides: Partial<User> = {}) => ({
  id: 'user-id-123',
  email: 'test@example.com',
  password: bcrypt.hashSync('Password123!@#', 10),
  fullName: 'Test User',
  phone: '+243999999999',
  role: UserRole.CLIENT,
  kycStatus: KycStatus.NOT_REQUIRED,
  isVerified: true,
  trustScore: 70,
  province: 'Nord-Kivu',
  commune: 'Goma',
  city: 'Goma',
  country: 'RD Congo',
  address: null,
  boutiqueName: null,
  otpHash: null,
  otpExpiresAt: null,
  otpAttempts: 0,
  resetTokenHash: null,
  resetTokenExpiresAt: null,
  kycSubmittedAt: null,
  kycApprovedAt: null,
  kycRejectedAt: null,
  kycRejectionReason: null,
  lastPublicationDate: null,
  dailyPublications: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const createMockVendor = (overrides: Partial<User> = {}) => createMockUser({
  id: 'vendor-id-123',
  email: 'vendor@example.com',
  role: UserRole.VENDOR,
  kycStatus: KycStatus.APPROVED,
  boutiqueName: 'Test Boutique',
  trustScore: 70,
  ...overrides,
});

const createRegisterDto = (role: 'CLIENT' | 'VENDOR' = 'CLIENT') => {
  const base = {
    email: 'newuser@example.com',
    password: 'StrongPassword123!@#',
    fullName: 'New User',
    phone: '+243888888888',
    province: 'Kinshasa',
    commune: 'Kalamu',
    role: role as UserRole,
    address: '456 New Street',
  };

  if (role === 'VENDOR') {
    return { ...base, boutiqueName: 'New Boutique' };
  }

  return base;
};

// ============================================================================
// TEST SUITE
// ============================================================================

describe('AuthService', () => {
  let service: AuthService;
  let prisma: ReturnType<typeof createMockPrismaService>;
  let emailService: ReturnType<typeof createMockEmailService>;
  let tokenService: ReturnType<typeof createMockTokenService>;
  let otpService: ReturnType<typeof createMockOtpService>;
  let passwordService: ReturnType<typeof createMockPasswordService>;
  let userValidationService: ReturnType<typeof createMockUserValidationService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();
    emailService = createMockEmailService();
    tokenService = createMockTokenService();
    otpService = createMockOtpService();
    passwordService = createMockPasswordService();
    userValidationService = createMockUserValidationService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: EmailService, useValue: emailService },
        { provide: TokenService, useValue: tokenService },
        { provide: OtpService, useValue: otpService },
        { provide: PasswordService, useValue: passwordService },
        { provide: UserValidationService, useValue: userValidationService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.JWT_ACCESS_SECRET = 'test_jwt_secret_min_32_chars_here';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_min_32_chars';
    process.env.JWT_ACCESS_EXPIRATION = '15m';
    process.env.JWT_REFRESH_EXPIRATION = '7d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================================================
  // REGISTER TESTS
  // ==========================================================================

  describe('register', () => {
    it('should successfully register a new CLIENT', async () => {
      const dto = createRegisterDto('CLIENT');
      prisma.user.findFirst.mockResolvedValue(null); // No existing user
      prisma.user.create.mockResolvedValue(createMockUser({ email: dto.email, isVerified: false }));

      const result = await service.register(dto);

      expect(result).toEqual({
        success: true,
        message: 'Registration successful. Verify OTP.',
        requiresKyc: false,
      });
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(otpService.generateAndSend).toHaveBeenCalledWith(expect.any(String), dto.email);
    });

    it('should create CLIENT with NOT_REQUIRED KYC status', async () => {
      const dto = createRegisterDto('CLIENT');
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createMockUser());

      await service.register(dto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          kycStatus: KycStatus.NOT_REQUIRED,
          trustScore: 70,
        }),
      });
    });

    it('should successfully register a new VENDOR with boutiqueName', async () => {
      const dto = createRegisterDto('VENDOR');
      userValidationService.getInitialTrustScore.mockReturnValue(50);
      userValidationService.getInitialKycStatus.mockReturnValue(KycStatus.PENDING);
      
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createMockVendor({ email: dto.email, isVerified: false, kycStatus: KycStatus.PENDING }));

      const result = await service.register(dto);

      expect(result).toEqual({
        success: true,
        message: 'Registration successful. Verify OTP.',
        requiresKyc: true,
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          role: UserRole.VENDOR,
          kycStatus: KycStatus.PENDING,
          trustScore: 50,
          boutiqueName: (dto as any).boutiqueName,
        }),
      });
    });

    it('should reject VENDOR registration without boutiqueName', async () => {
      const dto = { ...createRegisterDto('VENDOR'), boutiqueName: undefined } as any;
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.register(dto)).rejects.toThrow(
        new HttpException('Boutique name is required for vendors', HttpStatus.BAD_REQUEST)
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject duplicate email', async () => {
      const dto = createRegisterDto('CLIENT');
      prisma.user.findFirst.mockResolvedValue(createMockUser());

      await expect(service.register(dto)).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.CONFLICT)
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject duplicate phone', async () => {
      const dto = createRegisterDto('CLIENT');
      prisma.user.findFirst.mockResolvedValue(createMockUser({ phone: dto.phone }));

      await expect(service.register(dto)).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.CONFLICT)
      );
    });

    it('should send OTP email after successful registration', async () => {
      const dto = createRegisterDto('CLIENT');
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createMockUser());

      await service.register(dto);

      expect(otpService.generateAndSend).toHaveBeenCalledTimes(1);
    });

    it('should hash the password before storing', async () => {
      const dto = createRegisterDto('CLIENT');
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createMockUser());

      await service.register(dto);

      const createCall = prisma.user.create.mock.calls[0][0];
      expect(createCall.data.password).not.toBe(dto.password);
      expect(createCall.data.password).toMatch(/^\$2[aby]?\$/);
    });
  });

  // ==========================================================================
  // VERIFY OTP TESTS
  // ==========================================================================

  describe('verifyOtp', () => {
    const validOtp = '123456';
    
    it('should successfully verify valid OTP', async () => {
      const user = createMockUser({ isVerified: false });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue({ ...user, isVerified: true });

      const result = await service.verifyOtp({ email: user.email, otp: '123456' });

      expect(result).toEqual({ success: true, message: 'Account verified successfully' });
      expect(otpService.verify).toHaveBeenCalledWith(user.email, '123456');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: expect.objectContaining({ isVerified: true }),
      });
    });

    it('should throw error if user not found during verification', async () => {
      otpService.verify.mockResolvedValue(true);
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.verifyOtp({ email: 'nonexistent@example.com', otp: '123456' }))
        .rejects.toThrow(new HttpException('User not found', HttpStatus.NOT_FOUND));
    });
  });

  // ==========================================================================
  // LOGIN TESTS
  // ==========================================================================

  describe('login', () => {
    it('should successfully login a verified CLIENT', async () => {
      const user = createMockUser();
      const password = 'Password123!@#';
      user.password = `$2a$10$hashed_${password}`;
      
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({ email: user.email, password });

      expect(result).toEqual({
        success: true,
        access_token: expect.any(String),
        refresh_token: expect.any(String),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          trustScore: user.trustScore,
        },
      });
    });

    it('should successfully login an approved VENDOR', async () => {
      const vendor = createMockVendor();
      const password = 'Password123!@#';
      vendor.password = `$2a$10$hashed_${password}`;

      prisma.user.findUnique.mockResolvedValue(vendor);
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({ email: vendor.email, password });

      expect(result.success).toBe(true);
      expect(result.user.role).toBe(UserRole.VENDOR);
    });

    it('should reject non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: 'nonexistent@example.com', password: 'any' }))
        .rejects.toThrow(new HttpException('User not found', HttpStatus.NOT_FOUND));
    });

    it('should reject wrong password', async () => {
      const user = createMockUser();
      prisma.user.findUnique.mockResolvedValue(user);

      await expect(service.login({ email: user.email, password: 'wrongpassword' }))
        .rejects.toThrow(new HttpException('Invalid password', HttpStatus.UNAUTHORIZED));
    });

    it('should reject unverified user', async () => {
      const user = createMockUser({ isVerified: false });
      const password = 'Password123!@#';
      user.password = `$2a$10$hashed_${password}`;
      prisma.user.findUnique.mockResolvedValue(user);

      userValidationService.validateLoginEligibility.mockImplementation(() => {
        throw new HttpException('Account not verified', HttpStatus.FORBIDDEN);
      });

      await expect(service.login({ email: user.email, password }))
        .rejects.toThrow(new HttpException('Account not verified', HttpStatus.FORBIDDEN));
    });

    it('should reject VENDOR with pending KYC', async () => {
      const vendor = createMockVendor({ kycStatus: KycStatus.PENDING });
      const password = 'Password123!@#';
      vendor.password = `$2a$10$hashed_${password}`;
      prisma.user.findUnique.mockResolvedValue(vendor);

      userValidationService.validateLoginEligibility.mockImplementation(() => {
        throw new HttpException('KYC verification required', HttpStatus.FORBIDDEN);
      });

      await expect(service.login({ email: vendor.email, password }))
        .rejects.toThrow(new HttpException('KYC verification required', HttpStatus.FORBIDDEN));
    });

    it('should reject VENDOR with rejected KYC', async () => {
      const vendor = createMockVendor({ kycStatus: KycStatus.REJECTED });
      const password = 'Password123!@#';
      vendor.password = `$2a$10$hashed_${password}`;
      prisma.user.findUnique.mockResolvedValue(vendor);

      userValidationService.validateLoginEligibility.mockImplementation(() => {
        throw new HttpException('KYC verification required', HttpStatus.FORBIDDEN);
      });

      await expect(service.login({ email: vendor.email, password }))
        .rejects.toThrow(new HttpException('KYC verification required', HttpStatus.FORBIDDEN));
    });

    it('should save refresh token after successful login', async () => {
      const user = createMockUser();
      const password = 'Password123!@#';
      user.password = `$2a$10$hashed_${password}`;
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.refreshToken.create.mockResolvedValue({});

      await service.login({ email: user.email, password });

      expect(tokenService.saveRefreshToken).toHaveBeenCalledTimes(1);
      expect(tokenService.saveRefreshToken).toHaveBeenCalledWith(
        user.id,
        expect.any(String),
      );
    });

    it('should generate both access and refresh tokens', async () => {
      const user = createMockUser();
      const password = 'Password123!@#';
      user.password = `$2a$10$hashed_${password}`;
      prisma.user.findUnique.mockResolvedValue(user);

      await service.login({ email: user.email, password });

      expect(tokenService.generateTokenPair).toHaveBeenCalledWith(user);
    });
  });

  // ==========================================================================
  // FORGOT PASSWORD TESTS
  // ==========================================================================

  describe('forgotPassword', () => {
    it('should send reset email for existing user', async () => {
      const user = createMockUser();
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      const result = await service.forgotPassword({ email: user.email });

      expect(result).toEqual({ success: true });
      expect(emailService.sendPasswordReset).toHaveBeenCalledWith(user.email, expect.any(String));
    });

    it('should store hashed reset token', async () => {
      const user = createMockUser();
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      await service.forgotPassword({ email: user.email });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: expect.objectContaining({
          resetTokenHash: expect.any(String),
          resetTokenExpiresAt: expect.any(Date),
        }),
      });
    });

    it('should set token expiry to 1 hour', async () => {
      const user = createMockUser();
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      await service.forgotPassword({ email: user.email });

      const updateCall = prisma.user.update.mock.calls[0][0];
      const expiresAt = updateCall.data.resetTokenExpiresAt;
      const oneHourFromNow = Date.now() + 60 * 60 * 1000;
      
      // Should be within 1 second of one hour from now
      expect(Math.abs(expiresAt.getTime() - oneHourFromNow)).toBeLessThan(1000);
    });

    it('should return success for non-existent user (security)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword({ email: 'nonexistent@example.com' });

      expect(result).toEqual({ success: true });
      expect(emailService.sendPasswordReset).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // RESET PASSWORD TESTS
  // ==========================================================================

  describe('resetPassword', () => {
    const validToken = 'valid-reset-token-123';

    it('should successfully reset password with valid token', async () => {
      const user = createMockUser({
        resetTokenHash: 'mock-reset-hash',
        resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);
      prisma.refreshToken.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.resetPassword({
        email: user.email,
        token: validToken,
        newPassword: 'NewPassword123!@#',
      });

      expect(result).toEqual({ success: true, message: 'Password reset successful' });
    });

    it('should hash the new password', async () => {
      const user = createMockUser({
        resetTokenHash: 'mock-reset-hash',
        resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);
      prisma.refreshToken.deleteMany.mockResolvedValue({ count: 0 });

      await service.resetPassword({
        email: user.email,
        token: validToken,
        newPassword: 'NewPassword123!@#',
      });

      const updateCall = prisma.user.update.mock.calls[0][0];
      expect(updateCall.data.password).toMatch(/^\$2[aby]?\$/);
    });

    it('should clear reset token after successful reset', async () => {
      const user = createMockUser({
        resetTokenHash: 'mock-reset-hash',
        resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);
      prisma.refreshToken.deleteMany.mockResolvedValue({ count: 0 });

      await service.resetPassword({
        email: user.email,
        token: validToken,
        newPassword: 'NewPassword123!@#',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: expect.objectContaining({
          resetTokenHash: null,
          resetTokenExpiresAt: null,
        }),
      });
    });

    it('should invalidate all sessions after password reset', async () => {
      const user = createMockUser({
        resetTokenHash: 'mock-reset-hash',
        resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      await service.resetPassword({
        email: user.email,
        token: validToken,
        newPassword: 'NewPassword123!@#',
      });

      expect(tokenService.revokeAllRefreshTokens).toHaveBeenCalledWith(user.id);
    });

    it('should reject non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.resetPassword({
        email: 'nonexistent@example.com',
        token: validToken,
        newPassword: 'NewPassword123!@#',
      })).rejects.toThrow(new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST));
    });

    it('should reject invalid token', async () => {
      const user = createMockUser({
        resetTokenHash: 'mock-reset-hash',
        resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      prisma.user.findUnique.mockResolvedValue(user);

      passwordService.verifyResetToken.mockResolvedValue(false);

      await expect(service.resetPassword({
        email: user.email,
        token: 'wrong-token',
        newPassword: 'NewPassword123!@#',
      })).rejects.toThrow(new HttpException('Invalid token', HttpStatus.BAD_REQUEST));
    });

    it('should reject expired token', async () => {
      const user = createMockUser({
        resetTokenHash: 'mock-reset-hash',
        resetTokenExpiresAt: new Date(Date.now() - 1000), // Expired
      });
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(user);

      await expect(service.resetPassword({
        email: user.email,
        token: validToken,
        newPassword: 'NewPassword123!@#',
      })).rejects.toThrow(new HttpException('Reset token has expired', HttpStatus.BAD_REQUEST));
    });

    it('should reject if no reset token exists', async () => {
      const user = createMockUser({
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      });
      prisma.user.findUnique.mockResolvedValue(user);

      await expect(service.resetPassword({
        email: user.email,
        token: validToken,
        newPassword: 'NewPassword123!@#',
      })).rejects.toThrow(new HttpException('No active reset request', HttpStatus.BAD_REQUEST));
    });
  });

  // ==========================================================================
  // LOGOUT TESTS
  // ==========================================================================

  describe('logout', () => {
    it('should successfully logout with valid token', async () => {
      const result = await service.logout('user-id-123', 'valid-refresh-token');

      expect(result.success).toBe(true);
      expect(tokenService.revokeRefreshToken).toHaveBeenCalledWith(
        'user-id-123',
        'valid-refresh-token',
      );
    });

    it('should succeed even if token not found', async () => {
      tokenService.revokeRefreshToken.mockResolvedValue(false);

      const result = await service.logout('user-id-123', 'unknown-token');

      expect(result).toEqual({ success: true, message: 'Session already terminated' });
    });

    it('should reject if no refresh token provided', async () => {
      await expect(service.logout('user-id-123', ''))
        .rejects.toThrow('Refresh token is required');
    });
  });

  // ==========================================================================
  // LOGOUT ALL TESTS
  // ==========================================================================

  describe('logoutAll', () => {
    it('should remove all refresh tokens for user', async () => {
      const result = await service.logoutAll('user-id-123');

      expect(result.success).toBe(true);
      expect(tokenService.revokeAllRefreshTokens).toHaveBeenCalledWith('user-id-123');
    });
  });

  // ==========================================================================
  // REFRESH TOKENS TESTS
  // ==========================================================================

  describe('refreshTokens', () => {
    it('should successfully refresh tokens calling tokenService', async () => {
      const result = await service.refreshTokens('user-123', 'refresh-token');

      expect(result).toHaveProperty('access_token');
      expect(tokenService.refreshTokenPair).toHaveBeenCalledWith('user-123', 'refresh-token');
    });
  });

  // ==========================================================================
  // GET USER PROFILE TESTS
  // ==========================================================================

  describe('getUserProfile', () => {
    it('should return user profile for valid user', async () => {
      const user = createMockUser();
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.getUserProfile(user.id);

      expect(result).toEqual({
        success: true,
        user: expect.objectContaining({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        }),
      });
    });

    it('should not include password in profile', async () => {
      const user = createMockUser();
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.getUserProfile(user.id);

      // The select query should not include password
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: user.id },
        select: expect.not.objectContaining({ password: true }),
      });
    });

    it('should reject if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserProfile('nonexistent-id'))
        .rejects.toThrow(new HttpException('User not found', HttpStatus.NOT_FOUND));
    });
  });

  // ==========================================================================
  // RESEND OTP TESTS
  // ==========================================================================

  describe('resendOtp', () => {
    it('should resend OTP for unverified user', async () => {
      const user = createMockUser({ isVerified: false });
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.resendOtp(user.email);

      expect(result).toEqual({ success: true, message: 'New OTP sent' });
      expect(otpService.generateAndSend).toHaveBeenCalledWith(user.id, user.email);
    });

    it('should return success for non-existent user (security)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.resendOtp('nonexistent@example.com');

      expect(result).toEqual({ success: true });
      expect(otpService.generateAndSend).not.toHaveBeenCalled();
    });

    it('should return success for already verified user', async () => {
      const user = createMockUser({ isVerified: true });
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.resendOtp(user.email);

      expect(result).toEqual({ success: true });
      expect(otpService.generateAndSend).not.toHaveBeenCalled();
    });
  });
});

