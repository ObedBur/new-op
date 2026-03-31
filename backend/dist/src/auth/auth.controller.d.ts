import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { JwtRequest, RefreshRequest } from './types/auth-request.types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        requiresKyc: boolean;
    }>;
    login(loginDto: LoginDto): Promise<{
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
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resendOtp(email: string): Promise<{
        success: boolean;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        success: boolean;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    logout(req: JwtRequest, refreshToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
    logoutAll(req: JwtRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshTokens(req: RefreshRequest): Promise<import("./types/token.types").TokenPair>;
    getProfile(req: JwtRequest): Promise<{
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
            avatarUrl: string;
        };
    }>;
    updateProfile(req: JwtRequest, dto: any): Promise<{
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
            updatedAt: Date;
            avatarUrl: string;
        };
    }>;
    nothing(): Promise<void>;
    patchProfile(req: JwtRequest, dto: any): Promise<{
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
            updatedAt: Date;
            avatarUrl: string;
        };
    }>;
    getTestUsers(): Promise<{
        success: boolean;
        message: string;
        count?: undefined;
        users?: undefined;
    } | {
        success: boolean;
        count: number;
        users: {
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
        }[];
        message?: undefined;
    }>;
    clearTestUsers(): Promise<{
        success: boolean;
        message: string;
        timestamp?: undefined;
    } | {
        success: boolean;
        message: string;
        timestamp: string;
    }>;
}
