import { FirestoreAPI } from './api';
import { User, VenueOwner, Admin } from '../types/user';
import { UserRole } from '../types/auth';
import { auth } from './firebase';
import { where } from 'firebase/firestore';

/**
 * Service for user-related operations
 */
export class UserService {
  private static readonly COLLECTION = 'users';

  /**
   * Create a new user in Firestore
   * @param user - The user data to save
   * @returns A promise that resolves to the user with ID
   */
  static async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      // Set default values for new users
      const userData: Omit<User, 'id'> = {
        ...user,
        favoriteVenues: user.favoriteVenues || [],
        isActive: true,
        createdAt: user.createdAt || Date.now(),
        updatedAt: user.updatedAt || Date.now()
      };

      // Use authentication UID as the document ID if available
      let userId = '';
      if (auth.currentUser) {
        userId = auth.currentUser.uid;
        await FirestoreAPI.createWithId(this.COLLECTION, userId, userData);
      } else {
        const docRef = await FirestoreAPI.create(this.COLLECTION, userData);
        userId = docRef.id;
      }

      return { ...userData, id: userId } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   * @param userId - The user ID
   * @returns A promise that resolves to the user or null if not found
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      return await FirestoreAPI.getById<User>(this.COLLECTION, userId);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Get a user by phone number
   * @param phoneNumber - The phone number
   * @returns A promise that resolves to the user or null if not found
   */
  static async getUserByPhone(phoneNumber: string): Promise<User | null> {
    try {
      const users = await FirestoreAPI.query<User>(
        this.COLLECTION,
        [where('phoneNumber', '==', phoneNumber)]
      );
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error getting user by phone number:', error);
      throw error;
    }
  }

  /**
   * Update a user's profile
   * @param userId - The user ID
   * @param userData - The user data to update
   * @returns A promise that resolves to the updated user
   */
  static async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      // Include updatedAt timestamp
      const updates = {
        ...userData,
        updatedAt: Date.now()
      };
      
      await FirestoreAPI.update(this.COLLECTION, userId, updates);
      const updatedUser = await this.getUserById(userId);
      
      if (!updatedUser) {
        throw new Error('User not found after update');
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Add a venue to a user's favorites
   * @param userId - The user ID
   * @param venueId - The venue ID to add to favorites
   * @returns A promise that resolves to true if successful
   */
  static async addFavoriteVenue(userId: string, venueId: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check if venue is already in favorites
      if (user.favoriteVenues.includes(venueId)) {
        return true; // Already a favorite
      }
      
      // Add venue to favorites
      const favoriteVenues = [...user.favoriteVenues, venueId];
      await FirestoreAPI.update(this.COLLECTION, userId, { 
        favoriteVenues,
        updatedAt: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('Error adding favorite venue:', error);
      throw error;
    }
  }

  /**
   * Remove a venue from a user's favorites
   * @param userId - The user ID
   * @param venueId - The venue ID to remove from favorites
   * @returns A promise that resolves to true if successful
   */
  static async removeFavoriteVenue(userId: string, venueId: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Remove venue from favorites
      const favoriteVenues = user.favoriteVenues.filter(id => id !== venueId);
      await FirestoreAPI.update(this.COLLECTION, userId, { 
        favoriteVenues,
        updatedAt: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('Error removing favorite venue:', error);
      throw error;
    }
  }

  /**
   * Get all favorite venues for a user
   * @param userId - The user ID
   * @returns A promise that resolves to an array of venue IDs
   */
  static async getFavoriteVenues(userId: string): Promise<string[]> {
    try {
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user.favoriteVenues;
    } catch (error) {
      console.error('Error getting favorite venues:', error);
      throw error;
    }
  }

  /**
   * Update a user's device token for push notifications
   * @param userId - The user ID
   * @param deviceToken - The new device token
   * @returns A promise that resolves to true if successful
   */
  static async updateDeviceToken(userId: string, deviceToken: string): Promise<boolean> {
    try {
      await FirestoreAPI.update(this.COLLECTION, userId, { 
        deviceToken,
        updatedAt: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('Error updating device token:', error);
      throw error;
    }
  }

  /**
   * Upgrade a regular user to a venue owner
   * @param userId - The user ID
   * @param ownerData - The venue owner specific data
   * @returns A promise that resolves to the updated user as a venue owner
   */
  static async upgradeToVenueOwner(
    userId: string, 
    ownerData: Partial<VenueOwner>
  ): Promise<VenueOwner> {
    try {
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Create venue owner data
      const venueOwnerData: Partial<VenueOwner> = {
        ...ownerData,
        role: UserRole.VENUE_OWNER,
        venues: ownerData.venues || [],
        updatedAt: Date.now()
      };
      
      await FirestoreAPI.update(this.COLLECTION, userId, venueOwnerData);
      const updatedUser = await this.getUserById(userId);
      
      if (!updatedUser) {
        throw new Error('User not found after upgrade');
      }
      
      return updatedUser as VenueOwner;
    } catch (error) {
      console.error('Error upgrading to venue owner:', error);
      throw error;
    }
  }

  /**
   * Deactivate a user account
   * @param userId - The user ID
   * @returns A promise that resolves to true if successful
   */
  static async deactivateUser(userId: string): Promise<boolean> {
    try {
      await FirestoreAPI.update(this.COLLECTION, userId, { 
        isActive: false,
        updatedAt: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Reactivate a user account
   * @param userId - The user ID
   * @returns A promise that resolves to true if successful
   */
  static async reactivateUser(userId: string): Promise<boolean> {
    try {
      await FirestoreAPI.update(this.COLLECTION, userId, { 
        isActive: true,
        updatedAt: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('Error reactivating user:', error);
      throw error;
    }
  }
} 