"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockJwtService = void 0;
const createMockJwtService = () => ({
    signAsync: jest.fn().mockImplementation((payload, options) => {
        return Promise.resolve(`mock.jwt.token.${payload.sub}`);
    }),
    verifyAsync: jest.fn().mockImplementation((token) => {
        const userId = token.split('.').pop();
        return Promise.resolve({
            sub: userId,
            email: 'test@example.com',
            role: 'CLIENT',
        });
    }),
    decode: jest.fn().mockImplementation((token) => {
        const userId = token.split('.').pop();
        return {
            sub: userId,
            email: 'test@example.com',
        };
    }),
});
exports.createMockJwtService = createMockJwtService;
//# sourceMappingURL=jwt.mock.js.map