import { PrismaClient, User, RefreshToken, UserRole, KycStatus } from '@prisma/client';

export type MockedPrisma = {
  user: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    deleteMany: jest.Mock;
  };
  refreshToken: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    delete: jest.Mock;
    deleteMany: jest.Mock;
  };
};

export const createMockPrismaService = (): MockedPrisma => ({
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

// Mock data par défaut
export const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  password: '$2a$10$hashedPassword',
  fullName: 'Test User',
  phone: '+243999999999',
  role: UserRole.CLIENT,
  kycStatus: KycStatus.NOT_REQUIRED,
  isVerified: true,
  trustScore: 70,
  province: 'Kinshasa',
  commune: 'Gombe',
  city: 'Kinshasa',
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
  avatarUrl: null,
  coverUrl: null,
  isActive: true,
};

export const mockVendor: User = {
  ...mockUser,
  id: 'test-vendor-id',
  email: 'vendor@example.com',
  role: UserRole.VENDOR,
  kycStatus: KycStatus.APPROVED,
  boutiqueName: 'Test Boutique',
  trustScore: 50,
};
