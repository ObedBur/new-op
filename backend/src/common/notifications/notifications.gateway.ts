import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../../auth/types/token.types';

function getJwtSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('[SECURITY] JWT_ACCESS_SECRET or JWT_SECRET is not defined in production');
  }
  return secret || 'dev_jwt_secret_wapibei_2026';
}

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  private server?: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.getToken(client);
      if (!token) {
        client.disconnect(true);
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: getJwtSecret(),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, isVerified: true },
      });

      if (!user || !user.isVerified) {
        client.disconnect(true);
        return;
      }

      client.data.userId = user.id;
      await client.join(this.userRoom(user.id));
      client.emit('notifications:ready', { userId: user.id });
    } catch (error) {
      this.logger.warn(`Notification socket rejected: ${error instanceof Error ? error.message : error}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data?.userId) {
      this.logger.debug(`Notification socket disconnected for user ${client.data.userId}`);
    }
  }

  emitToUser<TPayload>(userId: string, event: string, payload: TPayload) {
    this.server?.to(this.userRoom(userId)).emit(event, payload);
  }

  private getToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.trim()) {
      return authToken.trim();
    }

    const header = client.handshake.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice('Bearer '.length).trim();
    }

    return null;
  }

  private userRoom(userId: string) {
    return `user:${userId}`;
  }
}
