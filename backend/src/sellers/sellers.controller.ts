import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SellersService } from './sellers.service';

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
}
