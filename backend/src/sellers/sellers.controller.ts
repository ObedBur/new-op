import { Controller, Get, Post, Param, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtRequest } from '../auth/types/auth-request.types';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  async getActiveSellers() {
    return this.sellersService.findActiveVendors();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const seller = await this.sellersService.findOneVendor(id);
    if (!seller) {
      throw new NotFoundException('Vendeur non trouvé');
    }
    return seller;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async toggleFollow(@Param('id') vendorId: string, @Req() req: JwtRequest) {
    return this.sellersService.toggleFollow(req.user.id, vendorId);
  }
}
