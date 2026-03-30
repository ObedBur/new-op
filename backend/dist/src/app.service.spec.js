"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_service_1 = require("./app.service");
describe('AppService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [app_service_1.AppService],
        }).compile();
        service = module.get(app_service_1.AppService);
    });
    describe('getHealth', () => {
        it('should return healthy status', () => {
            const result = service.getHealth();
            expect(result.status).toBe('healthy');
            expect(result).toHaveProperty('timestamp');
        });
    });
    describe('getApiInfo', () => {
        it('should return basic info in development mode', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';
            const result = service.getApiInfo();
            expect(result.name).toBe('WapiBei API');
            expect(result.environment).toBe('development');
            expect(result.debug).toBe(true);
            expect(Array.isArray(result.tips)).toBe(true);
            process.env.NODE_ENV = originalEnv;
        });
        it('should return basic info in test mode', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'test';
            const result = service.getApiInfo();
            expect(result.name).toBe('WapiBei API');
            expect(result.environment).toBe('test');
            expect(result.debug).toBe(true);
            expect(Array.isArray(result.tips)).toBe(true);
            process.env.NODE_ENV = originalEnv;
        });
        it('should return production info in production mode', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            const result = service.getApiInfo();
            expect(result.name).toBe('WapiBei API');
            expect(result.environment).toBe('production');
            expect(result.status).toBe('running');
            expect(result.debug).toBeUndefined();
            process.env.NODE_ENV = originalEnv;
        });
        it('should include debug tips and system info when debug is true', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';
            const result = service.getApiInfo();
            expect(result).toHaveProperty('debug', true);
            expect(result).toHaveProperty('tips');
            expect(Array.isArray(result.tips)).toBe(true);
            expect(result).toHaveProperty('nextSteps');
            process.env.NODE_ENV = originalEnv;
        });
        it('should not include debug info in production mode', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            const result = service.getApiInfo();
            expect(result.debug).toBeUndefined();
            expect(result.tips).toBeUndefined();
            process.env.NODE_ENV = originalEnv;
        });
    });
});
//# sourceMappingURL=app.service.spec.js.map