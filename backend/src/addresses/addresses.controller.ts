import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtRequest } from '../auth/types/auth-request.types';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Req() req: JwtRequest, @Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(req.user.id, createAddressDto);
  }

  @Get()
  findAll(@Req() req: JwtRequest) {
    return this.addressesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: JwtRequest, @Param('id') id: string) {
    return this.addressesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req: JwtRequest,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(id, req.user.id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Req() req: JwtRequest, @Param('id') id: string) {
    return this.addressesService.remove(id, req.user.id);
  }
}
