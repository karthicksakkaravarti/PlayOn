/**
 * Navigation Types for PlayOn App
 * This file contains type definitions for all navigation-related types
 */

// Auth Navigator Param List
export type AuthStackParamList = {
  PhoneEntry: undefined;
  OTPVerification: { phoneNumber: string, verificationId: string };
  ProfileSetup: { phoneNumber: string };
};

// User Navigator Param List (Tab Navigation)
export type UserTabParamList = {
  Home: undefined;
  Explore: undefined;
  Bookings: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// User Stack Param List
export type UserStackParamList = {
  Tabs: undefined;
  VenueDetails: { venueId: string };
  BookingConfirmation: { bookingId: string };
  EditProfile: undefined;
  Settings: undefined;
};

// Venue Owner Navigator Param List
export type VenueOwnerStackParamList = {
  Dashboard: undefined;
  ManageVenues: undefined;
  VenueDetails: { venueId: string };
  AddVenue: undefined;
  EditVenue: { venueId: string };
  Bookings: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Admin Navigator Param List
export type AdminStackParamList = {
  Dashboard: undefined;
  ManageUsers: undefined;
  ManageVenues: undefined;
  UserDetails: { userId: string };
  VenueDetails: { venueId: string };
  Settings: undefined;
};

// Root Stack Param List
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  User: undefined;
  VenueOwner: undefined;
  Admin: undefined;
}; 