import { User } from '../../types';
import { simulateNetworkDelay } from '../api/apiClient';
import { storage } from '../storage/storage';
import { secureStorage } from '../storage/secureStorage';

const USER_SESSION_KEY = 'user_session';
const AUTH_TOKEN_KEY = 'auth_bearer_token';

export const defaultMockUser: User = {
  id: 'user_current',
  fullName: 'Rahul Kulkarni',
  phoneNumber: '+91 98765 43210',
  email: 'rahul.kulkarni@example.com',
  city: 'Pune',
  accountStatus: 'active',
  hasFriendProfile: false,
  createdAt: '2026-09-01T10:00:00Z',
  updatedAt: '2026-10-15T12:00:00Z',
};

class AuthService {
  private currentUser: User | null = defaultMockUser;
  private pendingOtpPhone: string | null = null;
  private mockOtpCode = '123456';

  async sendOtp(phone: string): Promise<{ success: boolean; message: string; isDevMock: boolean; devOtpHint?: string }> {
    await simulateNetworkDelay(400);
    this.pendingOtpPhone = phone;
    return {
      success: true,
      message: 'Demo OTP generated (Prototype Mode: Enter 123456)',
      isDevMock: true,
      devOtpHint: '123456',
    };
  }

  async verifyOtp(otp: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await simulateNetworkDelay(500);
    if (otp !== this.mockOtpCode && otp !== '000000') {
      return { success: false, error: 'Invalid verification code. Please enter 123456.' };
    }

    const user: User = this.currentUser || {
      ...defaultMockUser,
      phoneNumber: this.pendingOtpPhone || defaultMockUser.phoneNumber,
    };

    this.currentUser = user;
    await secureStorage.setSecureItem(AUTH_TOKEN_KEY, 'mock_jwt_token_rentafriend_session');
    await storage.setItem(USER_SESSION_KEY, JSON.stringify(user));

    return { success: true, user };
  }

  async signUp(data: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    city: string;
  }): Promise<{ success: boolean; user: User }> {
    await simulateNetworkDelay(600);

    const newUser: User = {
      id: `user_${Date.now()}`,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      city: data.city,
      accountStatus: 'active',
      hasFriendProfile: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.currentUser = newUser;
    await secureStorage.setSecureItem(AUTH_TOKEN_KEY, 'mock_jwt_token_rentafriend_session');
    await storage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser };
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;
    const stored = await storage.getItem(USER_SESSION_KEY);
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    return defaultMockUser;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    await simulateNetworkDelay(300);
    if (!this.currentUser) {
      this.currentUser = defaultMockUser;
    }
    this.currentUser = { ...this.currentUser, ...updates, updatedAt: new Date().toISOString() };
    await storage.setItem(USER_SESSION_KEY, JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    await secureStorage.removeSecureItem(AUTH_TOKEN_KEY);
    await storage.removeItem(USER_SESSION_KEY);
  }
}

export const authService = new AuthService();
