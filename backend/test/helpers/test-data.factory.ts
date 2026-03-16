import { User, UserRole, KycStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

/**
 * Factory pour générer des données de test (sans dépendances externes)
 */
export class TestDataFactory {
  private static userCounter = 0;

  /**
   * Crée un utilisateur de test avec des données
   */
  static async createUser(overrides?: Partial<User>): Promise<User> {
    TestDataFactory.userCounter++;
    const suffix = TestDataFactory.userCounter;

    const defaultUser: User = {
      id: `user-id-${suffix}`,
      email: `user${suffix}@example.com`,
      password: await bcrypt.hash('Password123!@#', 10),
      fullName: `Test User ${suffix}`,
      phone: `+2439${String(suffix).padStart(8, '0')}`,
      role: UserRole.CLIENT,
      kycStatus: KycStatus.NOT_REQUIRED,
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

  /**
   * Crée un vendeur de test
   */
  static async createVendor(overrides?: Partial<User>): Promise<User> {
    return this.createUser({
      role: UserRole.VENDOR,
      kycStatus: KycStatus.PENDING,
      boutiqueName: `Boutique Test ${TestDataFactory.userCounter}`,
      trustScore: 50,
      ...overrides,
    });
  }

  /**
   * Crée un utilisateur vérifié
   */
  static async createVerifiedUser(overrides?: Partial<User>): Promise<User> {
    return this.createUser({
      isVerified: true,
      trustScore: 90,
      ...overrides,
    });
  }

  /**
   * Crée un vendeur approuvé (KYC validé)
   */
  static async createApprovedVendor(overrides?: Partial<User>): Promise<User> {
    return this.createVendor({
      isVerified: true,
      kycStatus: KycStatus.APPROVED,
      trustScore: 70,
      ...overrides,
    });
  }

  /**
   * Crée un admin de test
   */
  static async createAdmin(overrides?: Partial<User>): Promise<User> {
    return this.createUser({
      role: UserRole.ADMIN,
      isVerified: true,
      kycStatus: KycStatus.NOT_REQUIRED,
      trustScore: 100,
      ...overrides,
    });
  }

  /**
   * Génère un DTO de registration valide
   */
  static createRegisterDto(role: 'CLIENT' | 'VENDOR' = 'CLIENT') {
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

  /**
   * Génère un code OTP de test (6 chiffres)
   */
  static createOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  /**
   * Hash un OTP pour les tests
   */
  static async createOtpHash(otp: string): Promise<string> {
    return bcrypt.hash(otp, 10);
  }

  /**
   * Génère un token de reset de test (32 caractères hex)
   */
  static createResetToken(): string {
    const chars = '0123456789abcdef';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  }

  /**
   * Génère un email de test
   */
  static createEmail(): string {
    return `test${++TestDataFactory.userCounter}@example.com`;
  }

  /**
   * Génère un numéro de téléphone congolais valide
   */
  static createPhone(): string {
    return `+243${String(++TestDataFactory.userCounter).padStart(9, '0')}`;
  }

  /**
   * Reset le compteur (utile pour les tests)
   */
  static reset(): void {
    TestDataFactory.userCounter = 0;
  }
}
