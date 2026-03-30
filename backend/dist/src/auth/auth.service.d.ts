import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../common/email/email.service';
import { TokenService } from './services/token.service';
import { OtpService } from './services/otp.service';
import { PasswordService } from './services/password.service';
import { UserValidationService } from './services/user-validation.service';
export declare class AuthService {
    private readonly prisma;
    private readonly tokenService;
    private readonly otpService;
    private readonly passwordService;
    private readonly userValidationService;
    private readonly emailService;
    private readonly logger;
    constructor(prisma: PrismaService, tokenService: TokenService, otpService: OtpService, passwordService: PasswordService, userValidationService: UserValidationService, emailService: EmailService);
    register(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        requiresKyc: boolean;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
            trustScore: number;
            city: string;
            country: string;
        };
        access_token: string;
        refresh_token: string;
        success: boolean;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        success: boolean;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    logout(userId: string, refreshToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
    logoutAll(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<import("./types/token.types").TokenPair>;
    getUserProfile(userId: string): Promise<{
        success: boolean;
        user: {
            email: string;
            fullName: string;
            phone: string;
            province: string;
            commune: string;
            city: string;
            country: string;
            address: string;
            boutiqueName: string;
            role: import("@prisma/client").$Enums.UserRole;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            id: string;
            isVerified: boolean;
            trustScore: number;
            createdAt: Date;
        };
    }>;
    resendOtp(email: string): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    getUsersForTesting(): Promise<{
        email: string;
        fullName: string;
        phone: string;
        province: string;
        commune: string;
        city: string;
        country: string;
        boutiqueName: string;
        role: import("@prisma/client").$Enums.UserRole;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        id: string;
        isVerified: boolean;
        trustScore: number;
        createdAt: Date;
    }[]>;
    clearUsersForTesting(): Promise<void>;
}
