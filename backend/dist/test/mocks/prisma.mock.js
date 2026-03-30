"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockVendor = exports.mockUser = exports.createMockPrismaService = void 0;
const client_1 = require("@prisma/client");
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
exports.createMockPrismaService = createMockPrismaService;
exports.mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    password: '$2a$10$hashedPassword',
    fullName: 'Test User',
    phone: '+243999999999',
    role: client_1.UserRole.CLIENT,
    kycStatus: client_1.KycStatus.NOT_REQUIRED,
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
exports.mockVendor = {
    ...exports.mockUser,
    id: 'test-vendor-id',
    email: 'vendor@example.com',
    role: client_1.UserRole.VENDOR,
    kycStatus: client_1.KycStatus.APPROVED,
    boutiqueName: 'Test Boutique',
    trustScore: 50,
};
//# sourceMappingURL=prisma.mock.js.map