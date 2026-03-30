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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../common/email/email.service");
const whatsapp_service_1 = require("../common/whatsapp/whatsapp.service");
const notifications_service_1 = require("../common/notifications/notifications.service");
const client_1 = require("@prisma/client");
let OrdersService = OrdersService_1 = class OrdersService {
    constructor(prisma, emailService, whatsAppService, notificationsService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.whatsAppService = whatsAppService;
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(OrdersService_1.name);
    }
    async createBulk(createBulkOrderDto, clientId) {
        const { items, customerName, customerPhone, customerEmail, deliveryAddress } = createBulkOrderDto;
        const productIds = items.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { user: true },
        });
        if (products.length !== items.length) {
            throw new common_1.NotFoundException('Un ou plusieurs produits sont introuvables');
        }
        const createdOrders = await this.prisma.$transaction(items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return this.prisma.order.create({
                data: {
                    customerName,
                    customerPhone,
                    customerEmail,
                    deliveryAddress,
                    totalPrice: product.price * item.quantity,
                    productId: product.id,
                    clientId,
                    vendorId: product.userId,
                },
                include: {
                    product: true,
                    vendor: true,
                }
            });
        }));
        const totalOrderPrice = createdOrders.reduce((acc, order) => acc + order.totalPrice, 0);
        this.emailService.sendBulkOrderConfirmation({
            customerEmail,
            customerName,
            items: items.map(item => {
                const p = products.find(prod => prod.id === item.productId);
                return { productName: p.name, price: p.price, quantity: item.quantity };
            }),
            totalPrice: totalOrderPrice,
            orderIds: createdOrders.map(o => o.id),
        }).catch(err => this.logger.error('Failed to send aggregation email', err));
        this.notificationsService.createNotification({
            userId: clientId,
            title: 'Commande validée !',
            message: `Votre commande de ${items.length} article(s) pour un total de ${totalOrderPrice.toLocaleString()} FC a bien été reçue.`,
            type: client_1.NotificationType.ORDER_CREATED,
        });
        createdOrders.forEach(order => {
            const productImage = order.product.image || (order.product.images && order.product.images[0]);
            this.emailService.sendVendorOrderAlert({
                vendorEmail: order.vendor.email,
                vendorName: order.vendor.boutiqueName || order.vendor.fullName,
                customerName,
                customerPhone,
                productName: order.product.name,
                productImage,
                totalPrice: order.totalPrice,
                orderId: order.id,
            }).catch(err => this.logger.error(`Vendor Email failed: ${order.vendor.email}`, err));
            this.whatsAppService.sendOrderAlert(order.vendor.phone, {
                vendorName: order.vendor.boutiqueName || order.vendor.fullName,
                customerName,
                customerPhone,
                productName: order.product.name,
                productImage,
                deliveryAddress,
                totalPrice: order.totalPrice,
            }).catch(err => this.logger.error(`WhatsApp alert failed for vendor ${order.vendor.id}`, err));
            this.notificationsService.createNotification({
                userId: order.vendorId,
                title: 'Nouvelle vente !',
                message: `Vous avez reçu une commande de ${customerName} pour ${order.product.name}.`,
                type: client_1.NotificationType.ORDER_CREATED,
                metadata: { orderId: order.id, productImage },
            });
        });
        const admins = await this.prisma.user.findMany({ where: { role: client_1.UserRole.ADMIN } });
        admins.forEach(admin => {
            this.emailService.sendAdminOrderAlert({
                adminEmail: admin.email,
                orderCount: createdOrders.length,
                totalAmount: totalOrderPrice,
                customerName,
                items: createdOrders.map(o => o.product.name),
            }).catch(err => this.logger.error(`Admin Email failed: ${admin.email}`, err));
            this.notificationsService.createNotification({
                userId: admin.id,
                title: '📊 Nouvelle commande plateforme',
                message: `${customerName} a commandé ${createdOrders.length} article(s) pour ${totalOrderPrice.toLocaleString()} FC.`,
                type: client_1.NotificationType.ORDER_CREATED,
            });
            if (admin.phone) {
                this.whatsAppService.sendWhatsAppMessage(admin.phone, `🚨 *ALERTE ADMIN* : Nouvelle commande de ${customerName} (${createdOrders.length} produits, ${totalOrderPrice.toLocaleString()} FC).`).catch(err => this.logger.error(`Admin WhatsApp failed: ${admin.phone}`, err));
            }
        });
        return {
            success: true,
            orderCount: createdOrders.length,
            orders: createdOrders,
        };
    }
    async create(createOrderDto, clientId) {
        return this.createBulk({
            items: [{ productId: createOrderDto.productId, quantity: 1 }],
            customerName: createOrderDto.customerName,
            customerPhone: createOrderDto.customerPhone,
            customerEmail: createOrderDto.customerEmail,
            deliveryAddress: createOrderDto.deliveryAddress,
        }, clientId);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        whatsapp_service_1.WhatsAppService,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map