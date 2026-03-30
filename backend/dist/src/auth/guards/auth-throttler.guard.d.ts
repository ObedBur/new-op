import { ThrottlerGuard } from '@nestjs/throttler';
export declare class AuthThrottlerGuard extends ThrottlerGuard {
    protected getTracker(req: Record<string, any>): Promise<string>;
}
