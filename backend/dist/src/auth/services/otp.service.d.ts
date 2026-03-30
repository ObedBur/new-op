import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../common/email/email.service';
export declare class OtpService {
    private readonly prisma;
    private readonly emailService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService);
    generateAndSend(userId: string, email: string): Promise<string>;
    verify(email: string, otp: string): Promise<boolean>;
    clearOtp(userId: string): Promise<void>;
    private incrementAttempts;
    private generateOtp;
}
