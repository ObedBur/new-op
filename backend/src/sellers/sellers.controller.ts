import { Controller, Get, Post, Param, UseGuards, Req, NotFoundException, UseInterceptors } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
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
  // Route publique avec auth optionnelle pour retourner isFollowed aux utilisateurs connectés.
  // Ne pas cacher cette réponse: isFollowed dépend de l'utilisateur connecté.
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string, @Req() req: JwtRequest) {
    const seller = await this.sellersService.findOneVendor(id, req.user?.id);
    if (!seller) {
      throw new NotFoundException({
        code: 'SELLER_NOT_FOUND',
        message: 'Vendeur non trouvé',
      });
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
