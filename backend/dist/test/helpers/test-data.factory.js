"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDataFactory = void 0;
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
class TestDataFactory {
    static async createUser(overrides) {
        TestDataFactory.userCounter++;
        const suffix = TestDataFactory.userCounter;
        const defaultUser = {
            id: `user-id-${suffix}`,
            email: `user${suffix}@example.com`,
            password: await bcrypt.hash('Password123!@#', 10),
            fullName: `Test User ${suffix}`,
            phone: `+2439${String(suffix).padStart(8, '0')}`,
            role: client_1.UserRole.CLIENT,
            kycStatus: client_1.KycStatus.NOT_REQUIRED,
            isVerified: false,
            trustScore: 70,
            province: 'Kinshasa',
            commune: 'Gombe',
            city: 'Kinshasa',
            country: 'RD Congo',
            address: `${suffix} Test Street`,
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
        return { ...defaultUser, ...overrides };
    }
    static async createVendor(overrides) {
        return this.createUser({
            role: client_1.UserRole.VENDOR,
            kycStatus: client_1.KycStatus.PENDING,
            boutiqueName: `Boutique Test ${TestDataFactory.userCounter}`,
            trustScore: 50,
            ...overrides,
        });
    }
    static async createVerifiedUser(overrides) {
        return this.createUser({
            isVerified: true,
            trustScore: 90,
            ...overrides,
        });
    }
    static async createApprovedVendor(overrides) {
        return this.createVendor({
            isVerified: true,
            kycStatus: client_1.KycStatus.APPROVED,
            trustScore: 70,
            ...overrides,
        });
    }
    static async createAdmin(overrides) {
        return this.createUser({
            role: client_1.UserRole.ADMIN,
            isVerified: true,
            kycStatus: client_1.KycStatus.NOT_REQUIRED,
            trustScore: 100,
            ...overrides,
        });
    }
    static createRegisterDto(role = 'CLIENT') {
        const suffix = ++TestDataFactory.userCounter;
        const base = {
            email: `newuser${suffix}@example.com`,
            password: 'ValidPassword123!@#',
            fullName: `New User ${suffix}`,
            phone: `+2438${String(suffix).padStart(8, '0')}`,
            province: 'Kinshasa',
            commune: 'Kalamu',
            city: 'Kinshasa',
            country: 'RD Congo',
            role,
            address: `${suffix} New Street`,
        };
        if (role === 'VENDOR') {
            return {
                ...base,
                boutiqueName: `New Boutique ${suffix}`,
            };
        }
        return base;
    }
    static createOtp() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }
    static async createOtpHash(otp) {
        return bcrypt.hash(otp, 10);
    }
    static createResetToken() {
        const chars = '0123456789abcdef';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }
    static createEmail() {
        return `test${++TestDataFactory.userCounter}@example.com`;
    }
    static createPhone() {
        return `+243${String(++TestDataFactory.userCounter).padStart(9, '0')}`;
    }
    static reset() {
        TestDataFactory.userCounter = 0;
    }
}
exports.TestDataFactory = TestDataFactory;
TestDataFactory.userCounter = 0;
//# sourceMappingURL=test-data.factory.js.map