import { ConfigService } from '@nestjs/config';
import { MockSmsProvider } from './providers/mock.provider';
import { TwilioSmsProvider } from './providers/twilio.provider';
import { AfricastalkingSmsProvider } from './providers/africastalking.provider';
import { ISmsProvider } from './interfaces/sms-provider.interface';
import { SMS_PROVIDER_TOKEN } from './constants/sms.constants';

export const smsProviderFactory = {
  provide: SMS_PROVIDER_TOKEN,
  useFactory: (
    configService: ConfigService,
    mock: MockSmsProvider,
    twilio: TwilioSmsProvider,
    africastalking: AfricastalkingSmsProvider,
  ): ISmsProvider => {
    // On lit le .env (par défaut 'mock')
    const providerName = configService.get<string>('SMS_PROVIDER', 'mock').toLowerCase();

    switch (providerName) {
      case 'twilio':
        return twilio;
      case 'africastalking':
        return africastalking;
      case 'mock':
      default:
        return mock;
    }
  },
  inject: [
    ConfigService,
    MockSmsProvider,
    TwilioSmsProvider,
    AfricastalkingSmsProvider,
  ],
};
