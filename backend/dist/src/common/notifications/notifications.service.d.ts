import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
export declare class NotificationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type: NotificationType;
        metadata?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    markAsRead(notificationId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    getUserNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
}
