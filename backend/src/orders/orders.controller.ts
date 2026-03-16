import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
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
}
