"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const token_service_1 = require("./token.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const mocks_1 = require("../../../test/mocks");
const test_data_factory_1 = require("../../../test/helpers/test-data.factory");
const crypto = require("crypto");
describe('TokenService', () => {
    let service;
    let prisma;
    let jwtService;
    beforeEach(async () => {
        const mockPrisma = (0, mocks_1.createMockPrismaService)();
        const mockJwt = (0, mocks_1.createMockJwtService)();
        const module = await testing_1.Test.createTestingModule({
            providers: [
                token_service_1.TokenService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
                { provide: jwt_1.JwtService, useValue: mockJwt },
            ],
        }).compile();
        service = module.get(token_service_1.TokenService);
        prisma = mockPrisma;
        jwtService = mockJwt;
        test_data_factory_1.TestDataFactory.reset();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('generateTokenPair', () => {
        it('should generate access and refresh tokens', async () => {
            const user = await test_data_factory_1.TestDataFactory.createVerifiedUser();
            const tokens = await service.generateTokenPair(user);
            expect(tokens.access_token).toBeDefined();
            expect(tokens.refresh_token).toBeDefined();
            expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
        });
        it('should include correct payload', async () => {
            const user = await test_data_factory_1.TestDataFactory.createVerifiedUser();
            await service.generateTokenPair(user);
            expect(jwtService.signAsync).toHaveBeenCalledWith(expect.objectContaining({
                sub: user.id,
                email: user.email,
            }), expect.any(Object));
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
            const user = await test_data_factory_1.TestDataFactory.createVerifiedUser();
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
//# sourceMappingURL=token.service.spec.js.map