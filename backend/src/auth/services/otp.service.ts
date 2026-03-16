import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../common/email/email.service';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // Genere un nouvel OTP, le stocke et l'envoie par email
  async generateAndSend(userId: string, email: string): Promise<string> {
    const plainOtp = this.generateOtp();
    const otpHash = await bcrypt.hash(plainOtp, AUTH_CONSTANTS.BCRYPT_ROUNDS);
    const otpExpiresAt = new Date(Date.now() + AUTH_CONSTANTS.OTP_EXPIRY_MS);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
      },
    });

    // Logging en dev (toujours avant l'envoi pour rapidit)
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`[DEV OTP] ${email} -> ${plainOtp}`);
    }

    // Envoi en arrire-plan sans "await" pour ne pas bloquer le frontend
    this.emailService.sendOtp(email, plainOtp).catch(err => 
      this.logger.error(`Background email send failed: ${err.message}`)
    );

    return plainOtp;
  }

  // Verifie un OTP fourni par l'utilisateur
  async verify(email: string, otp: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('Invalid OTP request', HttpStatus.BAD_REQUEST);
    }

    // Securite: Pas d'OTP actif ou dj verifie
    if (!user.otpHash || !user.otpExpiresAt || user.isVerified) {
      throw new HttpException('Invalid OTP request', HttpStatus.BAD_REQUEST);
    }

    // Securite: Tentatives puises
    if (user.otpAttempts >= AUTH_CONSTANTS.MAX_OTP_ATTEMPTS) {
      await this.clearOtp(user.id);
      throw new HttpException(
        'Too many failed attempts. Please request a new OTP.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Securite: Expiration
    if (user.otpExpiresAt < new Date()) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }

    // Comparaison
    const isValid = await bcrypt.compare(otp, user.otpHash);

    if (!isValid) {
      await this.incrementAttempts(user.id);
      const remaining = AUTH_CONSTANTS.MAX_OTP_ATTEMPTS - (user.otpAttempts + 1);
      throw new HttpException(
        `Invalid OTP. ${remaining} attempt(s) remaining.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }

  // Nettoie les donnes OTP d'un utilisateur
  async clearOtp(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        otpHash: null,
        otpExpiresAt: null,
        otpAttempts: 0,
      },
    });
  }

  /**
   * Incrmente le compteur de tentatives infructueuses
   */
  private async incrementAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        otpAttempts: { increment: 1 },
      },
    });
  }

  // Genere un code numrique  6 chiffres
  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
}

