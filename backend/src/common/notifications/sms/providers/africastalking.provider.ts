import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { ISmsProvider, ProviderResponse } from '../interfaces/sms-provider.interface';
import { SmsHttpError, SmsNetworkError } from '../sms.service';

@Injectable()
export class AfricastalkingSmsProvider implements ISmsProvider {
  private readonly logger = new Logger(AfricastalkingSmsProvider.name);
  public readonly name = 'africastalking';

  constructor(private readonly configService: ConfigService) {}

  async send(phone: string, message: string): Promise<ProviderResponse> {
    const username = this.configService.get<string>('AFRICASTALKING_USERNAME')?.trim();
    const apiKey = this.configService.get<string>('AFRICASTALKING_API_KEY')?.trim();
    const from = this.configService.get<string>('AFRICASTALKING_FROM')?.trim();
    const isSandbox = this.configService.get<string>('AFRICASTALKING_SANDBOX') === 'true' || username === 'sandbox';
    
    const baseUrl = isSandbox
      ? 'https://api.sandbox.africastalking.com/version1'
      : 'https://api.africastalking.com/version1';

    if (!username || !apiKey) {
      this.logger.error('[SMS AFRICASTALKING] missing config: AFRICASTALKING_USERNAME and AFRICASTALKING_API_KEY are required');
      throw new Error('missing_africastalking_config');
    }

    const form = new URLSearchParams({
      username,
      to: phone,
      message,
    });

    if (from) {
      form.set('from', from);
    }

    try {
      const response = await axios.post(`${baseUrl}/messaging`, form, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          apiKey,
        },
        timeout: this.configService.get<number>('AFRICASTALKING_TIMEOUT_MS', 30000),
      });

      this.logger.debug(`[SMS AFRICASTALKING] Raw response: ${JSON.stringify(response.data)}`);

      const recipient = response.data?.SMSMessageData?.Recipients?.[0];
      const status = recipient?.status || response.data?.SMSMessageData?.Message;
      const messageId = recipient?.messageId;
      const isSuccess = recipient && ['Success', 'Sent', 'Submitted'].includes(recipient.status);

      if (!isSuccess) {
        this.logger.error(`[SMS AFRICASTALKING] rejected by provider: ${status}`);
        throw new SmsHttpError(recipient?.statusCode || 400);
      }

      return {
        messageId,
        status,
        providerErrorCode: recipient?.statusCode,
        providerErrorMessage: recipient?.status,
      };
        } catch (error) {
      if (error instanceof SmsHttpError) {
        throw error;
      }

      const axiosError = error as AxiosError;

      if (axiosError.response) {
        this.logger.error(
          `[SMS AFRICASTALKING] HTTP ${axiosError.response.status}: ${JSON.stringify(
            axiosError.response.data,
          )}`,
        );

        throw new SmsHttpError(axiosError.response.status);
      }

      if (axiosError.request) {
        this.logger.error(
          `[SMS AFRICASTALKING] Network error: ${axiosError.message}`,
        );

        throw new SmsNetworkError(axiosError.message);
      }

      this.logger.error(
        `[SMS AFRICASTALKING] Unknown error: ${String(error)}`,
      );

      throw error;
    }
  }
}