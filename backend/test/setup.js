"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test_secret_key_min_16_chars';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_min_16_chars';
});
afterAll(async () => {
});
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
//# sourceMappingURL=setup.js.map