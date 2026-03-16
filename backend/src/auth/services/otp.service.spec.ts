import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../common/email/email.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { MockedPrisma, MockedEmailService, createMockPrismaService, createMockEmailService } from '../../../test/mocks';

describe('OtpService', () => {
  let service: OtpService;
  let prisma: MockedPrisma;
  let emailService: MockedEmailService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    otpHash: '$2a$10$hashedotp',
    otpExpiresAt: new Date(Date.now() + 10000),
    otpAttempts: 0,
    province: 'Nord-Kivu',
    commune: 'Goma',
    city: 'Goma',
    country: 'RD Congo',
    isVerified: false,
  };

  beforeEach(async () => {
    prisma = createMockPrismaService();
    emailService = createMockEmailService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        { provide: PrismaService, useValue: prisma },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  describe('generateAndSend', () => {
    it('should generate, hash, save and send OTP', async () => {
      prisma.user.update.mockResolvedValue({});

      const otp = await service.generateAndSend(mockUser.id, mockUser.email);

      expect(otp).toHaveLength(6);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: expect.objectContaining({
          otpHash: expect.any(String),
          otpExpiresAt: expect.any(Date),
          otpAttempts: 0,
        }),
      });
      expect(emailService.sendOtp).toHaveBeenCalledWith(mockUser.email, otp);
    });
  });

  describe('verify', () => {
    it('should return true for valid OTP', async () => {
      const plainOtp = '123456';
      const hash = await bcrypt.hash(plainOtp, 1);
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, otpHash: hash });

      const result = await service.verify(mockUser.email, plainOtp);

      expect(result).toBe(true);
    });

    it('should throw error if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.verify('none@test.com', '123456'))
        .rejects.toThrow(new HttpException('Invalid OTP request', HttpStatus.BAD_REQUEST));
    });

    it('should throw error if OTP is expired', async () => {
      const expiredUser = { ...mockUser, otpExpiresAt: new Date(Date.now() - 1000) };
      prisma.user.findUnique.mockResolvedValue(expiredUser);

      await expect(service.verify(mockUser.email, '123456'))
        .rejects.toThrow(new HttpException('OTP expired', HttpStatus.BAD_REQUEST));
    });

    it('should throw error after max attempts', async () => {
      const blockedUser = { ...mockUser, otpAttempts: 3 };
      prisma.user.findUnique.mockResolvedValue(blockedUser);

      await expect(service.verify(mockUser.email, '123456'))
        .rejects.toThrow('Too many failed attempts');
      
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: expect.objectContaining({ otpHash: null }),
      });
    });

    it('should increment attempts on wrong OTP', async () => {
      const hash = await bcrypt.hash('correct-otp', 1);
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, otpHash: hash });
      prisma.user.update.mockResolvedValue({});

      await expect(service.verify(mockUser.email, 'wrong-otp'))
        .rejects.toThrow('Invalid OTP');
      
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { otpAttempts: { increment: 1 } },
      });
    });
  });

  describe('clearOtp', () => {
    it('should set OTP fields to null', async () => {
      await service.clearOtp(mockUser.id);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          otpHash: null,
          otpExpiresAt: null,
          otpAttempts: 0,
        },
      });
    });
  });
});

