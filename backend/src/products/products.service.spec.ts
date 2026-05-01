import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { ModerationService } from '../common/services/moderation.service';
import { NotificationsService } from '../common/notifications/notifications.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
