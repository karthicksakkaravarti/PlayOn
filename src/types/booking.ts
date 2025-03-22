import { TimeSlot } from './venue';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  CANCELLED_BY_USER = 'cancelled_by_user',
  CANCELLED_BY_VENUE = 'cancelled_by_venue',
  CANCELLED_BY_ADMIN = 'cancelled_by_admin',
  REJECTED = 'rejected',
  FAILED = 'failed'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  PARTIALLY_REFUNDED = 'partially_refunded',
  FULLY_REFUNDED = 'fully_refunded',
  FAILED = 'failed'
}

export interface Booking {
  id: string;
  venueId: string;
  userId: string;
  date: string; // Format: "YYYY-MM-DD"
  startTime: string; // Format: "HH:MM" in 24h
  endTime: string; // Format: "HH:MM" in 24h
  duration: number; // In minutes
  totalPlayers: number;
  bookingType: 'full_venue' | 'partial_venue';
  courtNumber?: string; // For partial venue bookings
  notes?: string;
  status: BookingStatus;
  paymentId: string; // Reference to payment
  paymentStatus: PaymentStatus;
  price: {
    baseAmount: number;
    taxes: number;
    fees: number;
    discounts: number;
    totalAmount: number;
    currency: string;
  };
  cancellationReason?: string;
  cancellationTime?: number;
  refundAmount?: number;
  createdAt: number;
  updatedAt: number;
  checkInTime?: number;
  checkOutTime?: number;
  bookingCode: string; // Unique code for venue check-in
  isRecurring: boolean;
  recurringDetails?: RecurringBookingDetails;
}

export interface RecurringBookingDetails {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // Every X days/weeks/months
  endDate: string; // Format: "YYYY-MM-DD"
  excludeDates?: string[]; // Dates to exclude
  childBookingIds: string[]; // IDs of all bookings in this recurring series
  parentBookingId: string; // ID of the parent booking that created this recurring series
}

export interface BookingSlot {
  date: string; // Format: "YYYY-MM-DD"
  timeSlot: TimeSlot;
  isAvailable: boolean;
  price: number;
  isSpecialPrice: boolean;
  bookedBy?: string; // User ID if booked
}

export interface BookingRequest {
  venueId: string;
  userId: string;
  date: string; // Format: "YYYY-MM-DD"
  startTime: string; // Format: "HH:MM" in 24h
  endTime: string; // Format: "HH:MM" in 24h
  totalPlayers: number;
  bookingType: 'full_venue' | 'partial_venue';
  courtNumber?: string; // For partial venue bookings
  notes?: string;
  isRecurring: boolean;
  recurringDetails?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number; // Every X days/weeks/months
    endDate: string; // Format: "YYYY-MM-DD"
    excludeDates?: string[]; // Dates to exclude
  };
} 