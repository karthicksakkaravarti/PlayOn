export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  createdAt: number;
  updatedAt: number;
  role: UserRole;
}

export enum UserRole {
  USER = 'user',
  VENUE_OWNER = 'venue_owner',
  ADMIN = 'admin'
}

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface AuthContextType extends AuthState {
  login: (phoneNumber: string) => Promise<string>;
  verifyOTP: (verificationId: string, otp: string) => Promise<User>;
  updateUserProfile: (userData: Partial<User>) => Promise<User>;
  logout: () => Promise<void>;
  resetError: () => void;
} 