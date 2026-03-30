"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestUtils = void 0;
const testing_1 = require("@nestjs/testing");
const supertest_1 = require("supertest");
class TestUtils {
    static async createTestingModule(providers) {
        return testing_1.Test.createTestingModule({
            providers,
        }).compile();
    }
    static wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static generateTestToken(userId, role = 'CLIENT') {
        return `test.jwt.token.${userId}.${role}`;
    }
    static authenticatedRequest(app, method, url, token) {
        return (0, supertest_1.default)(app.getHttpServer())[method](url)
            .set('Authorization', `Bearer ${token}`);
    }
    static stripAnsi(str) {
        return str.replace(/\u001b\[.*?m/g, '');
    }
    static isRecentDate(date, maxSeconds = 10) {
        const now = new Date();
        const diff = Math.abs(now.getTime() - date.getTime());
        return diff < maxSeconds * 1000;
    }
    static createMockRequest(overrides) {
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
    static createMockResponse() {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    }
}
exports.TestUtils = TestUtils;
//# sourceMappingURL=test-utils.js.map