"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const content_controller_1 = require("./content.controller");
describe('ContentController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [content_controller_1.ContentController],
        }).compile();
        controller = module.get(content_controller_1.ContentController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=content.controller.spec.js.map