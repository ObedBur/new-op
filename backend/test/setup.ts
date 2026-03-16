import { PrismaClient } from '@prisma/client';

// Setup avant tous les tests
beforeAll(async () => {
  // Configuration globale si nécessaire
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_min_16_chars';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_min_16_chars';
});

// Cleanup après tous les tests
afterAll(async () => {
  // Nettoyer les ressources
});

// Mock console en test pour éviter le spam
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
