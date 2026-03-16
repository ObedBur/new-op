import { Controller, Post, Body, HttpCode, HttpStatus, Get, Delete } from '@nestjs/common';
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
  constructor(private readonly authService: AuthService) {}

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
  resendOtp(@Body('email') email: string) { //  SIMPLIFI
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
    @Body('refreshToken') refreshToken: string, //  SIMPLIFI
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
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Req() req: JwtRequest) {
    const userId = req.user.id;
    return this.authService.getUserProfile(userId);
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

