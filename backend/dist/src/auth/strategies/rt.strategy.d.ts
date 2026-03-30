import { Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { JwtPayload } from '../types/token.types';
import { RefreshTokenPayload } from '../types/auth-request.types';
declare const RtStrategy_base: new (...args: any[]) => Strategy;
export declare class RtStrategy extends RtStrategy_base {
    constructor();
    validate(req: FastifyRequest, payload: JwtPayload): RefreshTokenPayload | null;
}
export {};
