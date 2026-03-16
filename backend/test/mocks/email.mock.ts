export const createMockEmailService = () => ({
  sendOtp: jest.fn().mockResolvedValue(undefined),
  sendPasswordReset: jest.fn().mockResolvedValue(undefined),
  sendWelcome: jest.fn().mockResolvedValue(undefined),
  sendKycApproval: jest.fn().mockResolvedValue(undefined),
  sendKycRejection: jest.fn().mockResolvedValue(undefined),
});

export type MockedEmailService = ReturnType<typeof createMockEmailService>;
