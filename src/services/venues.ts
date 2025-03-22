import { FirestoreAPI } from './api';
import { Venue, VenueStatus, Sport, Amenity, TimeSlot, AvailabilityException } from '../types/venue';
import { where, orderBy, limit, DocumentData, QueryConstraint } from 'firebase/firestore';

/**
 * Service for venue-related operations
 */
export class VenueService {
  private static readonly COLLECTION = 'venues';

  /**
   * Create a new venue
   * @param venue - The venue data to save
   * @returns A promise that resolves to the venue with ID
   */
  static async createVenue(venue: Omit<Venue, 'id'>): Promise<Venue> {
    try {
      // Set default values for new venues
      const venueData: Omit<Venue, 'id'> = {
        ...venue,
        status: venue.status || VenueStatus.PENDING,
        featured: venue.featured || false,
        isVerified: venue.isVerified || false,
        ratings: venue.ratings || { average: 0, count: 0 },
        createdAt: venue.createdAt || Date.now(),
        updatedAt: venue.updatedAt || Date.now()
      };
      
      const docRef = await FirestoreAPI.create(this.COLLECTION, venueData);
      return { ...venueData, id: docRef.id } as Venue;
    } catch (error) {
      console.error('Error creating venue:', error);
      throw error;
    }
  }

  /**
   * Get a venue by ID
   * @param venueId - The venue ID
   * @returns A promise that resolves to the venue or null if not found
   */
  static async getVenueById(venueId: string): Promise<Venue | null> {
    try {
      return await FirestoreAPI.getById<Venue>(this.COLLECTION, venueId);
    } catch (error) {
      console.error('Error getting venue by ID:', error);
      throw error;
    }
  }

  /**
   * Update a venue
   * @param venueId - The venue ID
   * @param venueData - The venue data to update
   * @returns A promise that resolves to the updated venue
   */
  static async updateVenue(venueId: string, venueData: Partial<Venue>): Promise<Venue> {
    try {
      // Include updatedAt timestamp
      const updates = {
        ...venueData,
        updatedAt: Date.now()
      };
      
      await FirestoreAPI.update(this.COLLECTION, venueId, updates);
      const updatedVenue = await this.getVenueById(venueId);
      
      if (!updatedVenue) {
        throw new Error('Venue not found after update');
      }
      
      return updatedVenue;
    } catch (error) {
      console.error('Error updating venue:', error);
      throw error;
    }
  }

  /**
   * Delete a venue
   * @param venueId - The venue ID
   * @returns A promise that resolves to true if successful
   */
  static async deleteVenue(venueId: string): Promise<boolean> {
    try {
      await FirestoreAPI.delete(this.COLLECTION, venueId);
      return true;
    } catch (error) {
      console.error('Error deleting venue:', error);
      throw error;
    }
  }

  /**
   * Get venues by owner ID
   * @param ownerId - The owner's user ID
   * @returns A promise that resolves to an array of venues
   */
  static async getVenuesByOwner(ownerId: string): Promise<Venue[]> {
    try {
      return await FirestoreAPI.query<Venue>(
        this.COLLECTION,
        [where('ownerId', '==', ownerId)]
      );
    } catch (error) {
      console.error('Error getting venues by owner:', error);
      throw error;
    }
  }

  /**
   * Get venues by status
   * @param status - The venue status
   * @param limit - The maximum number of venues to return
   * @returns A promise that resolves to an array of venues
   */
  static async getVenuesByStatus(status: VenueStatus, maxItems: number = 20): Promise<Venue[]> {
    try {
      return await FirestoreAPI.query<Venue>(
        this.COLLECTION,
        [
          where('status', '==', status),
          orderBy('createdAt', 'desc'),
          limit(maxItems)
        ]
      );
    } catch (error) {
      console.error('Error getting venues by status:', error);
      throw error;
    }
  }

  /**
   * Get featured venues
   * @param maxItems - The maximum number of venues to return
   * @returns A promise that resolves to an array of featured venues
   */
  static async getFeaturedVenues(maxItems: number = 10): Promise<Venue[]> {
    try {
      return await FirestoreAPI.query<Venue>(
        this.COLLECTION,
        [
          where('featured', '==', true),
          where('status', '==', VenueStatus.APPROVED),
          orderBy('ratings.average', 'desc'),
          limit(maxItems)
        ]
      );
    } catch (error) {
      console.error('Error getting featured venues:', error);
      throw error;
    }
  }

  /**
   * Search venues by various criteria
   * @param options - The search criteria
   * @returns A promise that resolves to an array of venues
   */
  static async searchVenues(options: {
    sport?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    date?: string;
    startTime?: string;
    endTime?: string;
    maxItems?: number;
  }): Promise<Venue[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('status', '==', VenueStatus.APPROVED)
      ];
      
      // Add sport filter if provided
      if (options.sport) {
        constraints.push(where('sports', 'array-contains', { id: options.sport }));
      }
      
      // Add city filter if provided
      if (options.city) {
        constraints.push(where('address.city', '==', options.city));
      }
      
      // Add price range filter if provided
      if (options.minPrice !== undefined) {
        constraints.push(where('pricing.basePrice', '>=', options.minPrice));
      }
      
      if (options.maxPrice !== undefined) {
        constraints.push(where('pricing.basePrice', '<=', options.maxPrice));
      }
      
      // Add limit
      constraints.push(limit(options.maxItems || 20));
      
      // Execute query
      const venues = await FirestoreAPI.query<Venue>(this.COLLECTION, constraints);
      
      // Filter by date and time if provided (must be done client-side)
      if (options.date || options.startTime || options.endTime) {
        return this.filterVenuesByAvailability(
          venues, 
          options.date, 
          options.startTime, 
          options.endTime
        );
      }
      
      return venues;
    } catch (error) {
      console.error('Error searching venues:', error);
      throw error;
    }
  }

  /**
   * Helper method to filter venues by availability
   */
  private static filterVenuesByAvailability(
    venues: Venue[],
    date?: string,
    startTime?: string,
    endTime?: string
  ): Venue[] {
    if (!date && !startTime && !endTime) {
      return venues;
    }
    
    // Get day of week from date if provided
    let dayOfWeek: keyof Venue['venueTiming'] | undefined;
    if (date) {
      const dateObj = new Date(date);
      const days: (keyof Venue['venueTiming'])[] = [
        'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
      ];
      dayOfWeek = days[dateObj.getDay()];
    }
    
    return venues.filter(venue => {
      // Check if venue has special availability exceptions for this date
      if (date) {
        const exception = venue.availabilityExceptions.find(ex => ex.date === date);
        if (exception) {
          if (!exception.isAvailable) {
            return false; // Venue is explicitly unavailable on this date
          }
          // If we have time constraints, check the exception slots
          if (startTime && endTime && exception.slots) {
            return this.hasAvailableSlot(exception.slots, startTime, endTime);
          }
          return true; // Available on this date with no time constraints
        }
      }
      
      // Check regular venue timing if we have a day of week
      if (dayOfWeek) {
        const dayAvailability = venue.venueTiming[dayOfWeek];
        
        if (!dayAvailability.isOpen) {
          return false; // Venue is closed on this day
        }
        
        // If we have time constraints, check against opening hours or slots
        if (startTime && endTime) {
          if (dayAvailability.slots && dayAvailability.slots.length > 0) {
            return this.hasAvailableSlot(dayAvailability.slots, startTime, endTime);
          } else if (dayAvailability.openTime && dayAvailability.closeTime) {
            return this.isWithinOpenHours(startTime, endTime, dayAvailability.openTime, dayAvailability.closeTime);
          }
        }
      }
      
      return true; // No specific constraints or all constraints satisfied
    });
  }

  /**
   * Check if the requested time range has an available slot
   */
  private static hasAvailableSlot(
    slots: TimeSlot[],
    requestedStart: string,
    requestedEnd: string
  ): boolean {
    return slots.some(slot => 
      slot.startTime <= requestedStart && slot.endTime >= requestedEnd
    );
  }

  /**
   * Check if the requested time range is within venue opening hours
   */
  private static isWithinOpenHours(
    requestedStart: string,
    requestedEnd: string,
    openTime: string,
    closeTime: string
  ): boolean {
    return requestedStart >= openTime && requestedEnd <= closeTime;
  }

  /**
   * Update a venue's status
   * @param venueId - The venue ID
   * @param status - The new status
   * @returns A promise that resolves to the updated venue
   */
  static async updateVenueStatus(venueId: string, status: VenueStatus): Promise<Venue> {
    try {
      await FirestoreAPI.update(this.COLLECTION, venueId, { 
        status,
        updatedAt: Date.now()
      });
      
      const updatedVenue = await this.getVenueById(venueId);
      
      if (!updatedVenue) {
        throw new Error('Venue not found after status update');
      }
      
      return updatedVenue;
    } catch (error) {
      console.error('Error updating venue status:', error);
      throw error;
    }
  }

  /**
   * Add a special availability exception for a date
   * @param venueId - The venue ID
   * @param exception - The availability exception
   * @returns A promise that resolves to the updated venue
   */
  static async addAvailabilityException(
    venueId: string, 
    exception: Omit<AvailabilityException, 'id'>
  ): Promise<Venue> {
    try {
      const venue = await this.getVenueById(venueId);
      
      if (!venue) {
        throw new Error('Venue not found');
      }
      
      // Check if there's already an exception for this date
      const existingIndex = venue.availabilityExceptions.findIndex(ex => ex.date === exception.date);
      
      // Create a new exception with ID
      const newException: AvailabilityException = {
        ...exception,
        id: `${venueId}_${exception.date}`
      };
      
      let availabilityExceptions = [...venue.availabilityExceptions];
      
      if (existingIndex >= 0) {
        // Update existing exception
        availabilityExceptions[existingIndex] = newException;
      } else {
        // Add new exception
        availabilityExceptions.push(newException);
      }
      
      // Update venue
      return await this.updateVenue(venueId, { availabilityExceptions });
    } catch (error) {
      console.error('Error adding availability exception:', error);
      throw error;
    }
  }

  /**
   * Remove an availability exception
   * @param venueId - The venue ID
   * @param exceptionId - The exception ID
   * @returns A promise that resolves to the updated venue
   */
  static async removeAvailabilityException(venueId: string, exceptionId: string): Promise<Venue> {
    try {
      const venue = await this.getVenueById(venueId);
      
      if (!venue) {
        throw new Error('Venue not found');
      }
      
      // Filter out the exception to remove
      const availabilityExceptions = venue.availabilityExceptions.filter(ex => ex.id !== exceptionId);
      
      // Update venue
      return await this.updateVenue(venueId, { availabilityExceptions });
    } catch (error) {
      console.error('Error removing availability exception:', error);
      throw error;
    }
  }

  /**
   * Toggle a venue's featured status
   * @param venueId - The venue ID
   * @param featured - The new featured status
   * @returns A promise that resolves to the updated venue
   */
  static async setFeaturedStatus(venueId: string, featured: boolean): Promise<Venue> {
    try {
      await FirestoreAPI.update(this.COLLECTION, venueId, { 
        featured,
        updatedAt: Date.now()
      });
      
      const updatedVenue = await this.getVenueById(venueId);
      
      if (!updatedVenue) {
        throw new Error('Venue not found after featured status update');
      }
      
      return updatedVenue;
    } catch (error) {
      console.error('Error updating venue featured status:', error);
      throw error;
    }
  }

  /**
   * Update a venue's ratings based on new review
   * @param venueId - The venue ID
   * @param newRating - The rating from the new review (1-5)
   * @returns A promise that resolves to the updated venue
   */
  static async updateVenueRating(venueId: string, newRating: number): Promise<Venue> {
    try {
      const venue = await this.getVenueById(venueId);
      
      if (!venue) {
        throw new Error('Venue not found');
      }
      
      // Calculate new average rating
      const currentTotal = venue.ratings.average * venue.ratings.count;
      const newCount = venue.ratings.count + 1;
      const newAverage = (currentTotal + newRating) / newCount;
      
      // Round to 1 decimal place
      const roundedAverage = Math.round(newAverage * 10) / 10;
      
      // Update venue ratings
      const ratings = {
        average: roundedAverage,
        count: newCount
      };
      
      // Update venue
      return await this.updateVenue(venueId, { ratings });
    } catch (error) {
      console.error('Error updating venue rating:', error);
      throw error;
    }
  }
} 