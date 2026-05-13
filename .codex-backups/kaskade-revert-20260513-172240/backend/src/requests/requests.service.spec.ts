import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RequestStatus } from '@prisma/client';

const mockPrismaService = {
  service: {
    findUnique: jest.fn(),
  },
  request: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockEventEmitter = {
  emit: jest.fn(),
};

describe('RequestsService', () => {
  let service: RequestsService;
  let prisma: any;
  let eventEmitter: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    prisma = module.get(PrismaService);
    eventEmitter = module.get(EventEmitter2);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('throws BadRequestException if service not found or inactive', async () => {
      prisma.service.findUnique.mockResolvedValue(null);
      const dto = { serviceId: 'sid', description: 'd', address: 'a', scheduledAt: 'ds' };
      await expect(service.create('cid', dto)).rejects.toThrow(BadRequestException);
      
      prisma.service.findUnique.mockResolvedValue({ isActive: false });
      await expect(service.create('cid', dto)).rejects.toThrow(BadRequestException);
    });

    it('creates request and emits event', async () => {
      prisma.service.findUnique.mockResolvedValue({ isActive: true });
      prisma.request.create.mockResolvedValue({ id: '1' });
      const dto = { serviceId: 'sid', description: 'd', address: 'a', scheduledAt: 'ds' };
      
      const res = await service.create('cid', dto);
      expect(res).toEqual({ id: '1' });
      expect(eventEmitter.emit).toHaveBeenCalledWith('request.created', { requestId: '1', clientId: 'cid' });
    });
  });

  describe('findMyRequests', () => {
    it('returns requests for client', async () => {
      prisma.request.findMany.mockResolvedValue([]);
      await expect(service.findMyRequests('cid')).resolves.toEqual([]);
      expect(prisma.request.findMany).toHaveBeenCalledWith({
        where: { clientId: 'cid' },
        include: { service: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOneForClient', () => {
    it('throws NotFoundException if request not found', async () => {
      prisma.request.findUnique.mockResolvedValue(null);
      await expect(service.findOneForClient('1', 'cid')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException if client does not own request', async () => {
      prisma.request.findUnique.mockResolvedValue({ clientId: 'other' });
      await expect(service.findOneForClient('1', 'cid')).rejects.toThrow(ForbiddenException);
    });

    it('returns request if owned by client', async () => {
      prisma.request.findUnique.mockResolvedValue({ clientId: 'cid' });
      await expect(service.findOneForClient('1', 'cid')).resolves.toEqual({ clientId: 'cid' });
    });
  });

  describe('updateForClient', () => {
    it('throws BadRequestException if not PENDING', async () => {
      prisma.request.findUnique.mockResolvedValue({ clientId: 'cid', status: RequestStatus.APPROVED });
      await expect(service.updateForClient('1', 'cid', {})).rejects.toThrow(BadRequestException);
    });

    it('updates request if PENDING', async () => {
      prisma.request.findUnique.mockResolvedValue({ clientId: 'cid', status: RequestStatus.PENDING });
      prisma.request.update.mockResolvedValue({ id: '1' });
      await expect(service.updateForClient('1', 'cid', {})).resolves.toEqual({ id: '1' });
    });
  });

  describe('removeForClient', () => {
    it('throws BadRequestException if not PENDING', async () => {
      prisma.request.findUnique.mockResolvedValue({ clientId: 'cid', status: RequestStatus.APPROVED });
      await expect(service.removeForClient('1', 'cid')).rejects.toThrow(BadRequestException);
    });

    it('deletes request if PENDING', async () => {
      prisma.request.findUnique.mockResolvedValue({ clientId: 'cid', status: RequestStatus.PENDING });
      prisma.request.delete.mockResolvedValue({ id: '1' });
      await expect(service.removeForClient('1', 'cid')).resolves.toEqual({ id: '1' });
    });
  });

  describe('Admin Operations (findAll, findOne, approve, reject)', () => {
    it('findAll returns all requests', async () => {
      prisma.request.findMany.mockResolvedValue([]);
      await expect(service.findAll()).resolves.toEqual([]);
    });

    it('findOne throws if not found', async () => {
      prisma.request.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('approve throws if not PENDING', async () => {
      prisma.request.findUnique.mockResolvedValue({ status: RequestStatus.APPROVED });
      await expect(service.approve('1')).rejects.toThrow(BadRequestException);
    });

    it('approve reads price from service and emits event if PENDING', async () => {
      prisma.request.findUnique.mockResolvedValue({ status: RequestStatus.PENDING, serviceId: 's1' });
      prisma.service.findUnique.mockResolvedValue({ id: 's1', price: 100 });
      prisma.request.update.mockResolvedValue({ id: '1', serviceId: 's1', price: 100 });
      await expect(service.approve('1')).resolves.toEqual({ id: '1', serviceId: 's1', price: 100 });

      expect(prisma.request.update).toHaveBeenCalledWith({
         where: { id: '1' },
         data: { status: RequestStatus.APPROVED, price: 100 }
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('request.approved', { requestId: '1', serviceId: 's1' });
    });

    it('reject throws if not PENDING', async () => {
      prisma.request.findUnique.mockResolvedValue({ status: RequestStatus.APPROVED });
      await expect(service.reject('1')).rejects.toThrow(BadRequestException);
    });

    it('reject updates if PENDING', async () => {
      prisma.request.findUnique.mockResolvedValue({ status: RequestStatus.PENDING });
      prisma.request.update.mockResolvedValue({ id: '1' });
      await expect(service.reject('1')).resolves.toEqual({ id: '1' });
    });
  });
});
