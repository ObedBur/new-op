export declare const createMockEmailService: () => {
    sendOtp: jest.Mock<any, any, any>;
    sendPasswordReset: jest.Mock<any, any, any>;
    sendWelcome: jest.Mock<any, any, any>;
    sendKycApproval: jest.Mock<any, any, any>;
    sendKycRejection: jest.Mock<any, any, any>;
};
export type MockedEmailService = ReturnType<typeof createMockEmailService>;
