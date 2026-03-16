import { api, setAccessToken } from '@/lib/axios';
import { storage } from '@/utils/storage';
import { LoginDto, RegisterDto, AuthResponse, User, RegisterResponse, VerifyOtpDto, VerifyOtpResponse, ResendOtpDto, ResendOtpResponse, ForgotPasswordDto, ForgotPasswordResponse, ResetPasswordDto, ResetPasswordResponse } from '@/types/auth';

export const authService = {
  async register(data: RegisterDto): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    this.handleAuthResponse(response.data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = storage.getRefreshToken();
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setAccessToken(null);
      storage.removeRefreshToken();
    }
  },

  async getProfile(): Promise<User> {
    const response = await api.get<{ success: boolean; user: User }>('/auth/profile');
    return response.data.user;
  },

  handleAuthResponse(data: AuthResponse) {
    setAccessToken(data.access_token);
    storage.setRefreshToken(data.refresh_token);
  },

  /**
   * Tente de restaurer la session au chargement.
   * On délègue la logique de refresh à l'intercepteur Axios
   * en appelant simplement /auth/profile via l'instance 'api'.
   */
  async initAuth(): Promise<User | null> {
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) return null;

    try {
      // Si l'access_token est absent (F5), cet appel provoquera une 401.
      // L'intercepteur de lib/axios.ts prendra le relais pour refresh
      // et rejouera cet appel automatiquement.
      const response = await api.get<{ success: boolean; user: User }>('/auth/profile');
      return response.data.user;
    } catch (error) {
      console.error('Failed to init auth session:', error);
      // On ne vide le storage ici que si l'erreur n'est pas déjà gérée par l'intercepteur
      return null;
    }
  },

  async verifyOtp(data: VerifyOtpDto): Promise<VerifyOtpResponse> {
    const response = await api.post<VerifyOtpResponse>('/auth/verify-otp', data);
    return response.data;
  },

  async resendOtp(data: ResendOtpDto): Promise<ResendOtpResponse> {
    const response = await api.post<ResendOtpResponse>('/auth/resend-otp', data);
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordDto): Promise<ResetPasswordResponse> {
    const response = await api.post<ResetPasswordResponse>('/auth/reset-password', data);
    return response.data;
  }
};