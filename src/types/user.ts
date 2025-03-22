import { UserRole } from './auth';

export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: Address;
  favoriteVenues: string[]; // Array of venue IDs
  createdAt: number;
  updatedAt: number;
  role: UserRole;
  deviceToken?: string; // For push notifications
  lastLoginAt?: number;
  isActive: boolean;
  preferences?: UserPreferences;
}

export interface Address {
  street?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  preferredSports?: string[]; // Sports categories user is interested in
  preferredRadius?: number; // Preferred search radius in km
  preferredPaymentMethod?: string;
  language?: string;
}

export interface VenueOwner extends User {
  businessName?: string;
  businessAddress?: Address;
  taxIdentificationNumber?: string;
  bankDetails?: BankDetails;
  venues: string[]; // Array of venue IDs owned by this user
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string; // For India
  swiftCode?: string; // For international transfers
  upiId?: string; // For UPI payments
}

export interface Admin extends User {
  adminLevel: 'super' | 'support' | 'content';
  permissions: string[]; // Array of permission codes
  lastActivityAt: number;
} 