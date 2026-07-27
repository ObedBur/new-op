import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../common/email/email.service';
import { WhatsAppService } from '../common/whatsapp/whatsapp.service';
import { NotificationsService } from '../common/notifications/notifications.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

/**
 * Mocks réutilisables pour les dépendances externes du service.
 */
const mockPrismaService = {
  order: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findMany: jest.fn(),
    update: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(),
};

const mockEmailService = {
  sendBulkOrderConfirmation: jest.fn().mockResolvedValue(undefined),
  sendVendorOrderAlert: jest.fn().mockResolvedValue(undefined),
  sendAdminOrderAlert: jest.fn().mockResolvedValue(undefined),
  sendOrderConfirmed: jest.fn().mockResolvedValue(undefined),
  sendOrderShipped: jest.fn().mockResolvedValue(undefined),
  sendOrderCancelled: jest.fn().mockResolvedValue(undefined),
  sendClosureAdminReport: jest.fn().mockResolvedValue(undefined),
};

const mockWhatsAppService = {
  sendOrderAlert: jest.fn().mockResolvedValue(undefined),
  sendWhatsAppMessage: jest.fn().mockResolvedValue(undefined),
};

const mockNotificationsService = {
  createNotification: jest.fn().mockResolvedValue(undefined),
  sendPushToUser: jest.fn().mockResolvedValue(undefined),
  broadcastNewProduct: jest.fn().mockResolvedValue(undefined),
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: WhatsAppService, useValue: mockWhatsAppService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────
  // SUITE : updateStatus — Gestion des transitions de statut
  // ─────────────────────────────────────────────────────────────────
  describe('updateStatus', () => {
    const orderId = 'order-1';
    const vendorId = 'vendor-1';

    const mockOrder = {
      id: orderId,
      vendorId,
      clientId: 'client-1',
      customerName: 'Jean Dupont',
      customerEmail: 'jean@test.com',
      deliveryAddress: 'Goma, Nord Kivu',
      totalPrice: 100,
      product: { id: 'prod-1', name: 'Téléphone Samsung' },
      client: { id: 'client-1', fullName: 'Jean Dupont' },
      vendor: {
        id: vendorId,
        fullName: 'Vendeur Test',
        boutiqueName: 'Boutique Test',
        trustScore: 50,
      },
    };

    const mockUpdatedOrder = { ...mockOrder, status: 'DELIVERED' };

    beforeEach(() => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.order.update.mockResolvedValue(mockUpdatedOrder);
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.update.mockResolvedValue({
        id: vendorId,
        trustScore: 51,
      });
    });

    it('should throw NotFoundException if the order does not exist', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);
      await expect(
        service.updateStatus(orderId, 'DELIVERED', vendorId, 'VENDOR'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if requester is not the owner or admin', async () => {
      await expect(
        service.updateStatus(orderId, 'DELIVERED', 'other-user-id', 'VENDOR'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow an ADMIN to update any order status', async () => {
      const result = await service.updateStatus(
        orderId,
        'DELIVERED',
        'admin-id',
        'ADMIN',
      );
      expect(result).toBeDefined();
      expect(mockPrismaService.order.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'DELIVERED' } }),
      );
    });

    it('should increment TrustScore by 1 when order is marked as DELIVERED', async () => {
      await service.updateStatus(orderId, 'DELIVERED', vendorId, 'VENDOR');

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: vendorId },
        data: { trustScore: { increment: 1 } },
      });
    });

    it('should NOT increment TrustScore if vendor is already at the max score of 100', async () => {
      const orderAtMaxScore = {
        ...mockOrder,
        vendor: { ...mockOrder.vendor, trustScore: 100 },
      };
      // Le service lit le trustScore depuis updatedOrder (résultat de prisma.order.update)
      mockPrismaService.order.findUnique.mockResolvedValue(orderAtMaxScore);
      mockPrismaService.order.update.mockResolvedValue(orderAtMaxScore);

      await service.updateStatus(orderId, 'DELIVERED', vendorId, 'VENDOR');

      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('should decrement TrustScore by 2 when the vendor cancels their own order', async () => {
      await service.updateStatus(orderId, 'CANCELLED', vendorId, 'VENDOR');

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: vendorId },
        data: { trustScore: { decrement: 2 } },
      });
    });

    it('should NOT apply cancellation penalty if cancelled by an admin (not the vendor)', async () => {
      await service.updateStatus(orderId, 'CANCELLED', 'admin-id', 'ADMIN');

      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('should NOT apply cancellation penalty if vendor TrustScore is already at 0', async () => {
      const orderAtZeroScore = {
        ...mockOrder,
        vendor: { ...mockOrder.vendor, trustScore: 0 },
      };
      // Le service lit le trustScore depuis updatedOrder (résultat de prisma.order.update)
      mockPrismaService.order.findUnique.mockResolvedValue(orderAtZeroScore);
      mockPrismaService.order.update.mockResolvedValue(orderAtZeroScore);

      await service.updateStatus(orderId, 'CANCELLED', vendorId, 'VENDOR');

      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('should send a notification to the client when order is CONFIRMED', async () => {
      mockPrismaService.order.update.mockResolvedValue({
        ...mockOrder,
        status: 'CONFIRMED',
      });
      await service.updateStatus(orderId, 'CONFIRMED', vendorId, 'VENDOR');

      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Commande confirmée',
          userId: mockOrder.clientId,
        }),
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // SUITE : findOrdersForVendor / findOrdersForClient
  // ─────────────────────────────────────────────────────────────────
  describe('findOrdersForVendor', () => {
    it('should return all orders for a given vendor', async () => {
      const mockOrders = [{ id: 'order-1', vendorId: 'vendor-1' }];
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.findOrdersForVendor('vendor-1');

      expect(result).toEqual(mockOrders);
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { vendorId: 'vendor-1' } }),
      );
    });
  });

  describe('findOrdersForClient', () => {
    it('should return all orders for a given client', async () => {
      const mockOrders = [{ id: 'order-1', clientId: 'client-1' }];
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.findOrdersForClient('client-1');

      expect(result).toEqual(mockOrders);
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { clientId: 'client-1' } }),
      );
    });
  });
});
