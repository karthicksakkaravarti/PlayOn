import { FirestoreAPI } from './api';
import { Booking, BookingStatus, PaymentStatus, BookingRequest, RecurringBookingDetails } from '../types/booking';
import { VenueService } from './venues';
import { where, orderBy, limit, query } from 'firebase/firestore';

/**
 * Service for booking-related operations
 */
export class BookingService {
  private static readonly COLLECTION = 'bookings';

  /**
   * Create a new booking
   * @param bookingData - The booking data
   * @returns A promise that resolves to the created booking
   */
  static async createBooking(bookingData: BookingRequest): Promise<Booking> {
    try {
      // Generate booking code (6 character alphanumeric)
      const bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Create booking object
      const booking: Omit<Booking, 'id'> = {
        venueId: bookingData.venueId,
        userId: bookingData.userId,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        duration: this.calculateDuration(bookingData.startTime, bookingData.endTime),
        totalPlayers: bookingData.totalPlayers,
        bookingType: bookingData.bookingType,
        courtNumber: bookingData.courtNumber,
        notes: bookingData.notes,
        status: BookingStatus.PENDING,
        paymentId: '', // Will be set after payment
        paymentStatus: PaymentStatus.PENDING,
        price: {
          baseAmount: 0, // Will be calculated
          taxes: 0,
          fees: 0,
          discounts: 0,
          totalAmount: 0,
          currency: 'INR' // Default currency
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
        bookingCode,
        isRecurring: bookingData.isRecurring,
        recurringDetails: bookingData.isRecurring && bookingData.recurringDetails 
          ? {
              frequency: bookingData.recurringDetails.frequency,
              interval: bookingData.recurringDetails.interval,
              endDate: bookingData.recurringDetails.endDate,
              excludeDates: bookingData.recurringDetails.excludeDates || [],
              childBookingIds: [],
              parentBookingId: '' // Will be set for child bookings
            }
          : undefined
      };
      
      // Create document
      const docRef = await FirestoreAPI.create(this.COLLECTION, booking);
      const createdBooking = { ...booking, id: docRef.id };
      
      // If this is a recurring booking, create child bookings
      if (createdBooking.isRecurring && createdBooking.recurringDetails) {
        await this.createRecurringBookings(createdBooking);
      }
      
      return createdBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  /**
   * Create child bookings for a recurring booking
   * @param parentBooking - The parent booking
   * @returns A promise that resolves when child bookings are created
   */
  private static async createRecurringBookings(parentBooking: Booking): Promise<void> {
    if (!parentBooking.recurringDetails) {
      return;
    }
    
    const { frequency, interval, endDate, excludeDates = [] } = parentBooking.recurringDetails;
    const childBookingIds: string[] = [];
    
    // Parse dates
    const startDate = new Date(parentBooking.date);
    const end = new Date(endDate);
    
    // Calculate dates for recurring bookings
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + interval); // Start with next interval
    
    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Skip excluded dates
      if (!excludeDates.includes(dateString)) {
        dates.push(new Date(currentDate));
      }
      
      // Increment date based on frequency
      switch (frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + interval);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + (7 * interval));
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + interval);
          break;
      }
    }
    
    // Create child bookings
    for (const date of dates) {
      const dateString = date.toISOString().split('T')[0];
      
      // Create child booking
      const childBooking: Omit<Booking, 'id'> = {
        ...parentBooking,
        date: dateString,
        recurringDetails: {
          ...parentBooking.recurringDetails,
          parentBookingId: parentBooking.id
        },
        bookingCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      try {
        const docRef = await FirestoreAPI.create(this.COLLECTION, childBooking);
        childBookingIds.push(docRef.id);
      } catch (error) {
        console.error(`Error creating child booking for date ${dateString}:`, error);
        // Continue with other bookings even if one fails
      }
    }
    
    // Update parent booking with child IDs
    if (childBookingIds.length > 0) {
      await this.updateBooking(parentBooking.id, {
        recurringDetails: {
          ...parentBooking.recurringDetails,
          childBookingIds
        }
      });
    }
  }

  /**
   * Calculate duration in minutes
   */
  private static calculateDuration(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return endMinutes - startMinutes;
  }

  /**
   * Get a booking by ID
   * @param bookingId - The booking ID
   * @returns A promise that resolves to the booking or null if not found
   */
  static async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      return await FirestoreAPI.getById<Booking>(this.COLLECTION, bookingId);
    } catch (error) {
      console.error('Error getting booking by ID:', error);
      throw error;
    }
  }

  /**
   * Get a booking by booking code
   * @param bookingCode - The booking code
   * @returns A promise that resolves to the booking or null if not found
   */
  static async getBookingByCode(bookingCode: string): Promise<Booking | null> {
    try {
      const bookings = await FirestoreAPI.query<Booking>(
        this.COLLECTION,
        [where('bookingCode', '==', bookingCode)]
      );
      
      return bookings.length > 0 ? bookings[0] : null;
    } catch (error) {
      console.error('Error getting booking by code:', error);
      throw error;
    }
  }

  /**
   * Update a booking
   * @param bookingId - The booking ID
   * @param bookingData - The booking data to update
   * @returns A promise that resolves to the updated booking
   */
  static async updateBooking(bookingId: string, bookingData: Partial<Booking>): Promise<Booking> {
    try {
      // Include updatedAt timestamp
      const updates = {
        ...bookingData,
        updatedAt: Date.now()
      };
      
      await FirestoreAPI.update(this.COLLECTION, bookingId, updates);
      const updatedBooking = await this.getBookingById(bookingId);
      
      if (!updatedBooking) {
        throw new Error('Booking not found after update');
      }
      
      return updatedBooking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  /**
   * Update booking status
   * @param bookingId - The booking ID
   * @param status - The new status
   * @returns A promise that resolves to the updated booking
   */
  static async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    try {
      return await this.updateBooking(bookingId, { status });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  /**
   * Update payment status
   * @param bookingId - The booking ID
   * @param paymentStatus - The new payment status
   * @param paymentId - The payment ID
   * @returns A promise that resolves to the updated booking
   */
  static async updatePaymentStatus(
    bookingId: string, 
    paymentStatus: PaymentStatus,
    paymentId?: string
  ): Promise<Booking> {
    try {
      const updates: Partial<Booking> = { paymentStatus };
      
      if (paymentId) {
        updates.paymentId = paymentId;
      }
      
      return await this.updateBooking(bookingId, updates);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  /**
   * Cancel a booking
   * @param bookingId - The booking ID
   * @param reason - The cancellation reason
   * @param cancelledBy - Who cancelled the booking (user, venue, admin)
   * @returns A promise that resolves to the updated booking
   */
  static async cancelBooking(
    bookingId: string, 
    reason: string,
    cancelledBy: 'user' | 'venue' | 'admin'
  ): Promise<Booking> {
    try {
      let status: BookingStatus;
      
      switch (cancelledBy) {
        case 'user':
          status = BookingStatus.CANCELLED_BY_USER;
          break;
        case 'venue':
          status = BookingStatus.CANCELLED_BY_VENUE;
          break;
        case 'admin':
          status = BookingStatus.CANCELLED_BY_ADMIN;
          break;
        default:
          status = BookingStatus.CANCELLED_BY_USER;
      }
      
      return await this.updateBooking(bookingId, {
        status,
        cancellationReason: reason,
        cancellationTime: Date.now()
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Record check-in for a booking
   * @param bookingId - The booking ID
   * @returns A promise that resolves to the updated booking
   */
  static async checkIn(bookingId: string): Promise<Booking> {
    try {
      return await this.updateBooking(bookingId, {
        status: BookingStatus.CHECKED_IN,
        checkInTime: Date.now()
      });
    } catch (error) {
      console.error('Error checking in booking:', error);
      throw error;
    }
  }

  /**
   * Record check-out for a booking
   * @param bookingId - The booking ID
   * @returns A promise that resolves to the updated booking
   */
  static async checkOut(bookingId: string): Promise<Booking> {
    try {
      return await this.updateBooking(bookingId, {
        status: BookingStatus.COMPLETED,
        checkOutTime: Date.now()
      });
    } catch (error) {
      console.error('Error checking out booking:', error);
      throw error;
    }
  }

  /**
   * Get user's bookings
   * @param userId - The user ID
   * @param status - Optional status filter
   * @param maxItems - Maximum number of bookings to return
   * @returns A promise that resolves to an array of bookings
   */
  static async getUserBookings(
    userId: string, 
    status?: BookingStatus,
    maxItems: number = 20
  ): Promise<Booking[]> {
    try {
      const constraints = [
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        orderBy('startTime', 'desc'),
        limit(maxItems)
      ];
      
      if (status) {
        constraints.unshift(where('status', '==', status));
      }
      
      return await FirestoreAPI.query<Booking>(this.COLLECTION, constraints);
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  }

  /**
   * Get venue's bookings
   * @param venueId - The venue ID
   * @param status - Optional status filter
   * @param date - Optional date filter
   * @param maxItems - Maximum number of bookings to return
   * @returns A promise that resolves to an array of bookings
   */
  static async getVenueBookings(
    venueId: string, 
    status?: BookingStatus,
    date?: string,
    maxItems: number = 20
  ): Promise<Booking[]> {
    try {
      const constraints = [
        where('venueId', '==', venueId),
        orderBy('date', 'asc'),
        orderBy('startTime', 'asc'),
        limit(maxItems)
      ];
      
      if (status) {
        constraints.unshift(where('status', '==', status));
      }
      
      if (date) {
        constraints.unshift(where('date', '==', date));
      }
      
      return await FirestoreAPI.query<Booking>(this.COLLECTION, constraints);
    } catch (error) {
      console.error('Error getting venue bookings:', error);
      throw error;
    }
  }

  /**
   * Check if a venue is available for a given time slot
   * @param venueId - The venue ID
   * @param date - The date
   * @param startTime - The start time
   * @param endTime - The end time
   * @returns A promise that resolves to true if the venue is available
   */
  static async checkVenueAvailability(
    venueId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    try {
      // Check venue first
      const venue = await VenueService.getVenueById(venueId);
      
      if (!venue) {
        throw new Error('Venue not found');
      }
      
      // Check venue availability exceptions
      const exception = venue.availabilityExceptions.find(ex => ex.date === date);
      if (exception && !exception.isAvailable) {
        return false; // Venue is explicitly unavailable on this date
      }
      
      // Check day of week availability
      const dateObj = new Date(date);
      const days = [
        'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
      ] as const;
      const dayOfWeek = days[dateObj.getDay()];
      
      const dayAvailability = venue.venueTiming[dayOfWeek];
      if (!dayAvailability.isOpen) {
        return false; // Venue is closed on this day
      }
      
      // Check if requested time is within opening hours
      if (dayAvailability.openTime && dayAvailability.closeTime) {
        if (startTime < dayAvailability.openTime || endTime > dayAvailability.closeTime) {
          return false; // Requested time is outside opening hours
        }
      }
      
      // Check for conflicting bookings
      const bookings = await this.getVenueBookings(venueId, undefined, date);
      
      for (const booking of bookings) {
        // Skip cancelled bookings
        if (
          booking.status === BookingStatus.CANCELLED_BY_USER ||
          booking.status === BookingStatus.CANCELLED_BY_VENUE ||
          booking.status === BookingStatus.CANCELLED_BY_ADMIN
        ) {
          continue;
        }
        
        // Check for time overlap
        if (
          (startTime >= booking.startTime && startTime < booking.endTime) ||
          (endTime > booking.startTime && endTime <= booking.endTime) ||
          (startTime <= booking.startTime && endTime >= booking.endTime)
        ) {
          return false; // Time overlap with existing booking
        }
      }
      
      return true; // Venue is available
    } catch (error) {
      console.error('Error checking venue availability:', error);
      throw error;
    }
  }
} 