import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  describe('hash', () => {
    it('should hash a password correctly', async () => {
      const password = 'Password123!';
      const hash = await service.hash(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(await bcrypt.compare(password, hash)).toBe(true);
    });
  });

  describe('compare', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'Password123!';
      const hash = await bcrypt.hash(password, 10);
      
      const result = await service.compare(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const hash = await bcrypt.hash('CorrectPass123!', 10);
      const result = await service.compare('WrongPass123!', hash);
      expect(result).toBe(false);
    });

    it('should return false if password or hash is missing', async () => {
      expect(await service.compare('', 'somehash')).toBe(false);
      expect(await service.compare('somepass', '')).toBe(false);
    });
  });

  describe('validateComplexity', () => {
    it('should not throw for a strong password', () => {
      expect(() => service.validateComplexity('StrongPass123!')).not.toThrow();
    });

    it('should throw for a weak password (no uppercase)', () => {
      expect(() => service.validateComplexity('weakpass123!')).toThrow(HttpException);
    });

    it('should throw for a weak password (no number)', () => {
      expect(() => service.validateComplexity('StrongPass!')).toThrow(HttpException);
    });

    it('should throw for a short password', () => {
      expect(() => service.validateComplexity('P1!pas')).toThrow(HttpException);
    });
  });

  describe('generateResetToken', () => {
    it('should generate a token and its hash', async () => {
      const result = await service.generateResetToken();
      
      expect(result.token).toBeDefined();
      expect(result.hash).toBeDefined();
      expect(result.token.length).toBeGreaterThan(32);
      expect(await bcrypt.compare(result.token, result.hash)).toBe(true);
    });
  });

  describe('verifyResetToken', () => {
    it('should return true for valid reset token', async () => {
      const { token, hash } = await service.generateResetToken();
      const result = await service.verifyResetToken(token, hash);
      expect(result).toBe(true);
    });

    it('should return false for invalid reset token', async () => {
      const { hash } = await service.generateResetToken();
      const result = await service.verifyResetToken('invalid-token', hash);
      expect(result).toBe(false);
    });
  });
});

