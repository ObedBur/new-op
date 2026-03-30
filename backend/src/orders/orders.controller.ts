import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateBulkOrderDto } from './dto/create-bulk-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtRequest } from '../auth/types/auth-request.types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: JwtRequest) {
    const clientId = req.user.id;
    const order = await this.ordersService.create(createOrderDto, clientId);
    
    return {
      success: true,
      message: 'Commande creee avec succes',
      data: order,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async createBulk(@Body() createBulkOrderDto: CreateBulkOrderDto, @Req() req: JwtRequest) {
    const clientId = req.user.id;
    const result = await this.ordersService.createBulk(createBulkOrderDto, clientId);
    
    return {
      success: true,
      message: 'Commandes traitees avec succes',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('vendor')
  async getOrdersForVendor(@Req() req: JwtRequest) {
    const vendorId = req.user.id;
    const orders = await this.ordersService.findOrdersForVendor(vendorId);

    return {
      success: true,
      data: orders,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('client')
  async getOrdersForClient(@Req() req: JwtRequest) {
    const clientId = req.user.id;
    const orders = await this.ordersService.findOrdersForClient(clientId);

    return {
      success: true,
      data: orders,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/status')
  async updateOrderStatus(
    @Req() req: JwtRequest,
    @Param('id') orderId: string,
    @Body('status') status: 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  ) {
    // Note: Dans un système complet, il faudrait vérifier que req.user.id est bien le vendorId de la commande
    // ou qu'il a le rôle ADMIN.
    const result = await this.ordersService.updateStatus(orderId, status);

    return {
      success: true,
      message: `Statut mis à jour : ${status}`,
      data: result,
    };
  }
}
