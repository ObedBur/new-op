import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockPrismaService, createMockJwtService, MockedPrisma, MockedJwtService } from '../../../test/mocks';
import { TestDataFactory } from '../../../test/helpers/test-data.factory';
import * as crypto from 'crypto';

describe('TokenService', () => {
  let service: TokenService;
  let prisma: MockedPrisma;
  let jwtService: MockedJwtService;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockJwt = createMockJwtService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    prisma = mockPrisma;
    jwtService = mockJwt;
    
    TestDataFactory.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTokenPair', () => {
    it('should generate access and refresh tokens', async () => {
      const user = await TestDataFactory.createVerifiedUser();
      const tokens = await service.generateTokenPair(user);

      expect(tokens.access_token).toBeDefined();
      expect(tokens.refresh_token).toBeDefined();
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });

    it('should include correct payload', async () => {
      const user = await TestDataFactory.createVerifiedUser();
      await service.generateTokenPair(user);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: user.id,
          email: user.email,
        }),
        expect.any(Object)
      );
    });
  });

  describe('saveRefreshToken', () => {
    it('should save hashed token to database', async () => {
      const userId = 'user-123';
      const token = 'token-456';
      const expectedHash = crypto.createHash('sha256').update(token).digest('hex');

      await service.saveRefreshToken(userId, token);

      expect(prisma.refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          tokenHash: expectedHash,
        }),
      });
    });
  });

  describe('revokeRefreshToken', () => {
    it('should delete token from database', async () => {
      prisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });
      const result = await service.revokeRefreshToken('user-1', 'token-1');
      expect(result).toBe(true);
    });
  });

  describe('refreshTokenPair', () => {
    it('should rotate tokens', async () => {
      const user = await TestDataFactory.createVerifiedUser();
      const oldToken = 'old-token';
      const oldHash = crypto.createHash('sha256').update(oldToken).digest('hex');

      prisma.refreshToken.findUnique.mockResolvedValue({
        userId: user.id,
        tokenHash: oldHash,
        expiresAt: new Date(Date.now() + 100000),
        user,
      });

      const tokens = await service.refreshTokenPair(user.id, oldToken);

      expect(tokens.access_token).toBeDefined();
      expect(prisma.refreshToken.deleteMany).toHaveBeenCalled();
      expect(prisma.refreshToken.create).toHaveBeenCalled();
    });
  });
});

