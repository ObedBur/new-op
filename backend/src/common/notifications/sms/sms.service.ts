import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISmsProvider, ProviderResponse } from './interfaces/sms-provider.interface';
import { SMS_PROVIDER_TOKEN } from './constants/sms.constants';

// ─── Types publics ─────────────────────────────────────────────────────────────

export interface SmsSendResult {
  sent: boolean;
  provider: string;
  skipped?: boolean;
  reason?: string;
  attempts?: number;
  durationMs?: number;
}

export interface SmsMetrics {
  totalSent: number;
  totalFailed: number;
  totalTimeout: number;
  totalRetries: number;
  callCount: number;
  totalDurationMs: number;
}

// ─── Classes d'erreurs typées ──────────────────────────────────────────────────

export class SmsTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`SMS provider n'a pas répondu dans les ${timeoutMs} ms impartis.`);
    this.name = 'SmsTimeoutError';
  }
}

export class SmsNetworkError extends Error {
  constructor(originalMessage: string) {
    super(`Erreur réseau vers le provider SMS : ${originalMessage}`);
    this.name = 'SmsNetworkError';
  }
}

export class SmsHttpError extends Error {
  constructor(public readonly statusCode: number) {
    super(`Le provider SMS a répondu avec le code HTTP ${statusCode}`);
    this.name = 'SmsHttpError';
  }
}

export class SmsInvalidResponseError extends Error {
  constructor(received: unknown) {
    super(`Réponse invalide du provider SMS : ${JSON.stringify(received).slice(0, 200)}`);
    this.name = 'SmsInvalidResponseError';
  }
}

// ─── Constantes de configuration ──────────────────────────────────────────────

const E164_REGEX = /^\+[1-9]\d{6,14}$/;
const SMS_MAX_LENGTH = 1600;
const INVISIBLE_CHARS_REGEX = /^[\s\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u2000-\u200F\u202A-\u202F\u2060-\u2064\u206A-\u206F\u3000\u3164\uFEFF\uFFA0]+$/;

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1_000] as const;

// ─── Helpers purs ─────────────────────────────────────────────────────────────

function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return '****';
  const prefix = phone.slice(0, Math.min(4, phone.length - 4));
  const suffix = phone.slice(-4);
  return `${prefix}****${suffix}`;
}

function truncateMessage(message: string, maxLen = 100): string {
  if (message.length <= maxLen) return message;
  return `${message.slice(0, maxLen)}…[tronqué, ${message.length} chars total]`;
}

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error: unknown): boolean {
  if (error instanceof SmsTimeoutError) return true;
  if (error instanceof SmsNetworkError) return true;
  if (error instanceof SmsHttpError && error.statusCode === 503) return true;
  return false;
}

function classifyError(error: unknown): string {
  if (error instanceof SmsTimeoutError) return 'provider_timeout';
  if (error instanceof SmsNetworkError) return 'provider_network_error';
  if (error instanceof SmsInvalidResponseError) return 'provider_invalid_response';
  if (error instanceof SmsHttpError) {
    switch (error.statusCode) {
      case 401: return 'provider_auth_error';
      case 429: return 'provider_rate_limited';
      case 503: return 'provider_unavailable';
      default:  return 'provider_error';
    }
  }
  return 'provider_error';
}

function validateProviderResponse(response: unknown): asserts response is ProviderResponse {
  if (
    response === null ||
    response === undefined ||
    typeof response !== 'object' ||
    (!('messageId' in (response as object)) && !('status' in (response as object)))
  ) {
    throw new SmsInvalidResponseError(response);
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly timeoutMs: number;

  private readonly metrics: SmsMetrics = {
    totalSent: 0,
    totalFailed: 0,
    totalTimeout: 0,
    totalRetries: 0,
    callCount: 0,
    totalDurationMs: 0,
  };

  constructor(
    @Inject(SMS_PROVIDER_TOKEN) private readonly provider: ISmsProvider,
    private readonly configService: ConfigService,
  ) {
    this.timeoutMs = this.configService.get<number>('SMS_TIMEOUT_MS', 5000);
    this.logger.log(`SmsService initialisé avec le provider : ${this.provider.name}`);
  }

  getMetrics(): Readonly<SmsMetrics> {
    return { ...this.metrics };
  }

  async sendSms(to: string, message: string): Promise<SmsSendResult> {
    const providerName = this.provider.name;

    if (!to?.trim()) {
      this.logger.warn(`[SMS] Envoi ignoré : numéro de téléphone absent ou vide.`);
      return { sent: false, provider: providerName, skipped: true, reason: 'missing_phone_number' };
    }

    const trimmedPhone = to.trim();
    if (!E164_REGEX.test(trimmedPhone)) {
      this.logger.warn(`[SMS] Envoi ignoré : numéro invalide (non E.164) → ${maskPhone(trimmedPhone)}`);
      return { sent: false, provider: providerName, skipped: true, reason: 'phone_invalid' };
    }

    if (!message?.trim()) {
      this.logger.warn(`[SMS] Envoi ignoré : message vide pour ${maskPhone(trimmedPhone)}`);
      return { sent: false, provider: providerName, skipped: true, reason: 'empty_message' };
    }

    const trimmedMessage = message.trim();
    if (INVISIBLE_CHARS_REGEX.test(trimmedMessage)) {
      this.logger.warn(`[SMS] Envoi ignoré : message composé de caractères invisibles pour ${maskPhone(trimmedPhone)}`);
      return { sent: false, provider: providerName, skipped: true, reason: 'empty_message' };
    }

    if (trimmedMessage.length > SMS_MAX_LENGTH) {
      this.logger.warn(`[SMS] Envoi ignoré : message trop long pour ${maskPhone(trimmedPhone)}`);
      return { sent: false, provider: providerName, skipped: true, reason: 'message_too_long' };
    }

    return this.executeWithRetry(trimmedPhone, trimmedMessage);
  }

  private async executeWithRetry(phone: string, message: string): Promise<SmsSendResult> {
    const startTime = Date.now();
    const providerName = this.provider.name;
    let lastError: unknown;

    this.logger.log(
      `[SMS] Tentative d'envoi → destinataire=${maskPhone(phone)} | ` +
      `message="${truncateMessage(message)}" | provider=${providerName}`
    );

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const response = await this.callWithTimeout(phone, message);
        validateProviderResponse(response);

        const durationMs = Date.now() - startTime;
        this.recordSuccess(durationMs, attempt);

        this.logger.log(
          `[SMS] ✅ Envoi réussi → destinataire=${maskPhone(phone)} | ` +
          `provider=${providerName} | durée=${durationMs}ms | tentatives=${attempt}`
        );

        return { sent: true, provider: providerName, attempts: attempt, durationMs };

      } catch (error) {
        lastError = error;

        const durationMs = Date.now() - startTime;
        const reason = classifyError(error);
        const canRetry = isRetryable(error) && attempt < MAX_ATTEMPTS;

        if (error instanceof SmsTimeoutError) {
          this.metrics.totalTimeout++;
        }

        this.logger.error(
          `[SMS] ❌ Échec tentative ${attempt}/${MAX_ATTEMPTS} → ` +
          `destinataire=${maskPhone(phone)} | provider=${providerName} | ` +
          `raison=${reason} | durée=${durationMs}ms | retry=${canRetry}`,
          error instanceof Error ? error.stack : undefined,
        );

        if (!canRetry) break;

        const delayMs = RETRY_DELAYS_MS[attempt - 1];
        this.metrics.totalRetries++;

        this.logger.warn(
          `[SMS] ⏳ Retry ${attempt}/${MAX_ATTEMPTS - 1} dans ${delayMs}ms → ` +
          `destinataire=${maskPhone(phone)}`
        );

        await sleep(delayMs);
      }
    }

    const durationMs = Date.now() - startTime;
    const reason = classifyError(lastError);
    const attempts = MAX_ATTEMPTS;

    this.recordFailure(durationMs, reason);

    this.logger.error(
      `[SMS] 🚫 Toutes les tentatives épuisées → ` +
      `destinataire=${maskPhone(phone)} | provider=${providerName} | ` +
      `raison=${reason} | durée_totale=${durationMs}ms | tentatives=${attempts}`
    );

    return { sent: false, provider: providerName, reason, attempts, durationMs };
  }

  private callWithTimeout(phone: string, message: string): Promise<ProviderResponse> {
    const controller = new AbortController();
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => {
        controller.abort();
        reject(new SmsTimeoutError(this.timeoutMs));
      }, this.timeoutMs),
    );

    return Promise.race([
      this.provider.send(phone, message, controller.signal),
      timeoutPromise,
    ]);
  }

  private recordSuccess(durationMs: number, attempts: number): void {
    this.metrics.totalSent++;
    this.metrics.callCount++;
    this.metrics.totalDurationMs += durationMs;

    this.logger.log(
      `[SMS][METRICS] sent=1 failed=0 provider=${this.provider.name} durationMs=${durationMs} attempts=${attempts} ` +
      `totalSent=${this.metrics.totalSent} totalFailed=${this.metrics.totalFailed} ` +
      `avgDurationMs=${Math.round(this.metrics.totalDurationMs / this.metrics.callCount)}`
    );
  }

  private recordFailure(durationMs: number, reason: string): void {
    this.metrics.totalFailed++;
    this.metrics.callCount++;
    this.metrics.totalDurationMs += durationMs;

    this.logger.error(
      `[SMS][METRICS] sent=0 failed=1 provider=${this.provider.name} durationMs=${durationMs} reason=${reason} ` +
      `totalSent=${this.metrics.totalSent} totalFailed=${this.metrics.totalFailed} ` +
      `totalTimeout=${this.metrics.totalTimeout} totalRetries=${this.metrics.totalRetries} ` +
      `avgDurationMs=${Math.round(this.metrics.totalDurationMs / this.metrics.callCount)}`
    );
  }
}
