"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sellers_controller_1 = require("./sellers.controller");
describe('SellersController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [sellers_controller_1.SellersController],
        }).compile();
        controller = module.get(sellers_controller_1.SellersController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=sellers.controller.spec.js.map