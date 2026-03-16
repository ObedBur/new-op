import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
  product: {
    count: jest.fn(),
  },
  order: {
    findMany: jest.fn(),
    aggregate: jest.fn(),
  },
};

describe('AdminService', () => {
  let service: AdminService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────
  // updateKycStatus
  // ─────────────────────────────────────────────────────────────
  describe('updateKycStatus', () => {
    it('should update KYC status for a vendor', async () => {
      const userId = 'vendor-id';
      const mockUser = { id: userId, role: 'VENDOR', trustScore: 0, email: 'vendor@test.com' };
      const updatedUser = { ...mockUser, kycStatus: 'APPROVED', trustScore: 30 };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateKycStatus(userId, 'APPROVED');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { kycStatus: 'APPROVED', trustScore: 30 },
      });
      expect(result.success).toBe(true);
      expect(result.data.kycStatus).toBe('APPROVED');
    });

    it('should throw BadRequestException for invalid status', async () => {
      await expect(service.updateKycStatus('id', 'INVALID_STATUS'))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.updateKycStatus('id', 'APPROVED'))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user is not a vendor', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'id', role: 'CLIENT' });
      await expect(service.updateKycStatus('id', 'APPROVED'))
        .rejects.toThrow(BadRequestException);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // getStats (enrichi avec products + sales)
  // ─────────────────────────────────────────────────────────────
  describe('getStats', () => {
    it('should return complete platform statistics including products and sales', async () => {
      prisma.user.count
        .mockResolvedValueOnce(100)  // totalUsers
        .mockResolvedValueOnce(80)   // totalClients
        .mockResolvedValueOnce(20)   // totalVendors
        .mockResolvedValueOnce(10)   // verifiedUsers
        .mockResolvedValueOnce(5)    // pendingKyc
        .mockResolvedValueOnce(15);  // approvedKyc

      prisma.product.count.mockResolvedValue(842);
      prisma.order.aggregate.mockResolvedValue({ _sum: { totalPrice: 1250000 } });

      const result = await service.getStats();

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        users: {
          total: 100,
          clients: 80,
          vendors: 20,
          verified: 10,
        },
        products: {
          total: 842,
        },
        sales: {
          total: 1250000,
        },
        kyc: {
          pending: 5,
          approved: 15,
        },
      });
      expect(prisma.user.count).toHaveBeenCalledTimes(6);
      expect(prisma.product.count).toHaveBeenCalledTimes(1);
      expect(prisma.order.aggregate).toHaveBeenCalledWith({ _sum: { totalPrice: true } });
      expect(result.timestamp).toBeDefined();
    });

    it('should handle zero sales gracefully', async () => {
      prisma.user.count.mockResolvedValue(0);
      prisma.product.count.mockResolvedValue(0);
      prisma.order.aggregate.mockResolvedValue({ _sum: { totalPrice: null } });

      const result = await service.getStats();

      expect(result.success).toBe(true);
      expect(result.data.sales.total).toBe(0);
      expect(result.data.products.total).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // getRecentActivities
  // ─────────────────────────────────────────────────────────────
  describe('getRecentActivities', () => {
    it('should return merged activities from orders, vendors and KYC updates', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          customerName: 'Marie Claire',
          totalPrice: 45000,
          createdAt: new Date('2026-02-20T14:00:00Z'),
        },
        {
          id: 'order-2',
          customerName: 'Jean Dupont',
          totalPrice: 28000,
          createdAt: new Date('2026-02-19T10:00:00Z'),
        },
      ];

      const mockVendors = [
        {
          id: 'vendor-1',
          fullName: 'Jean Kamanda',
          boutiqueName: 'Boutique du Lac',
          createdAt: new Date('2026-02-20T10:00:00Z'),
        },
      ];

      const mockKycUsers = [
        {
          id: 'kyc-1',
          fullName: 'Alice Mbala',
          boutiqueName: 'Mode Kinshasa',
          kycStatus: 'APPROVED',
          updatedAt: new Date('2026-02-20T12:00:00Z'),
        },
      ];

      prisma.order.findMany.mockResolvedValue(mockOrders);
      prisma.user.findMany
        .mockResolvedValueOnce(mockVendors)  // Vendors query
        .mockResolvedValueOnce(mockKycUsers); // KYC query

      const result = await service.getRecentActivities();

      expect(result.success).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(10);

      // Vérifier le tri par date décroissante
      const timestamps = result.data.map(a => new Date(a.timestamp).getTime());
      for (let i = 1; i < timestamps.length; i++) {
        expect(timestamps[i]).toBeLessThanOrEqual(timestamps[i - 1]);
      }

      // Vérifier les types d'activité présents
      const types = result.data.map(a => a.type);
      expect(types).toContain('order');
      expect(types).toContain('vendor_registration');
      expect(types).toContain('kyc_update');

      // Vérifier la structure d'une activité commande
      const orderActivity = result.data.find(a => a.type === 'order');
      expect(orderActivity).toBeDefined();
      expect(orderActivity!.id).toMatch(/^ord_/);
      expect(orderActivity!.description).toContain('Marie Claire');
      expect(orderActivity!.metadata).toHaveProperty('orderId');
      expect(orderActivity!.metadata).toHaveProperty('total');
      expect(orderActivity!.metadata).toHaveProperty('customerName');

      // Vérifier la structure d'une activité vendeur
      const vendorActivity = result.data.find(a => a.type === 'vendor_registration');
      expect(vendorActivity).toBeDefined();
      expect(vendorActivity!.id).toMatch(/^usr_/);
      expect(vendorActivity!.description).toContain('Boutique du Lac');
      expect(vendorActivity!.metadata).toHaveProperty('userId');
      expect(vendorActivity!.metadata).toHaveProperty('boutiqueName');

      // Vérifier la structure d'une activité KYC
      const kycActivity = result.data.find(a => a.type === 'kyc_update');
      expect(kycActivity).toBeDefined();
      expect(kycActivity!.id).toMatch(/^kyc_/);
      expect(kycActivity!.description).toContain('Mode Kinshasa');
      expect(kycActivity!.description).toContain('APPROVED');
      expect(kycActivity!.metadata).toHaveProperty('newStatus', 'APPROVED');
    });

    it('should return empty array when no data exists', async () => {
      prisma.order.findMany.mockResolvedValue([]);
      prisma.user.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await service.getRecentActivities();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should limit results to 10 activities', async () => {
      // Créer 6 commandes + 6 vendeurs = 12 au total, mais limité à 10
      const manyOrders = Array.from({ length: 6 }, (_, i) => ({
        id: `order-${i}`,
        customerName: `Client ${i}`,
        totalPrice: 10000 * (i + 1),
        createdAt: new Date(`2026-02-${20 - i}T10:00:00Z`),
      }));

      const manyVendors = Array.from({ length: 6 }, (_, i) => ({
        id: `vendor-${i}`,
        fullName: `Vendeur ${i}`,
        boutiqueName: `Boutique ${i}`,
        createdAt: new Date(`2026-02-${19 - i}T10:00:00Z`),
      }));

      prisma.order.findMany.mockResolvedValue(manyOrders);
      prisma.user.findMany
        .mockResolvedValueOnce(manyVendors)
        .mockResolvedValueOnce([]);

      const result = await service.getRecentActivities();

      expect(result.data.length).toBe(10);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // getPendingKyc
  // ─────────────────────────────────────────────────────────────
  describe('getPendingKyc', () => {
    it('should return pending KYC vendors', async () => {
      const mockPendingVendors = [
        {
          id: 'v1',
          email: 'v1@test.com',
          fullName: 'Vendeur Un',
          phone: '+243999000001',
          boutiqueName: 'Boutique Un',
          province: 'Nord-Kivu',
          commune: 'Goma',
          createdAt: new Date('2026-02-15T10:00:00Z'),
        },
      ];

      prisma.user.findMany.mockResolvedValue(mockPendingVendors);

      const result = await service.getPendingKyc();

      expect(result.success).toBe(true);
      expect(result.count).toBe(1);
      expect(result.data).toEqual(mockPendingVendors);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role: 'VENDOR', kycStatus: 'PENDING' },
          orderBy: { createdAt: 'desc' },
        }),
      );
    });

    it('should return empty list when no pending vendors', async () => {
      prisma.user.findMany.mockResolvedValue([]);

      const result = await service.getPendingKyc();

      expect(result.success).toBe(true);
      expect(result.count).toBe(0);
      expect(result.data).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // getAllUsers
  // ─────────────────────────────────────────────────────────────
  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        { id: 'u1', email: 'u1@test.com', fullName: 'User One', role: 'CLIENT' },
        { id: 'u2', email: 'u2@test.com', fullName: 'User Two', role: 'VENDOR' },
      ];

      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(50);

      const result = await service.getAllUsers({ page: 1, limit: 20 });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUsers);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 50,
        pages: 3,
      });
    });

    it('should filter by role', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await service.getAllUsers({ role: 'VENDOR', page: 1, limit: 10 });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ role: 'VENDOR' }),
        }),
      );
    });

    it('should filter by kycStatus', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await service.getAllUsers({ kycStatus: 'PENDING', page: 1, limit: 10 });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ kycStatus: 'PENDING' }),
        }),
      );
    });
  });

  // ─────────────────────────────────────────────────────────────
  // getUserDetails
  // ─────────────────────────────────────────────────────────────
  describe('getUserDetails', () => {
    it('should return user details', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'user@test.com',
        fullName: 'Test User',
        phone: '+243999000000',
        role: 'CLIENT',
        boutiqueName: null,
        kycStatus: 'NOT_REQUIRED',
        isVerified: true,
        trustScore: 50,
        province: 'Nord-Kivu',
        commune: 'Goma',
        address: '123 Rue',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserDetails('user-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserDetails('non-existent'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
