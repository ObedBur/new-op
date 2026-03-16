import { Controller, Get, Put, Param, Body, UseGuards, Query, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard) // Protg par JWT + Admin seulement
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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

  @Get('users/:id')
  @HttpCode(HttpStatus.OK)
  async getUserDetails(@Param('id') userId: string) {
    return this.adminService.getUserDetails(userId);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Put('users/:id/kyc')
  @HttpCode(HttpStatus.OK)
  async updateKycStatus(
    @Param('id') userId: string,
    @Body() body: { status: string; rejectionReason?: string },
  ) {
    return this.adminService.updateKycStatus(userId, body.status, body.rejectionReason);
  }

  @Get('kyc/pending')
  @HttpCode(HttpStatus.OK)
  async getPendingKyc() {
    return this.adminService.getPendingKyc();
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('activities')
  @HttpCode(HttpStatus.OK)
  async getRecentActivities() {
    return this.adminService.getRecentActivities();
  }
}

