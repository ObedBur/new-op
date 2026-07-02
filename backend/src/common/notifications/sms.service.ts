import { Injectable, Logger } from '@nestjs/common';

export interface SmsSendResult {
  sent: boolean;
  provider: 'mock';
  skipped?: boolean;
  reason?: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendSms(to: string, message: string): Promise<SmsSendResult> {
    if (!to?.trim()) {
      this.logger.warn('[SMS MOCK] skipped: missing phone number');
      return {
        sent: false,
        provider: 'mock',
        skipped: true,
        reason: 'missing_phone_number',
      };
    }

    if (!message?.trim()) {
      this.logger.warn(`[SMS MOCK] skipped: empty message for ${to}`);
      return {
        sent: false,
        provider: 'mock',
        skipped: true,
        reason: 'empty_message',
      };
    }

    this.logger.log(`[SMS MOCK] to=${to} message="${message}"`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      sent: true,
      provider: 'mock',
    };
  }
}