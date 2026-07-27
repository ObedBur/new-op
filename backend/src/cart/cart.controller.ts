import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtRequest } from '../auth/types/auth-request.types';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';
import { SetCartQuantityDto } from './dto/set-cart-quantity.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: JwtRequest) {
    return this.cartService.findForUser(req.user.id);
  }

  @Post('items')
  @HttpCode(HttpStatus.OK)
  async addItem(@Req() req: JwtRequest, @Body() dto: CartItemDto) {
    return this.cartService.addItem(req.user.id, dto);
  }

  @Patch('items/:productId')
  async setQuantity(
    @Req() req: JwtRequest,
    @Param('productId') productId: string,
    @Body() dto: SetCartQuantityDto,
  ) {
    return this.cartService.setQuantity(req.user.id, productId, dto.quantity);
  }

  @Delete('items/:productId')
  async removeItem(
    @Req() req: JwtRequest,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  @Delete()
  async clear(@Req() req: JwtRequest) {
    return this.cartService.clear(req.user.id);
  }

  @Post('merge')
  @HttpCode(HttpStatus.OK)
  async merge(@Req() req: JwtRequest, @Body() dto: MergeCartDto) {
    return this.cartService.merge(req.user.id, dto.items);
  }
}
