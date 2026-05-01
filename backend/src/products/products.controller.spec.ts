import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { ModerationService } from '../common/services/moderation.service';
import { NotificationsService } from '../common/notifications/notifications.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: ModerationService,
          useValue: { fullValidation: jest.fn().mockResolvedValue(true) },
        },
        {
          provide: NotificationsService,
          useValue: {
            broadcastNewProduct: jest.fn(),
            createNotification: jest.fn(),
            sendPushToUser: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
