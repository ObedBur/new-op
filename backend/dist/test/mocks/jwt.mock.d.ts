export declare const createMockJwtService: () => {
    signAsync: jest.Mock<any, any, any>;
    verifyAsync: jest.Mock<any, any, any>;
    decode: jest.Mock<any, any, any>;
};
export type MockedJwtService = ReturnType<typeof createMockJwtService>;
