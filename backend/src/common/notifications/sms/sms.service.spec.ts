import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  SmsService,
  SmsTimeoutError,
  SmsNetworkError,
  SmsHttpError,
  SmsInvalidResponseError,
} from './sms.service';
import { MockSmsProvider } from './providers/mock.provider';
import { TwilioSmsProvider } from './providers/twilio.provider';
import { SMS_PROVIDER_TOKEN } from './constants/sms.constants';
import { smsProviderFactory } from './sms.factory';

describe('SmsService Architecture & Robustness', () => {
  let service: SmsService;
  let mockProvider: MockSmsProvider;

  beforeEach(async () => {
    // ConfigService mock
    const configServiceMock = {
      get: jest.fn((key: string, defaultValue: any) => {
        if (key === 'SMS_TIMEOUT_MS') return 5000;
        if (key === 'SMS_PROVIDER') return 'mock';
        return defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        MockSmsProvider,
        TwilioSmsProvider,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        smsProviderFactory,
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
    mockProvider = module.get<MockSmsProvider>(MockSmsProvider);

    // Empêche le logger d'encombrer la console pendant les tests
    jest.spyOn(service['logger'], 'log').mockImplementation(() => {});
    jest.spyOn(service['logger'], 'warn').mockImplementation(() => {});
    jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Factory et Injection', () => {
    it('doit injecter le MockSmsProvider par défaut', () => {
      expect(service['provider']).toBeInstanceOf(MockSmsProvider);
      expect(service['provider'].name).toBe('mock');
    });
  });

  describe('Validation des entrées', () => {
    it('doit refuser un numéro vide', async () => {
      const result = await service.sendSms('', 'Hello');
      expect(result).toEqual({
        sent: false,
        provider: 'mock',
        skipped: true,
        reason: 'missing_phone_number',
      });
    });

    it('doit refuser un numéro non E.164', async () => {
      const result = await service.sendSms('0612345678', 'Hello');
      expect(result).toEqual({
        sent: false,
        provider: 'mock',
        skipped: true,
        reason: 'phone_invalid',
      });
    });
  });

  describe('Gestion des erreurs et Retry avec le Provider Injecté', () => {
    const validPhone = '+33612345678';
    const validMessage = 'Test robustness';

    it('doit réussir du premier coup via le provider injecté', async () => {
      jest.spyOn(mockProvider, 'send').mockResolvedValue({ messageId: '123' });

      const result = await service.sendSms(validPhone, validMessage);

      expect(result.sent).toBe(true);
      expect(result.attempts).toBe(1);
      expect(mockProvider.send).toHaveBeenCalledTimes(1);
    });

    it('doit retry sur SmsTimeoutError', async () => {
      jest
        .spyOn(mockProvider, 'send')
        .mockRejectedValueOnce(new SmsTimeoutError(5000))
        .mockResolvedValueOnce({ messageId: '123' });

      const result = await service.sendSms(validPhone, validMessage);

      expect(result.sent).toBe(true);
      expect(result.attempts).toBe(2);
      expect(mockProvider.send).toHaveBeenCalledTimes(2);
    });

    it('NE doit PAS retry sur erreur HTTP 400', async () => {
      jest.spyOn(mockProvider, 'send').mockRejectedValue(new SmsHttpError(400));

      const result = await service.sendSms(validPhone, validMessage);

      expect(result.sent).toBe(false);
      expect(result.reason).toBe('provider_error');
      expect(result.attempts).toBe(1);
      expect(mockProvider.send).toHaveBeenCalledTimes(1);
    });
  });

  describe('Providers individuels', () => {
    it('MockSmsProvider doit simuler un envoi', async () => {
      const res = await mockProvider.send('+33600000000', 'Test');
      expect(res.status).toBe('queued');
      expect(res.messageId).toContain('mock-');
    });

    it('TwilioSmsProvider doit throw une exception "Not implemented"', async () => {
      const twilioProvider = new TwilioSmsProvider();
      await expect(twilioProvider.send('+33600000000', 'Test')).rejects.toThrow(
        'Twilio provider not yet implemented.',
      );
    });
  });
});
