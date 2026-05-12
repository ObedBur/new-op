import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, ServiceResponseDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

// ─── Routes publiques (utilisateurs authentifiés) ─────────────────────────────
@Controller('services')
export class ServicesController {
  private readonly logger = new Logger(ServicesController.name);

  constructor(private readonly servicesService: ServicesService) {}

  // Catalogue visible par tous les utilisateurs connectés (actifs uniquement)
  @Get()
  async findAllActive(): Promise<ServiceResponseDto[]> {
    return this.servicesService.findAllActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    return this.servicesService.findOne(id);
  }
}

// ─── Routes admin ─────────────────────────────────────────────────────────────
@Controller('admin/services')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminServicesController {
  private readonly logger = new Logger(AdminServicesController.name);

  constructor(private readonly servicesService: ServicesService) {}

  // Créer un service
  @Post()
  async create(@Body() createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    this.logger.log(`ADMIN : Création d'un nouveau service catalogue: ${createServiceDto.name}`);
    return this.servicesService.create(createServiceDto);
  }

  // Lister TOUS les services (actifs + inactifs)
  @Get()
  async findAll(): Promise<ServiceResponseDto[]> {
    return this.servicesService.findAll();
  }

  // Modifier un service
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto): Promise<ServiceResponseDto> {
    this.logger.log(`ADMIN : Modification du service catalogue ID: ${id}`);
    return this.servicesService.update(id, updateServiceDto);
  }

  // Supprimer un service
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ServiceResponseDto> {
    this.logger.log(`ADMIN : Suppression du service catalogue ID: ${id}`);
    return this.servicesService.remove(id);
  }
}
