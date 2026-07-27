import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { AfricastalkingSmsProvider } from './africastalking.provider';
import { SmsHttpError, SmsNetworkError } from '../sms.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AfricastalkingSmsProvider', () => {
  let provider: AfricastalkingSmsProvider;

  const config = {
    AFRICASTALKING_USERNAME: 'sandbox',
    AFRICASTALKING_API_KEY: 'apikey',
    AFRICASTALKING_FROM: 'TEST',
    AFRICASTALKING_SANDBOX: 'true',
    AFRICASTALKING_TIMEOUT_MS: 10000,
  };

  const configService = {
    get: jest.fn((key: string, defaultValue?: any) =>
      key in config ? (config as any)[key] : defaultValue,
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    configService.get.mockImplementation((key: string, defaultValue?: any) =>
      key in config ? (config as any)[key] : defaultValue,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AfricastalkingSmsProvider,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    provider = module.get(AfricastalkingSmsProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should expose provider name', () => {
    expect(provider.name).toBe('africastalking');
  });

  it('should send sms successfully', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        SMSMessageData: {
          Message: 'Sent',
          Recipients: [
            {
              status: 'Success',
              statusCode: 101,
              messageId: 'MSG123',
            },
          ],
        },
      },
    });

    const result = await provider.send('+243990000000', 'Hello World');

    expect(result.messageId).toBe('MSG123');
    expect(result.status).toBe('Success');
    expect(result.providerErrorCode).toBe(101);

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it('should include sender when configured', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        SMSMessageData: {
          Recipients: [
            {
              status: 'Success',
              statusCode: 101,
              messageId: 'ID',
            },
          ],
        },
      },
    });

    await provider.send('+243990000000', 'hello');

    const body = mockedAxios.post.mock.calls[0][1] as URLSearchParams;

    expect(body.get('from')).toBe('TEST');
  });

  it('should use sandbox endpoint', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        SMSMessageData: {
          Recipients: [
            {
              status: 'Success',
              statusCode: 101,
              messageId: 'ID',
            },
          ],
        },
      },
    });

    await provider.send('+243990000000', 'hello');

    expect(mockedAxios.post.mock.calls[0][0]).toContain(
      'api.sandbox.africastalking.com',
    );
  });

  it('should throw when configuration is missing', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'AFRICASTALKING_USERNAME') return '';
      if (key === 'AFRICASTALKING_API_KEY') return '';
      return undefined;
    });

    await expect(provider.send('+243990000000', 'hello')).rejects.toThrow(
      'missing_africastalking_config',
    );
  });

  it('should throw SmsHttpError when provider rejects message', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        SMSMessageData: {
          Recipients: [
            {
              status: 'Failed',
              statusCode: 400,
            },
          ],
        },
      },
    });

    await expect(
      provider.send('+243990000000', 'hello'),
    ).rejects.toBeInstanceOf(SmsHttpError);
  });

  it('should convert HTTP error to SmsHttpError', async () => {
    mockedAxios.post.mockRejectedValue({
      response: {
        status: 401,
        data: {
          error: 'Unauthorized',
        },
      },
    });

    await expect(
      provider.send('+243990000000', 'hello'),
    ).rejects.toBeInstanceOf(SmsHttpError);
  });

  it('should convert HTTP 500 to SmsHttpError', async () => {
    mockedAxios.post.mockRejectedValue({
      response: {
        status: 500,
        data: {},
      },
    });

    await expect(
      provider.send('+243990000000', 'hello'),
    ).rejects.toBeInstanceOf(SmsHttpError);
  });

  it('should convert network error to SmsNetworkError', async () => {
    mockedAxios.post.mockRejectedValue({
      request: {},
      message: 'Network Error',
    });

    await expect(
      provider.send('+243990000000', 'hello'),
    ).rejects.toBeInstanceOf(SmsNetworkError);
  });

  it('should rethrow unknown errors', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Unknown'));

    await expect(provider.send('+243990000000', 'hello')).rejects.toThrow(
      'Unknown',
    );
  });

  it('should handle abort signal gracefully', async () => {
    const cancelError = new Error('canceled');
    (cancelError as any).code = 'ERR_CANCELED';

    mockedAxios.post.mockRejectedValue(cancelError);
    (mockedAxios as any).isCancel = jest.fn().mockReturnValue(true);

    const controller = new AbortController();
    controller.abort();

    await expect(
      provider.send('+243990000000', 'hello', controller.signal),
    ).rejects.toThrow('canceled');
  });

  it('should omit sender when not configured', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'AFRICASTALKING_FROM') return '';
      return (config as any)[key];
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        SMSMessageData: {
          Recipients: [
            {
              status: 'Success',
              statusCode: 101,
              messageId: '1',
            },
          ],
        },
      },
    });

    await provider.send('+243990000000', 'hello');

    const body = mockedAxios.post.mock.calls[0][1] as URLSearchParams;

    expect(body.get('from')).toBeNull();
  });
});
