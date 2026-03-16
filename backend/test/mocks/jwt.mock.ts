export const createMockJwtService = () => ({
  signAsync: jest.fn().mockImplementation((payload, options) => {
    // Simuler la génération d'un token
    return Promise.resolve(`mock.jwt.token.${payload.sub}`);
  }),
  verifyAsync: jest.fn().mockImplementation((token) => {
    // Simuler la vérification d'un token
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

export type MockedJwtService = ReturnType<typeof createMockJwtService>;
