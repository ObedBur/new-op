"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sellers_service_1 = require("./sellers.service");
describe('SellersService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [sellers_service_1.SellersService],
        }).compile();
        service = module.get(sellers_service_1.SellersService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=sellers.service.spec.js.map