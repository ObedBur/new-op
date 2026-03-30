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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SellersService = class SellersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findActiveVendors() {
        const vendors = await this.prisma.user.findMany({
            where: { role: 'VENDOR', isVerified: true },
            include: {
                products: {
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                    select: { images: true },
                },
            },
        });
        return vendors.map((vendor) => ({
            id: vendor.id,
            boutiqueName: vendor.boutiqueName,
            trustScore: vendor.trustScore,
            isVerified: vendor.isVerified,
            avatarUrl: vendor.avatarUrl,
            productPreviews: vendor.products.flatMap((p) => p.images).slice(0, 3),
        }));
    }
};
exports.SellersService = SellersService;
exports.SellersService = SellersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SellersService);
//# sourceMappingURL=sellers.service.js.map