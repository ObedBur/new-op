import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
  /**
   * Personnalise la cl de limitation (Rate Limit) pour inclure l'IP et l'email.
   * Cela empche une personne de tester plusieurs emails depuis une IP, 
   * ou de tester un seul email depuis plusieurs IPs.
   */
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const ip = req.ip;
    const email = req.body?.email || 'no-email';
    
    // Gnre une cl unique base sur l'IP et l'email
    return `${ip}-${email}`;
  }
}

