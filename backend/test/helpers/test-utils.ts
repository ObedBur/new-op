import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

/**
 * Utilitaires pour les tests
 */
export class TestUtils {
  /**
   * Crée un module de test avec les providers donnés
   */
  static async createTestingModule(providers: any[]): Promise<TestingModule> {
    return Test.createTestingModule({
      providers,
    }).compile();
  }

  /**
   * Attendre un certain délai (pour les tests async)
   */
  static wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Générer un token JWT de test
   */
  static generateTestToken(userId: string, role: string = 'CLIENT'): string {
    return `test.jwt.token.${userId}.${role}`;
  }

  /**
   * Helper pour les requêtes API authentifiées
   */
  static authenticatedRequest(
    app: INestApplication,
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    token: string,
  ) {
    return request(app.getHttpServer())
      [method](url)
      .set('Authorization', `Bearer ${token}`);
  }

  /**
   * Nettoie les symboles ANSI des strings (utile pour comparer les logs)
   */
  static stripAnsi(str: string): string {
    return str.replace(/\u001b\[.*?m/g, '');
  }

  /**
   * Vérifie qu'une date est récente (moins de X secondes)
   */
  static isRecentDate(date: Date, maxSeconds: number = 10): boolean {
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    return diff < maxSeconds * 1000;
  }

  /**
   * Créé un mock de Request Express
   */
  static createMockRequest(overrides?: any) {
    return {
      user: {},
      body: {},
      params: {},
      query: {},
      headers: {},
      ip: '127.0.0.1',
      ...overrides,
    };
  }

  /**
   * Créé un mock de Response Express
   */
  static createMockResponse() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  }
}
