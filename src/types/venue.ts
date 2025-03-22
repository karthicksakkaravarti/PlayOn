import { Address } from './user';

export enum VenueStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INACTIVE = 'inactive'
}

export enum VenueType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
  MIXED = 'mixed'
}

export interface Venue {
  id: string;
  name: string;
  ownerId: string; // User ID of the venue owner
  description: string;
  images: string[]; // Array of image URLs
  primaryImage: string; // Main display image URL
  sports: Sport[]; // Types of sports available
  amenities: Amenity[]; // Available amenities
  rules: string[]; // Venue rules
  venueTiming: VenueTiming;
  address: Address;
  pricing: VenuePricing;
  ratings: {
    average: number;
    count: number;
  };
  status: VenueStatus;
  type: VenueType; // Indoor, Outdoor, etc.
  size: {
    width?: number;
    length?: number;
    unit: 'meters' | 'feet';
  };
  capacity: number; // Maximum number of people
  availabilityExceptions: AvailabilityException[]; // Special availability changes
  cancellationPolicy: CancellationPolicy;
  createdAt: number;
  updatedAt: number;
  featured: boolean;
  isVerified: boolean;
}

export interface Sport {
  id: string;
  name: string;
  icon?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export interface VenueTiming {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface DayAvailability {
  isOpen: boolean;
  openTime?: string; // Format: "HH:MM" in 24h
  closeTime?: string; // Format: "HH:MM" in 24h
  slots?: TimeSlot[]; // Optional time slots if venue has specific booking slots
}

export interface TimeSlot {
  id: string;
  startTime: string; // Format: "HH:MM" in 24h
  endTime: string; // Format: "HH:MM" in 24h
  priceMultiplier?: number; // Optional price multiplier for premium slots
}

export interface VenuePricing {
  basePrice: number; // Base price per hour
  currency: string; // Currency code (e.g., "INR", "USD")
  discounts?: {
    weekday?: number; // Percentage discount for weekdays
    offPeak?: number; // Percentage discount for off-peak hours
    longTerm?: number; // Percentage discount for bookings > 2 hours
  };
  premiumRate?: {
    weekend?: number; // Percentage increase for weekends
    holiday?: number; // Percentage increase for holidays
    peakHours?: number; // Percentage increase for peak hours
  };
  cleaningFee?: number;
  depositAmount?: number;
}

export interface AvailabilityException {
  id: string;
  date: string; // Format: "YYYY-MM-DD"
  isAvailable: boolean;
  reason?: string;
  slots?: TimeSlot[];
}

export interface CancellationPolicy {
  type: 'flexible' | 'moderate' | 'strict';
  fullRefundHoursBeforeBooking: number;
  partialRefundHoursBeforeBooking: number;
  partialRefundPercentage: number;
} 