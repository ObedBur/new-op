import { FastifyRequest } from 'fastify';
export interface AuthenticatedRequest extends FastifyRequest {
    user: {
        id: string;
        sub?: string;
        email: string;
        role: string;
        kycStatus: string;
    };
}
export interface RtAuthenticatedRequest extends AuthenticatedRequest {
    user: AuthenticatedRequest['user'] & {
        refreshToken: string;
    };
}
