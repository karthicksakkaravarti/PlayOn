import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

// Auth Navigator
export type AuthStackParamList = {
  PhoneEntry: undefined;
  OTPVerification: { phoneNumber: string };
  UserInfo: { phoneNumber: string; uid: string };
};

// User Navigator
export type UserTabParamList = {
  Home: undefined;
  Explore: undefined;
  Bookings: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type UserStackParamList = {
  Main: NavigatorScreenParams<UserTabParamList>;
  VenueDetail: { venueId: string };
  Booking: { venueId: string; date: string };
  Payment: { bookingId: string; amount: number };
  BookingConfirm: { bookingId: string };
  BookingDetail: { bookingId: string };
  ReviewForm: { venueId: string; bookingId: string };
};

// Venue Owner Navigator
export type VenueOwnerTabParamList = {
  Venues: undefined;
  Bookings: undefined;
  Earnings: undefined;
  Profile: undefined;
};

export type VenueOwnerStackParamList = {
  Main: NavigatorScreenParams<VenueOwnerTabParamList>;
  AddVenue: undefined;
  EditVenue: { venueId: string };
  VenueDetail: { venueId: string };
  Availability: { venueId: string };
  BookingDetail: { bookingId: string };
};

// Admin Navigator
export type AdminTabParamList = {
  Dashboard: undefined;
  Venues: undefined;
  Bookings: undefined;
  Policies: undefined;
  Profile: undefined;
};

export type AdminStackParamList = {
  Main: NavigatorScreenParams<AdminTabParamList>;
  VenueDetail: { venueId: string };
  BookingDetail: { bookingId: string };
  CommissionSettings: undefined;
  CancellationPolicies: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  User: NavigatorScreenParams<UserStackParamList>;
  VenueOwner: NavigatorScreenParams<VenueOwnerStackParamList>;
  Admin: NavigatorScreenParams<AdminStackParamList>;
};

// Utility types for screen props
export type AuthScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<
  AuthStackParamList,
  T
>;

export type UserScreenProps<T extends keyof UserStackParamList> = StackScreenProps<
  UserStackParamList,
  T
>;

export type VenueOwnerScreenProps<T extends keyof VenueOwnerStackParamList> = StackScreenProps<
  VenueOwnerStackParamList,
  T
>;

export type AdminScreenProps<T extends keyof AdminStackParamList> = StackScreenProps<
  AdminStackParamList,
  T
>;

export type RootScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

// Navigation global type declaration
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 