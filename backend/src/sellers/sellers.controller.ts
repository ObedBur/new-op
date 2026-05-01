import { Controller, Get, Post, Param, UseGuards, Req, NotFoundException, UseInterceptors } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtRequest } from '../auth/types/auth-request.types';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) { }
  // mise en cache pour 1 heure
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get()
  async getActiveSellers() {
    return this.sellersService.findActiveVendors();
  }
  // mise en cache pour 2 minutes
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const seller = await this.sellersService.findOneVendor(id);
    if (!seller) {
      throw new NotFoundException('Vendeur non trouvé');
    }
    return seller;
  }
  // Suivre/Ne plus suivre un vendeur
  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async toggleFollow(@Param('id') vendorId: string, @Req() req: JwtRequest) {
    return this.sellersService.toggleFollow(req.user.id, vendorId);
  }
}
