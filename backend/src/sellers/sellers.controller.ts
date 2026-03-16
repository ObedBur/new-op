import { Controller, Get } from '@nestjs/common';
import { SellersService } from './sellers.service';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  async getActiveSellers() {
    return this.sellersService.findActiveVendors();
  }
}
