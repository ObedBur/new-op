import { Injectable, Logger } from '@nestjs/common';
import {
  ISmsProvider,
  ProviderResponse,
} from '../interfaces/sms-provider.interface';

@Injectable()
export class MockSmsProvider implements ISmsProvider {
  private readonly logger = new Logger(MockSmsProvider.name);
  public readonly name = 'mock';

  async send(phone: string, message: string): Promise<ProviderResponse> {
    this.logger.log(`[Mock] Simulation d'envoi vers ${phone}...`);
    await new Promise<void>((resolve) => setTimeout(resolve, 500));

    return {
      messageId: `mock-${Date.now()}`,
      status: 'queued',
    };
  }
}
