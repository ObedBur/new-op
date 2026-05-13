import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RtStrategy } from './strategies/rt.strategy';


import { TokenService } from './services/token.service';
import { OtpService } from './services/otp.service';
import { PasswordService } from './services/password.service';
import { UserValidationService } from './services/user-validation.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, OtpService, PasswordService, UserValidationService, JwtStrategy, RtStrategy],
  exports: [AuthService, TokenService, OtpService, PasswordService, UserValidationService, JwtModule],
})
export class AuthModule {}

