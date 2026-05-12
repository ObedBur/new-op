import {
  Injectable,
<<<<<<< HEAD
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../common/email/email.service';
import { UserRole } from '@prisma/client';
import { AUTH_CONSTANTS } from './constants/auth.constants';

import { TokenService } from './services/token.service';
import { OtpService } from './services/otp.service';
import { PasswordService } from './services/password.service';
import { UserValidationService } from './services/user-validation.service';
=======
  UnauthorizedException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
<<<<<<< HEAD
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly passwordService: PasswordService,
    private readonly userValidationService: UserValidationService,
    private readonly emailService: EmailService,
  ) { }

  // ========================= REGISTER =========================

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    if (dto.role === UserRole.VENDOR && !dto.boutiqueName) {
      throw new HttpException(
        'Boutique name is required for vendors',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validation du mot de passe
    this.passwordService.validateComplexity(dto.password);

    const passwordHash = await this.passwordService.hash(dto.password);

    const trustScore = this.userValidationService.getInitialTrustScore(dto.role);
    const kycStatus = this.userValidationService.getInitialKycStatus(dto.role);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
        province: dto.province,
        commune: dto.commune,
        city: dto.city || dto.commune,
        country: dto.country || "RD Congo",
        address: dto.address,
        boutiqueName: dto.boutiqueName,
        role: dto.role,
        kycStatus,
        trustScore,
        dailyPublications: 0,
      },
    });

    await this.otpService.generateAndSend(user.id, user.email);

    return {
      success: true,
      message: 'Registration successful. Verify OTP.',
      requiresKyc: dto.role === UserRole.VENDOR,
    };
  }

  // ========================= VERIFY OTP =========================

  async verifyOtp(dto: VerifyOtpDto) {
    await this.otpService.verify(dto.email, dto.otp);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpHash: null,
        otpExpiresAt: null,
        otpAttempts: 0,
        trustScore: this.userValidationService.calculateScoreAfterVerification(user.trustScore),
      },
    });

    // Envoi du message de bienvenue
    this.emailService.sendWelcomeEmail(user.email, user.fullName).catch(err =>
      this.logger.error(`Failed to send welcome email to ${user.email}`, err)
    );

    return { success: true, message: 'Account verified successfully' };
  }

  // ========================= LOGIN =========================

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      this.logger.debug(`Utilisateur non trouvé: ${dto.email}`);
      // En prod, message générique pour sécurité. En dev, message spécifique
      const message = process.env.NODE_ENV === 'production'
        ? 'Identifiants invalides'
        : 'Email not found';
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }

    this.logger.debug(`Tentative de connexion pour: ${dto.email}, Password Length: ${dto.password?.length}`);
    const isPasswordValid = await this.passwordService.compare(dto.password, user.password);
    this.logger.debug(`Mot de passe valide: ${isPasswordValid}`);

    if (!isPasswordValid) {
      this.logger.debug(`Mot de passe incorrect pour: ${dto.email}`);
      // En prod, message générique pour sécurité. En dev, message spécifique
      const message = process.env.NODE_ENV === 'production'
        ? 'Identifiants invalides'
        : 'Invalid password';
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }

    this.userValidationService.validateLoginEligibility(user);

    const tokens = await this.tokenService.generateTokenPair(user);
    await this.tokenService.saveRefreshToken(user.id, tokens.refresh_token);

    return {
      success: true,
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        trustScore: user.trustScore,
        city: user.city,
        country: user.country,
      },
    };
  }

  // ========================= FORGOT PASSWORD =========================

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) return { success: true };

    const { token, hash: tokenHash } = await this.passwordService.generateResetToken();

    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`[DEV RESET TOKEN] ${dto.email} -> ${token}`);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: new Date(Date.now() + AUTH_CONSTANTS.RESET_TOKEN_EXPIRY_MS),
      },
    });

    await this.emailService.sendPasswordReset(dto.email, token);
    return { success: true };
  }

  // ========================= RESET PASSWORD (CORRIG) =========================

  async resetPassword(dto: ResetPasswordDto) {
    // VRIFICATION PAR EMAIL - CORRECTION CRITIQUE
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
    }

    if (!user.resetTokenHash || !user.resetTokenExpiresAt) {
      throw new HttpException('No active reset request', HttpStatus.BAD_REQUEST);
    }

    if (new Date() > user.resetTokenExpiresAt) {
      // Nettoyer le token expir
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetTokenHash: null,
          resetTokenExpiresAt: null,
        },
      });
      throw new HttpException('Reset token has expired', HttpStatus.BAD_REQUEST);
    }

    const isValid = await this.passwordService.verifyResetToken(dto.token, user.resetTokenHash);
    if (!isValid) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    // Validation de la complexité du nouveau mot de passe
    this.passwordService.validateComplexity(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await this.passwordService.hash(dto.newPassword),
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
    });

    // Invalidate all sessions after password change
    await this.tokenService.revokeAllRefreshTokens(user.id);

    return { success: true, message: 'Password reset successful' };
  }

  // ========================= LOGOUT =========================

  async logout(userId: string, refreshToken: string) {
    const revoked = await this.tokenService.revokeRefreshToken(userId, refreshToken);

    return {
      success: true,
      message: revoked ? 'Session logged out successfully' : 'Session already terminated',
    };
  }

  async logoutAll(userId: string) {
    await this.tokenService.revokeAllRefreshTokens(userId);
    return { success: true, message: 'All sessions logged out' };
  }

  // ========================= REFRESH =========================

  async refreshTokens(userId: string, refreshToken: string) {
    return this.tokenService.refreshTokenPair(userId, refreshToken);
  }

  // ========================= UTILITY =========================

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        province: true,
        commune: true,
        city: true,
        country: true,
        address: true,
        boutiqueName: true,
        kycStatus: true,
        trustScore: true,
        isVerified: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return { success: true, user };
  }

  async resendOtp(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.isVerified) {
      return { success: true };
    }

    await this.otpService.generateAndSend(user.id, user.email);
    return { success: true, message: 'New OTP sent' };
  }

  // ========================= DEV METHODS =========================

  async updateProfile(userId: string, dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    const data: any = {};

    if (dto.fullName) data.fullName = dto.fullName;
    if (dto.email) data.email = dto.email;
    if (dto.phone) data.phone = dto.phone;
    if (dto.province) data.province = dto.province;
    if (dto.commune) data.commune = dto.commune;
    if (dto.address) data.address = dto.address;
    if (dto.city) data.city = dto.city;
    if (dto.boutiqueName) data.boutiqueName = dto.boutiqueName;
    if (dto.avatarUrl) data.avatarUrl = dto.avatarUrl;
    if (dto.profilePicture && typeof dto.profilePicture === 'string') {
      data.avatarUrl = dto.profilePicture;
    }

    // Gestion du mot de passe
    if (dto.password) {
      if (!dto.oldPassword) {
        throw new HttpException('L\'ancien mot de passe est requis', HttpStatus.BAD_REQUEST);
      }
      const isOldPasswordValid = await this.passwordService.compare(dto.oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new HttpException('L\'ancien mot de passe est incorrect', HttpStatus.UNAUTHORIZED);
      }

      // Validation de la complexité du nouveau mot de passe
      this.passwordService.validateComplexity(dto.password);

      data.password = await this.passwordService.hash(dto.password);
    }

    // Mise à jour (Prisma)
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        province: true,
        commune: true,
        city: true,
        country: true,
        address: true,
        boutiqueName: true,
        kycStatus: true,
        trustScore: true,
        isVerified: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { success: true, user: updatedUser };
  }

  async getUsersForTesting() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isVerified: true,
        kycStatus: true,
        boutiqueName: true,
        province: true,
        commune: true,
        city: true,
        country: true,
        trustScore: true,
        createdAt: true,
      },
    });
  }

  async clearUsersForTesting() {
    await this.prisma.refreshToken.deleteMany({});
    await this.prisma.user.deleteMany({});
    this.logger.warn('All users and tokens cleared (DEV)');
  }
}

=======
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    
    // Génération OTP (6 chiffres)
    const otp = this.generateOtp();
    
    // Stockage dans Redis (Expire après 10 min)
    await this.redisService.set(`otp:${user.email}`, otp, 600);
    
    // Envoi de l'e-mail via Brevo
    try {
      await this.mailService.sendVerificationEmail(user.email, user.fullName, otp, user.role);
    } catch (error) {
      this.logger.error(`Échec de l'envoi de l'e-mail à ${user.email}`, error);
    }

    return {
      message: 'Inscription réussie. Veuillez vérifier votre boîte e-mail pour activer votre compte.',
      userId: user.id,
      email: user.email,
    };
  }

  async verifyOtp(email: string, otp: string) {
    const storedOtp = await this.redisService.get(`otp:${email}`);
    
    if (!storedOtp || storedOtp !== otp) {
      throw new BadRequestException('Code de vérification invalide ou expiré');
    }

    // Activer l'utilisateur
    await this.usersService.updateByEmail(email, { isVerified: true });
    
    // Supprimer l'OTP
    await this.redisService.del(`otp:${email}`);

    // Émettre un événement pour notifier le module Notifications
    const user = await this.usersService.findByEmail(email);
    if (user) {
      this.eventEmitter.emit('auth.registered', { userId: user.id });
    }

    return { message: 'Compte vérifié avec succès. Vous pouvez maintenant vous connecter.' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // Vérifier si l'utilisateur est vérifié (Brevo Flow)
    if (!user.isVerified) {
      throw new UnauthorizedException('Veuillez vérifier votre compte par e-mail avant de vous connecter.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`Connexion réussie: ${user.email} (ID: ${user.id})`);

    const {
      password: _pw,
      refreshToken: _rt,
      ...userWithoutSecrets
    } = user;

    return {
      message: 'Connexion réussie',
      user: userWithoutSecrets,
      tokens,
    };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findOneSafe(userId);
    return user;
  }

  async resendOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Utilisateur non trouvé');
    if (user.isVerified) throw new BadRequestException('Compte déjà vérifié');

    const otp = this.generateOtp();
    await this.redisService.set(`otp:${email}`, otp, 600);

    await this.mailService.sendVerificationEmail(email, user.fullName, otp, user.role);

    return { message: 'Un nouveau code de vérification a été envoyé à votre adresse e-mail.' };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    this.logger.log(
      `Déconnexion réussie pour l'utilisateur ID: ${userId}`,
    );
    return { message: 'Déconnexion réussie' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Pour éviter le User Enumeration, on répond toujours la même chose
      return { message: 'Si un compte existe avec cette adresse, un e-mail de réinitialisation a été envoyé.' };
    }

    // Génération du token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Enregistrement dans Redis avec un TTL de 1 heure (3600 secondes)
    await this.redisService.set(`reset-password:${resetToken}`, user.email, 3600);

    try {
      await this.mailService.sendPasswordResetEmail(user.email, user.fullName, resetToken);
      this.logger.log(`E-mail de réinitialisation envoyé à ${user.email}`);
    } catch (error) {
      this.logger.error(`Échec de l'envoi de l'e-mail de réinitialisation à ${user.email}`, error);
    }

    return { message: 'Si un compte existe avec cette adresse, un e-mail de réinitialisation a été envoyé.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const email = await this.redisService.get(`reset-password:${token}`);
    
    if (!email) {
      throw new BadRequestException('Le lien de réinitialisation est invalide ou a expiré.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    // Le hashage du mot de passe sera géré dans usersService.update
    await this.usersService.update(user.id, { password: newPassword });

    // On supprime le token de Redis pour qu'il soit à usage unique
    await this.redisService.del(`reset-password:${token}`);

    return { message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Accès refusé');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Accès refusé');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateMe(userId: string, updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  /** Génère un code OTP numérique à 6 chiffres. */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ) {
    if (refreshToken) {
      refreshToken = await bcrypt.hash(refreshToken, 10);
    }
    await this.usersService.updateRefreshToken(userId, refreshToken);
  }

  private async getTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
