import { ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../types/auth-request.types';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest<TUser = AuthenticatedUser>(err: Error | null, user: TUser, info: unknown): TUser;
}
export {};
