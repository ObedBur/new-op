import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
export declare class TestUtils {
    static createTestingModule(providers: any[]): Promise<TestingModule>;
    static wait(ms: number): Promise<void>;
    static generateTestToken(userId: string, role?: string): string;
    static authenticatedRequest(app: INestApplication, method: 'get' | 'post' | 'put' | 'delete', url: string, token: string): request.SuperTestStatic.Test;
    static stripAnsi(str: string): string;
    static isRecentDate(date: Date, maxSeconds?: number): boolean;
    static createMockRequest(overrides?: any): any;
    static createMockResponse(): any;
}
