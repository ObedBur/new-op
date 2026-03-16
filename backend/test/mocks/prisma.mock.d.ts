import { User } from '@prisma/client';
export type MockedPrisma = {
    user: {
        findUnique: jest.Mock;
        findFirst: jest.Mock;
        findMany: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        deleteMany: jest.Mock;
    };
    refreshToken: {
        findUnique: jest.Mock;
        findMany: jest.Mock;
        create: jest.Mock;
        delete: jest.Mock;
        deleteMany: jest.Mock;
    };
};
export declare const createMockPrismaService: () => MockedPrisma;
export declare const mockUser: User;
export declare const mockVendor: User;
//# sourceMappingURL=prisma.mock.d.ts.map