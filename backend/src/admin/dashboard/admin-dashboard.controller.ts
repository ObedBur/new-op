import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminDashboardController {
  private readonly logger = new Logger(AdminDashboardController.name);

  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('stats')
  async getStats() {
    this.logger.log('ADMIN : Consultation des statistiques du dashboard');
    return this.dashboardService.getStats();
  }

  @Get('activity')
  async getRecentActivity() {
    this.logger.log('ADMIN : Consultation de l\'activité récente du dashboard');
    return this.dashboardService.getRecentActivity();
  }

  @Get('growth')
  async getGrowth() {
    this.logger.log('ADMIN : Consultation de la croissance des utilisateurs');
    return this.dashboardService.getUserGrowth();
  }
}
