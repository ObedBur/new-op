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
                    status: 'CONFIRMED'
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
                return {
                    productName: p.name,
                    price: p.price,
                    quantity: item.quantity,
                    productImage: p.image || (p.images && p.images[0])
                };
            }),
            totalPrice: totalOrderPrice,
            orderIds: createdOrders.map(o => o.id),
        }).catch(err => this.logger.error('Failed to send aggregation email', err));
        this.notificationsService.createNotification({
            userId: clientId,
            title: 'Commande validée !',
            message: `Votre commande de ${items.length} article(s) pour un total de ${totalOrderPrice.toLocaleString()} $ a bien été reçue.`,
            type: client_1.NotificationType.ORDER_CREATED,
        });
        const ordersByVendor = new Map();
        createdOrders.forEach(order => {
            const existing = ordersByVendor.get(order.vendorId) || [];
            existing.push(order);
            ordersByVendor.set(order.vendorId, existing);
        });
        ordersByVendor.forEach((vendorOrders, vendorId) => {
            const vendor = vendorOrders[0].vendor;
            const productNames = vendorOrders.map(o => o.product.name).join(', ');
            const vendorTotal = vendorOrders.reduce((sum, o) => sum + o.totalPrice, 0);
            const firstImage = vendorOrders[0].product.image || (vendorOrders[0].product.images && vendorOrders[0].product.images[0]);
            this.emailService.sendVendorOrderAlert({
                vendorEmail: vendor.email,
                vendorName: vendor.boutiqueName || vendor.fullName,
                customerName,
                customerPhone,
                productName: vendorOrders.length === 1 ? productNames : `${vendorOrders.length} articles (${productNames})`,
                productImage: firstImage,
                totalPrice: vendorTotal,
                orderId: vendorOrders.map(o => o.id).join(', '),
            }).catch(err => this.logger.error(`Vendor Email failed: ${vendor.email}`, err));
            this.whatsAppService.sendOrderAlert(vendor.phone, {
                vendorName: vendor.boutiqueName || vendor.fullName,
                customerName,
                customerPhone,
                productName: vendorOrders.length === 1 ? productNames : `${vendorOrders.length} produits`,
                productImage: firstImage,
                deliveryAddress,
                totalPrice: vendorTotal,
            }).catch(err => this.logger.error(`WhatsApp alert failed for vendor ${vendorId}`, err));
            this.notificationsService.createNotification({
                userId: vendorId,
                title: 'Nouvelle vente !',
                message: vendorOrders.length === 1
                    ? `Vous avez reçu une commande de ${customerName} pour ${productNames}.`
                    : `Vous avez reçu une commande groupée de ${customerName} pour ${vendorOrders.length} articles : ${productNames}. Total : ${vendorTotal.toLocaleString()} $`,
                type: client_1.NotificationType.ORDER_CREATED,
                metadata: { orderIds: vendorOrders.map(o => o.id), productImage: firstImage },
            });
        });
        const admins = await this.prisma.user.findMany({ where: { role: client_1.UserRole.ADMIN } });
        admins.forEach(admin => {
            this.emailService.sendAdminOrderAlert({
                adminEmail: admin.email,
                orderCount: createdOrders.length,
                totalAmount: totalOrderPrice,
                customerName,
                items: createdOrders.map(o => ({
                    productName: o.product.name,
                    productImage: o.product.image || (o.product.images && o.product.images[0])
                })),
            }).catch(err => this.logger.error(`Admin Email failed: ${admin.email}`, err));
            this.notificationsService.createNotification({
                userId: admin.id,
                title: '📊 Nouvelle commande plateforme',
                message: `${customerName} a commandé ${createdOrders.length} article(s) pour ${totalOrderPrice.toLocaleString()} $.`,
                type: client_1.NotificationType.ORDER_CREATED,
            });
            if (admin.phone) {
                this.whatsAppService.sendWhatsAppMessage(admin.phone, `🚨 *ALERTE ADMIN* : Nouvelle commande de ${customerName} (${createdOrders.length} produits, ${totalOrderPrice.toLocaleString()} $).`).catch(err => this.logger.error(`Admin WhatsApp failed: ${admin.phone}`, err));
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
    async findOrdersForVendor(vendorId) {
        return this.prisma.order.findMany({
            where: { vendorId },
            include: {
                product: true,
                client: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOrdersForClient(clientId) {
        return this.prisma.order.findMany({
            where: { clientId },
            include: {
                product: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateStatus(orderId, status) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                product: true,
                client: true,
                vendor: true
            }
        });
        if (!order)
            throw new common_1.NotFoundException('Commande introuvable');
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { product: true, vendor: true, client: true }
        });
        if (status === 'SHIPPED') {
            await this.notificationsService.createNotification({
                userId: order.clientId,
                title: '📦 Colis en route !',
                message: `Votre produit "${order.product.name}" a été expédié par ${order.vendor.boutiqueName || 'le vendeur'}.`,
                type: client_1.NotificationType.ORDER_CONFIRMED,
                metadata: { orderId }
            });
        }
        if (status === 'DELIVERED') {
            await this.notificationsService.createNotification({
                userId: order.clientId,
                title: '✅ Colis livré !',
                message: `Nous espérons que votre "${order.product.name}" vous plaît. N'oubliez pas de laisser un avis sur le vendeur.`,
                type: client_1.NotificationType.SYSTEM_ALERT,
                metadata: { orderId }
            });
            const admins = await this.prisma.user.findMany({ where: { role: client_1.UserRole.ADMIN } });
            for (const admin of admins) {
                this.emailService.sendClosureAdminReport({
                    adminEmail: admin.email,
                    orderId: order.id,
                    clientName: order.customerName,
                    vendorName: order.vendor.boutiqueName || order.vendor.fullName,
                    productName: order.product.name,
                    amount: order.totalPrice
                }).catch(err => this.logger.error(`Admin closure report failed for ${admin.email}`, err));
            }
        }
        return updatedOrder;
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