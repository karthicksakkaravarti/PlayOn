/**
 * Auth Types for PlayOn App
 * This file contains type definitions for all authentication-related types
 */

// User Roles
export enum UserRole {
  USER = 'user',
  VENUE_OWNER = 'venue_owner',
  ADMIN = 'admin'
}

// User model
export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  profileImage?: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}

// Auth State
export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

// Auth Context Type
export interface AuthContextType extends AuthState {
  login: (phoneNumber: string) => Promise<string>;
  verifyOTP: (verificationId: string, otp: string) => Promise<User>;
  updateUserProfile: (userData: Partial<User>) => Promise<User>;
  logout: () => Promise<void>;
  resetError: () => void;
} 