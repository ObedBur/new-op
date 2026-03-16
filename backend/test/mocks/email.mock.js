"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockEmailService = void 0;
const createMockEmailService = () => ({
    sendOtp: jest.fn().mockResolvedValue(undefined),
    sendPasswordReset: jest.fn().mockResolvedValue(undefined),
    sendWelcome: jest.fn().mockResolvedValue(undefined),
    sendKycApproval: jest.fn().mockResolvedValue(undefined),
    sendKycRejection: jest.fn().mockResolvedValue(undefined),
});
exports.createMockEmailService = createMockEmailService;
//# sourceMappingURL=email.mock.js.map