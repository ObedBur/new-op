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
            status: 'CONFIRMED'
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

    // In-App
    this.notificationsService.createNotification({
      userId: clientId,
      title: 'Commande validée !',
      message: `Votre commande de ${items.length} article(s) pour un total de ${totalOrderPrice.toLocaleString()} $ a bien été reçue.`,
      type: NotificationType.ORDER_CREATED,
    });


    // --- 4. NOTIFICATIONS VENDEURS (Groupées par vendeur) ---
    const ordersByVendor = new Map<string, typeof createdOrders>();
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

    // Email Vendeur (un seul email groupé)
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

      // WhatsApp Vendeur (un seul message groupé)
      this.whatsAppService.sendOrderAlert(vendor.phone, {
        vendorName: vendor.boutiqueName || vendor.fullName,
        customerName,
        customerPhone,
        productName: vendorOrders.length === 1 ? productNames : `${vendorOrders.length} produits`,
        productImage: firstImage,
        deliveryAddress,
        totalPrice: vendorTotal,
      }).catch(err => this.logger.error(`WhatsApp alert failed for vendor ${vendorId}`, err));

      // In-App Vendeur (UNE seule notification groupée)
      this.notificationsService.createNotification({
        userId: vendorId,
        title: 'Nouvelle vente !',
        message: vendorOrders.length === 1
          ? `Vous avez reçu une commande de ${customerName} pour ${productNames}.`
          : `Vous avez reçu une commande groupée de ${customerName} pour ${vendorOrders.length} articles : ${productNames}. Total : ${vendorTotal.toLocaleString()} $`,
        type: NotificationType.ORDER_CREATED,
        metadata: { orderIds: vendorOrders.map(o => o.id), productImage: firstImage },
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
        items: createdOrders.map(o => ({
          productName: o.product.name,
          productImage: o.product.image || (o.product.images && o.product.images[0])
        })),
      }).catch(err => this.logger.error(`Admin Email failed: ${admin.email}`, err));

      // In-App Admin
      this.notificationsService.createNotification({
        userId: admin.id,
        title: '📊 Nouvelle commande plateforme',
        message: `${customerName} a commandé ${createdOrders.length} article(s) pour ${totalOrderPrice.toLocaleString()} $.`,
        type: NotificationType.ORDER_CREATED,
      });

      // WhatsApp Admin (Optionnel - si service configuré pour admin)
      if (admin.phone) {
        this.whatsAppService.sendWhatsAppMessage(admin.phone, 
          `🚨 *ALERTE ADMIN* : Nouvelle commande de ${customerName} (${createdOrders.length} produits, ${totalOrderPrice.toLocaleString()} $).`
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

  async findOrdersForVendor(vendorId: string) {
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

  async findOrdersForClient(clientId: string) {
    return this.prisma.order.findMany({
      where: { clientId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Met à jour le statut d'une commande et déclenche les notifications associées.
   */
  async updateStatus(orderId: string, status: 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        client: true,
        vendor: true
      }
    });

    if (!order) throw new NotFoundException('Commande introuvable');

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { product: true, vendor: true, client: true }
    });

    // --- LOGIQUE DE NOTIFICATION PAR STATUT ---

    if (status === 'SHIPPED') {
      // Pour l'acheteur : Notification In-App
      await this.notificationsService.createNotification({
        userId: order.clientId,
        title: '📦 Colis en route !',
        message: `Votre produit "${order.product.name}" a été expédié par ${order.vendor.boutiqueName || 'le vendeur'}.`,
        type: NotificationType.ORDER_CONFIRMED,
        metadata: { orderId }
      });
    }

    if (status === 'DELIVERED') {
      // 1. Pour l'acheteur : Remerciements In-App
      await this.notificationsService.createNotification({
        userId: order.clientId,
        title: '✅ Colis livré !',
        message: `Nous espérons que votre "${order.product.name}" vous plaît. N'oubliez pas de laisser un avis sur le vendeur.`,
        type: NotificationType.SYSTEM_ALERT,
        metadata: { orderId }
      });

      // 2. Pour l'Admin : Rapport de Clôture par Email
      const admins = await this.prisma.user.findMany({ where: { role: UserRole.ADMIN } });
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
}
