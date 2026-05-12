<<<<<<< HEAD
import { Controller, Post, Body, HttpCode, HttpStatus, Get, Delete, Patch, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RtGuard } from './guards/rt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UseGuards, Req } from '@nestjs/common';
import { AuthThrottlerGuard } from './guards/auth-throttler.guard';
import type { JwtRequest, RefreshRequest } from './types/auth-request.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // =============== PUBLIC ROUTES ===============

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthThrottlerGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthThrottlerGuard)
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @UseGuards(AuthThrottlerGuard)
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }

  @UseGuards(AuthThrottlerGuard)
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);

  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // =============== PROTECTED ROUTES ===============

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Req() req: JwtRequest,
    @Body('refreshToken') refreshToken: string,
  ) {
    const userId = req.user.id;
    return this.authService.logout(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  logoutAll(@Req() req: JwtRequest) {
    const userId = req.user.id;
    return this.authService.logoutAll(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: RefreshRequest) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
=======
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Patch,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Tentative d'inscription pour : ${createUserDto.email}`);
    return this.authService.register(createUserDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 900000 } })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 900000 } })
  async resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Tentative de connexion pour : ${loginDto.email}`);
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @CurrentUser('sub') userId: string,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
<<<<<<< HEAD
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Req() req: JwtRequest) {
    const userId = req.user.id;
    return this.authService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('profile')
  async updateProfile(
    @Req() req: JwtRequest,
    @Body() dto: any,
  ) {
    const userId = req.user.id;
    return this.authService.updateProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('profile')
  async patchProfile(
    @Req() req: JwtRequest,
    @Body() dto: any,
  ) {
    const userId = req.user.id;
    return this.authService.updateProfile(userId, dto);
  }

  // =============== DEV ROUTES ===============

  @Get('test-users')
  @HttpCode(HttpStatus.OK)
  async getTestUsers() {
    if (process.env.NODE_ENV === 'production') {
      return { success: false, message: 'Not available in production' };
    }
    const users = await this.authService.getUsersForTesting();
    return {
      success: true,
      count: users.length,
      users,
    };
  }

  @Delete('test-users')
  @HttpCode(HttpStatus.OK)
  async clearTestUsers() {
    if (process.env.NODE_ENV === 'production') {
      return { success: false, message: 'Not available in production' };
    }
    await this.authService.clearUsersForTesting();
    return {
      success: true,
      message: 'Test users cleared',
      timestamp: new Date().toISOString(),
    };
  }
}

=======
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 900000 } })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    this.logger.log(`Demande de réinitialisation de mot de passe pour : ${forgotPasswordDto.email}`);
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 900000 } })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    this.logger.log(`Réinitialisation effective du mot de passe via token`);
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  async updateMe(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateMe(userId, updateUserDto);
  }
}
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
