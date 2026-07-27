import { Injectable } from '@nestjs/common';
import {
  ISmsProvider,
  ProviderResponse,
} from '../interfaces/sms-provider.interface';

@Injectable()
export class TwilioSmsProvider implements ISmsProvider {
  public readonly name = 'twilio';

  async send(phone: string, message: string): Promise<ProviderResponse> {
    // TODO: Implémenter le SDK Twilio ici
    // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // const res = await client.messages.create({ ... });

    throw new Error('Twilio provider not yet implemented.');
  }
}
