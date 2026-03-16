import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateBulkOrderDto } from './dto/create-bulk-order.dto';
import { EmailService } from '../common/email/email.service';
import { WhatsAppService } from '../common/whatsapp/whatsapp.service';
import { NotificationsService } from '../common/notifications/notifications.service';
import { NotificationType, UserRole } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private whatsAppService: WhatsAppService,
    private notificationsService: NotificationsService,
  ) {}

  async createBulk(createBulkOrderDto: CreateBulkOrderDto, clientId: string) {
    const { items, customerName, customerPhone, customerEmail, deliveryAddress } = createBulkOrderDto;

    // 1. Récupérer tous les produits
    const productIds = items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { user: true },
    });

    if (products.length !== items.length) {
      throw new NotFoundException('Un ou plusieurs produits sont introuvables');
    }

    // 2. Création des commandes en transaction
    const createdOrders = await this.prisma.$transaction(
      items.map(item => {
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
      })
    );

    const totalOrderPrice = createdOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // --- 3. NOTIFICATIONS CLIENT ---
    // Email (Aggregation)
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

    // In-App
    this.notificationsService.createNotification({
      userId: clientId,
      title: 'Commande validée !',
      message: `Votre commande de ${items.length} article(s) pour un total de ${totalOrderPrice.toLocaleString()} FC a bien été reçue.`,
      type: NotificationType.ORDER_CREATED,
    });


    // --- 4. NOTIFICATIONS VENDEURS ---
    createdOrders.forEach(order => {
      const productImage = order.product.image || (order.product.images && order.product.images[0]);

      // Email Vendeur
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

      // WhatsApp Vendeur
      this.whatsAppService.sendOrderAlert(order.vendor.phone, {
        vendorName: order.vendor.boutiqueName || order.vendor.fullName,
        customerName,
        customerPhone,
        productName: order.product.name,
        productImage,
        deliveryAddress,
        totalPrice: order.totalPrice,
      }).catch(err => this.logger.error(`WhatsApp alert failed for vendor ${order.vendor.id}`, err));

      // In-App Vendeur
      this.notificationsService.createNotification({
        userId: order.vendorId,
        title: 'Nouvelle vente !',
        message: `Vous avez reçu une commande de ${customerName} pour ${order.product.name}.`,
        type: NotificationType.ORDER_CREATED,
        metadata: { orderId: order.id, productImage },
      });
    });


    // --- 5. NOTIFICATIONS ADMIN ---
    const admins = await this.prisma.user.findMany({ where: { role: UserRole.ADMIN } });
    
    admins.forEach(admin => {
      // Email Admin
      this.emailService.sendAdminOrderAlert({
        adminEmail: admin.email,
        orderCount: createdOrders.length,
        totalAmount: totalOrderPrice,
        customerName,
        items: createdOrders.map(o => o.product.name),
      }).catch(err => this.logger.error(`Admin Email failed: ${admin.email}`, err));

      // In-App Admin
      this.notificationsService.createNotification({
        userId: admin.id,
        title: '📊 Nouvelle commande plateforme',
        message: `${customerName} a commandé ${createdOrders.length} article(s) pour ${totalOrderPrice.toLocaleString()} FC.`,
        type: NotificationType.ORDER_CREATED,
      });

      // WhatsApp Admin (Optionnel - si service configuré pour admin)
      if (admin.phone) {
        this.whatsAppService.sendWhatsAppMessage(admin.phone, 
          `🚨 *ALERTE ADMIN* : Nouvelle commande de ${customerName} (${createdOrders.length} produits, ${totalOrderPrice.toLocaleString()} FC).`
        ).catch(err => this.logger.error(`Admin WhatsApp failed: ${admin.phone}`, err));
      }
    });

    return {
      success: true,
      orderCount: createdOrders.length,
      orders: createdOrders,
    };
  }

  async create(createOrderDto: CreateOrderDto, clientId: string) {
    return this.createBulk({
      items: [{ productId: createOrderDto.productId, quantity: 1 }],
      customerName: createOrderDto.customerName,
      customerPhone: createOrderDto.customerPhone,
      customerEmail: createOrderDto.customerEmail,
      deliveryAddress: createOrderDto.deliveryAddress,
    }, clientId);
  }
}
