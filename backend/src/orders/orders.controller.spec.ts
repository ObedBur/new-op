import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

/**
 * Mock du service pour isoler le contrôleur de toute dépendance externe.
 */
const mockOrdersService = {
  create: jest.fn(),
  createBulk: jest.fn(),
  findOrdersForVendor: jest.fn(),
  findOrdersForClient: jest.fn(),
  updateStatus: jest.fn(),
  getVendorStats: jest.fn(),
};

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call ordersService.createBulk and return a success response', async () => {
      const mockOrder = { id: 'order-1', status: 'CONFIRMED' };
      mockOrdersService.create.mockResolvedValue({
        success: true,
        orders: [mockOrder],
      });

      const req = { user: { id: 'client-1' } };
      const dto = {
        productId: 'prod-1',
        customerName: 'Jean',
        customerPhone: '+243000000000',
        customerEmail: 'jean@test.com',
        deliveryAddress: 'Goma',
      };

      const result = await controller.create(dto, req as any);

      expect(result.success).toBe(true);
      expect(mockOrdersService.create).toHaveBeenCalledWith(dto, 'client-1');
    });
  });

  describe('getOrdersForVendor', () => {
    it('should return orders for the authenticated vendor', async () => {
      const mockOrders = [{ id: 'order-1' }];
      mockOrdersService.findOrdersForVendor.mockResolvedValue(mockOrders);

      const req = { user: { id: 'vendor-1' } };
      const result = await controller.getOrdersForVendor(req as any);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockOrders);
      expect(mockOrdersService.findOrdersForVendor).toHaveBeenCalledWith(
        'vendor-1',
      );
    });
  });

  describe('getOrdersForClient', () => {
    it('should return orders for the authenticated client', async () => {
      const mockOrders = [{ id: 'order-2' }];
      mockOrdersService.findOrdersForClient.mockResolvedValue(mockOrders);

      const req = { user: { id: 'client-1' } };
      const result = await controller.getOrdersForClient(req as any);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockOrders);
    });
  });

  describe('updateOrderStatus', () => {
    it('should call updateStatus with correct parameters and return a success response', async () => {
      const mockUpdated = { id: 'order-1', status: 'DELIVERED' };
      mockOrdersService.updateStatus.mockResolvedValue(mockUpdated);

      const req = { user: { id: 'vendor-1', role: 'VENDOR' } };
      const result = await controller.updateOrderStatus(
        req as any,
        'order-1',
        'DELIVERED',
      );

      expect(result.success).toBe(true);
      expect(mockOrdersService.updateStatus).toHaveBeenCalledWith(
        'order-1',
        'DELIVERED',
        'vendor-1',
        'VENDOR',
      );
    });
  });

  describe('getVendorStats', () => {
    it('should return vendor statistics', async () => {
      const mockStats = { totalRevenue: 5000, totalOrders: 20 };
      mockOrdersService.getVendorStats.mockResolvedValue(mockStats);

      const req = { user: { id: 'vendor-1' } };
      const result = await controller.getVendorStats(req as any);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStats);
    });
  });
});
