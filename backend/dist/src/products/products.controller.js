"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async create(createProductDto, req) {
        const userId = req.user.id;
        const product = await this.productsService.create({
            ...createProductDto,
        }, userId);
        return {
            success: true,
            message: 'Produit créé avec succès',
            data: product,
        };
    }
    async findMyProducts(req, categoryId, search, market, page, limit) {
        const userId = req.user.id;
        const result = await this.productsService.findAll({
            userId,
            categoryId: categoryId ? parseInt(categoryId) : undefined,
            search,
            market,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
        return {
            success: true,
            data: result.items,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                pages: result.pages,
            },
        };
    }
    async getDeals(limit) {
        const data = await this.productsService.getDeals(limit ? parseInt(limit) : 6);
        return { success: true, data };
    }
    async getNewArrivals(limit) {
        const data = await this.productsService.getNewArrivals(limit ? parseInt(limit) : 6);
        return { success: true, data };
    }
    async getRecommendations(userId, limit) {
        const data = await this.productsService.getRecommendations(userId, limit ? parseInt(limit) : 6);
        return { success: true, data };
    }
    async getBestSellers(limit) {
        const data = await this.productsService.getBestSellers(limit ? parseInt(limit) : 6);
        return { success: true, data };
    }
    async compare(search) {
        const data = await this.productsService.compareProducts(search || '');
        return { success: true, ...data };
    }
    async findAll(categoryId, search, market, page, limit) {
        const result = await this.productsService.findAll({
            categoryId: categoryId ? parseInt(categoryId) : undefined,
            search,
            market,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
        return {
            success: true,
            data: result.items,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                pages: result.pages,
            },
        };
    }
    async findOne(id) {
        const product = await this.productsService.findOne(id);
        return {
            success: true,
            data: product,
        };
    }
    async update(id, updateProductDto, req) {
        const userId = req.user.id;
        const product = await this.productsService.update(id, updateProductDto, userId);
        return {
            success: true,
            message: 'Produit mis à jour avec succès',
            data: product,
        };
    }
    async bulkPublish(ids, req) {
        const userId = req.user.id;
        await this.productsService.bulkPublish(ids, userId);
        return {
            success: true,
            message: `${ids.length} produits publiés avec succès`,
        };
    }
    async remove(id, req) {
        const userId = req.user.id;
        await this.productsService.remove(id, userId);
        return {
            success: true,
            message: 'Produit supprimé avec succès',
        };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-products'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('market')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findMyProducts", null);
__decorate([
    (0, common_1.Get)('deals'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getDeals", null);
__decorate([
    (0, common_1.Get)('new-arrivals'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getNewArrivals", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Get)('best-sellers'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getBestSellers", null);
__decorate([
    (0, common_1.Get)('compare'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "compare", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('market')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('bulk-publish'),
    __param(0, (0, common_1.Body)('ids')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "bulkPublish", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map