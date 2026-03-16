export type UserRole = 'ADMIN' | 'CLIENT' | 'VENDOR';
export type KycStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'NONE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  boutiqueName?: string;
  kycStatus: KycStatus;
  isVerified: boolean;
  trustScore: number;
  province?: string;
  commune?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  province: string;
  commune: string;
  role: 'CLIENT' | 'VENDOR';
  city?: string;
  country?: string;
  address?: string;
  boutiqueName?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  requiresKyc: boolean;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface ResendOtpDto {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

