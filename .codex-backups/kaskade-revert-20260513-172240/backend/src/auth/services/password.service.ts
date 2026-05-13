import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

@Injectable()
export class PasswordService {
  /**
   * Hashes a password using bcrypt
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, AUTH_CONSTANTS.BCRYPT_ROUNDS);
  }

  /**
   * Compares a password with a hash
   */
  async compare(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) return false;
    return bcrypt.compare(password, hash);
  }

  /**
   * Validates password complexity
   * Only enforced in production environment via AuthService check (or here)
   */
  validateComplexity(password: string): void {
    if (!AUTH_CONSTANTS.PASSWORD_REGEX.test(password)) {
      throw new HttpException(
        'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Generates a secure random reset token and its hash
   */
  async generateResetToken(): Promise<{ token: string; hash: string }> {
    const token = crypto.randomBytes(AUTH_CONSTANTS.RESET_TOKEN_BYTES).toString('hex');
    const hash = await this.hash(token);
    return { token, hash };
  }

  /**
   * Verifies a reset token against its hash
   */
  async verifyResetToken(token: string, hash: string): Promise<boolean> {
    return this.compare(token, hash);
  }
}

