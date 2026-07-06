import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

export interface SmsSendResult {
  sent: boolean;
  provider: 'mock' | 'twilio' | 'africastalking';
  attempts?: number;
  durationMs?: number;
  messageId?: string;
  status?: string;
  providerErrorCode?: number;
  providerErrorMessage?: string;
  skipped?: boolean;
  reason?: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendSms(to: string, message: string): Promise<SmsSendResult> {
    const startedAt = Date.now();

    if (!to?.trim()) {
      this.logger.warn('[SMS MOCK] skipped: missing phone number');
      return {
        sent: false,
        provider: 'mock',
        attempts: 0,
        durationMs: Date.now() - startedAt,
        skipped: true,
        reason: 'missing_phone_number',
      };
    }

    if (!message?.trim()) {
      this.logger.warn(`[SMS MOCK] skipped: empty message for ${to}`);
      return {
        sent: false,
        provider: 'mock',
        attempts: 0,
        durationMs: Date.now() - startedAt,
        skipped: true,
        reason: 'empty_message',
      };
    }

    const preview =
      message.length > 100 ? `${message.slice(0, 100)}...[truncated, ${message.length} chars total]` : message;

    if (process.env.SMS_PROVIDER === 'twilio') {
      return this.sendViaTwilio(to, message, preview, startedAt);
    }

    if (process.env.SMS_PROVIDER === 'africastalking') {
      return this.sendViaAfricasTalking(to, message, preview, startedAt);
    }

    this.logger.log(`[SMS MOCK] to=${to} message="${preview}"`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      sent: true,
      provider: 'mock',
      attempts: 1,
      durationMs: Date.now() - startedAt,
    };
  }

  private async sendViaTwilio(to: string, message: string, preview: string, startedAt: number): Promise<SmsSendResult> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    if (!accountSid || !authToken || (!from && !messagingServiceSid)) {
      this.logger.error(
        '[SMS TWILIO] missing config: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID are required',
      );

      return {
        sent: false,
        provider: 'twilio',
        attempts: 0,
        durationMs: Date.now() - startedAt,
        skipped: true,
        reason: 'missing_twilio_config',
      };
    }

    const form = new URLSearchParams({
      To: to,
      Body: message,
    });

    if (messagingServiceSid) {
      form.set('MessagingServiceSid', messagingServiceSid);
    } else if (from) {
      form.set('From', from);
    }

    try {
      this.logger.log(`[SMS TWILIO] sending to=${to} message="${preview}"`);
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        form,
        {
          auth: {
            username: accountSid,
            password: authToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: Number(process.env.TWILIO_TIMEOUT_MS || 10000),
        },
      );

      return {
        sent: true,
        provider: 'twilio',
        attempts: 1,
        durationMs: Date.now() - startedAt,
        messageId: response.data?.sid,
        status: response.data?.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ code?: number; message?: string; status?: number }>;
      const twilioCode = axiosError.response?.data?.code;
      const twilioMessage = axiosError.response?.data?.message || axiosError.message;
      const twilioStatus = axiosError.response?.status;
      this.logger.error(
        `[SMS TWILIO] failed status=${twilioStatus ?? 'unknown'} code=${twilioCode ?? 'unknown'} message=${twilioMessage}`,
      );

      return {
        sent: false,
        provider: 'twilio',
        attempts: 1,
        durationMs: Date.now() - startedAt,
        providerErrorCode: twilioCode,
        providerErrorMessage: twilioMessage,
        reason: `twilio_error${twilioStatus ? `_${twilioStatus}` : ''}`,
      };
    }
  }

  private async sendViaAfricasTalking(
    to: string,
    message: string,
    preview: string,
    startedAt: number,
  ): Promise<SmsSendResult> {
    const username = process.env.AFRICASTALKING_USERNAME;
    const apiKey = process.env.AFRICASTALKING_API_KEY;
    const from = process.env.AFRICASTALKING_FROM;
    const isSandbox = process.env.AFRICASTALKING_SANDBOX === 'true' || username === 'sandbox';
    const baseUrl = isSandbox
      ? 'https://api.sandbox.africastalking.com/version1'
      : 'https://api.africastalking.com/version1';

    if (!username || !apiKey) {
      this.logger.error('[SMS AFRICASTALKING] missing config: AFRICASTALKING_USERNAME and AFRICASTALKING_API_KEY are required');

      return {
        sent: false,
        provider: 'africastalking',
        attempts: 0,
        durationMs: Date.now() - startedAt,
        skipped: true,
        reason: 'missing_africastalking_config',
      };
    }

    const form = new URLSearchParams({
      username,
      to,
      message,
    });

    if (from) {
      form.set('from', from);
    }

    try {
      this.logger.log(`[SMS AFRICASTALKING] sending to=${to} message="${preview}" sandbox=${isSandbox}`);
      const response = await axios.post(`${baseUrl}/messaging`, form, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          apiKey,
        },
        timeout: Number(process.env.AFRICASTALKING_TIMEOUT_MS || 10000),
      });

      const recipient = response.data?.SMSMessageData?.Recipients?.[0];
      const status = recipient?.status || response.data?.SMSMessageData?.Message;
      const messageId = recipient?.messageId;
      const sent = !recipient || ['Success', 'Sent', 'Submitted'].includes(recipient.status);

      return {
        sent,
        provider: 'africastalking',
        attempts: 1,
        durationMs: Date.now() - startedAt,
        messageId,
        status,
        ...(!sent && {
          providerErrorCode: recipient?.statusCode,
          providerErrorMessage: recipient?.status,
          reason: 'africastalking_rejected',
        }),
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ errorMessage?: string; message?: string }>;
      const providerMessage =
        axiosError.response?.data?.errorMessage || axiosError.response?.data?.message || axiosError.message;
      const providerStatus = axiosError.response?.status;

      this.logger.error(
        `[SMS AFRICASTALKING] failed status=${providerStatus ?? 'unknown'} message=${providerMessage}`,
      );

      return {
        sent: false,
        provider: 'africastalking',
        attempts: 1,
        durationMs: Date.now() - startedAt,
        providerErrorCode: providerStatus,
        providerErrorMessage: providerMessage,
        reason: `africastalking_error${providerStatus ? `_${providerStatus}` : ''}`,
      };
    }
  }
}
