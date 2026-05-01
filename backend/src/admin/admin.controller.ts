import { Controller, Get, Put, Param, Body, UseGuards, Query, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';

/**
 * Contrôleur d'administration.
 * Accès restreint aux utilisateurs possédant le rôle ADMIN.
 */
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Liste tous les utilisateurs de la plateforme avec pagination.
   */
  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query('role') role?: string,
    @Query('kycStatus') kycStatus?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllUsers({
      role,
      kycStatus,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }

  /**
   * Récupère les détails d'un utilisateur spécifique.
   */
  @Get('users/:id')
  @HttpCode(HttpStatus.OK)
  async getUserDetails(@Param('id') userId: string) {
    return this.adminService.getUserDetails(userId);
  }

  /**
   * Supprime un utilisateur et toutes ses données (Produits, Commandes, etc.).
   */
  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  /**
   * Met à jour le statut KYC d'un vendeur.
   */
  @Put('users/:id/kyc')
  @HttpCode(HttpStatus.OK)
  async updateKycStatus(
    @Param('id') userId: string,
    @Body() body: { status: string; rejectionReason?: string },
  ) {
    return this.adminService.updateKycStatus(userId, body.status, body.rejectionReason);
  }

  /**
   * Récupère les dossiers KYC en attente de validation.
   */
  @Get('kyc/pending')
  @HttpCode(HttpStatus.OK)
  async getPendingKyc() {
    return this.adminService.getPendingKyc();
  }

  /**
   * Dashboard : Statistiques globales de la plateforme.
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats() {
    return this.adminService.getStats();
  }

  /**
   * Dashboard : Flux des activités récentes (Commandes, Inscriptions).
   */
  @Get('activities')
  @HttpCode(HttpStatus.OK)
  async getRecentActivities() {
    return this.adminService.getRecentActivities();
  }
}
