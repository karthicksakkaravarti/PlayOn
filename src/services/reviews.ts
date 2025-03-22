import { FirestoreAPI } from './api';
import { 
  Review, 
  ReviewStatus, 
  ReviewCategory, 
  ReviewRequest, 
  ReviewReport, 
  ReviewReportReason 
} from '../types/review';
import { VenueService } from './venues';
import { where, orderBy, limit } from 'firebase/firestore';

/**
 * Service for review-related operations
 */
export class ReviewService {
  private static readonly COLLECTION = 'reviews';
  private static readonly REPORTS_COLLECTION = 'review_reports';

  /**
   * Create a new review
   * @param reviewData - The review data
   * @returns A promise that resolves to the created review
   */
  static async createReview(reviewData: ReviewRequest): Promise<Review> {
    try {
      // Create review object
      const review: Omit<Review, 'id'> = {
        venueId: reviewData.venueId,
        userId: reviewData.userId,
        bookingId: reviewData.bookingId,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        photos: reviewData.photos,
        categories: reviewData.categories,
        status: ReviewStatus.PENDING,
        helpfulCount: 0,
        reportCount: 0,
        verified: true, // Verified since we require a bookingId
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      // Create document
      const docRef = await FirestoreAPI.create(this.COLLECTION, review);
      const createdReview = { ...review, id: docRef.id };
      
      // Update venue rating
      await VenueService.updateVenueRating(reviewData.venueId, reviewData.rating);
      
      return createdReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  /**
   * Get a review by ID
   * @param reviewId - The review ID
   * @returns A promise that resolves to the review or null if not found
   */
  static async getReviewById(reviewId: string): Promise<Review | null> {
    try {
      return await FirestoreAPI.getById<Review>(this.COLLECTION, reviewId);
    } catch (error) {
      console.error('Error getting review by ID:', error);
      throw error;
    }
  }

  /**
   * Update a review
   * @param reviewId - The review ID
   * @param reviewData - The review data to update
   * @returns A promise that resolves to the updated review
   */
  static async updateReview(reviewId: string, reviewData: Partial<Review>): Promise<Review> {
    try {
      // Include updatedAt timestamp
      const updates = {
        ...reviewData,
        updatedAt: Date.now()
      };
      
      await FirestoreAPI.update(this.COLLECTION, reviewId, updates);
      const updatedReview = await this.getReviewById(reviewId);
      
      if (!updatedReview) {
        throw new Error('Review not found after update');
      }
      
      return updatedReview;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  /**
   * Delete a review
   * @param reviewId - The review ID
   * @returns A promise that resolves to true if successful
   */
  static async deleteReview(reviewId: string): Promise<boolean> {
    try {
      // Get review first to get venue ID
      const review = await this.getReviewById(reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      // Delete review
      await FirestoreAPI.delete(this.COLLECTION, reviewId);
      
      // Recalculate venue rating (this would require additional logic to get all reviews for a venue)
      // For now, we'll handle this through a separate admin function or cloud function
      
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  /**
   * Update review status
   * @param reviewId - The review ID
   * @param status - The new status
   * @returns A promise that resolves to the updated review
   */
  static async updateReviewStatus(reviewId: string, status: ReviewStatus): Promise<Review> {
    try {
      return await this.updateReview(reviewId, { status });
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  }

  /**
   * Add a reply to a review
   * @param reviewId - The review ID
   * @param userId - The user ID of the replier
   * @param comment - The reply comment
   * @returns A promise that resolves to the updated review
   */
  static async addReply(reviewId: string, userId: string, comment: string): Promise<Review> {
    try {
      const reply = {
        userId,
        comment,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      return await this.updateReview(reviewId, { reply });
    } catch (error) {
      console.error('Error adding reply to review:', error);
      throw error;
    }
  }

  /**
   * Mark a review as helpful
   * @param reviewId - The review ID
   * @returns A promise that resolves to the updated review
   */
  static async markAsHelpful(reviewId: string): Promise<Review> {
    try {
      const review = await this.getReviewById(reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      const helpfulCount = review.helpfulCount + 1;
      
      return await this.updateReview(reviewId, { helpfulCount });
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  }

  /**
   * Report a review
   * @param reviewId - The review ID
   * @param userId - The user ID reporting the review
   * @param reason - The reason for the report
   * @param description - Optional description
   * @returns A promise that resolves to the created report
   */
  static async reportReview(
    reviewId: string,
    userId: string,
    reason: ReviewReportReason,
    description?: string
  ): Promise<ReviewReport> {
    try {
      const review = await this.getReviewById(reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      // Create report object
      const report: Omit<ReviewReport, 'id'> = {
        reviewId,
        userId,
        reason,
        description,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      // Create document
      const docRef = await FirestoreAPI.create(this.REPORTS_COLLECTION, report);
      const createdReport = { ...report, id: docRef.id };
      
      // Update review report count
      await this.updateReview(reviewId, { 
        reportCount: review.reportCount + 1,
        status: review.reportCount >= 2 ? ReviewStatus.FLAGGED : review.status
      });
      
      return createdReport;
    } catch (error) {
      console.error('Error reporting review:', error);
      throw error;
    }
  }

  /**
   * Get reviews by venue
   * @param venueId - The venue ID
   * @param status - Optional status filter
   * @param maxItems - Maximum number of reviews to return
   * @returns A promise that resolves to an array of reviews
   */
  static async getVenueReviews(
    venueId: string,
    status: ReviewStatus = ReviewStatus.PUBLISHED,
    maxItems: number = 20
  ): Promise<Review[]> {
    try {
      return await FirestoreAPI.query<Review>(
        this.COLLECTION,
        [
          where('venueId', '==', venueId),
          where('status', '==', status),
          orderBy('createdAt', 'desc'),
          limit(maxItems)
        ]
      );
    } catch (error) {
      console.error('Error getting venue reviews:', error);
      throw error;
    }
  }

  /**
   * Get reviews by user
   * @param userId - The user ID
   * @param maxItems - Maximum number of reviews to return
   * @returns A promise that resolves to an array of reviews
   */
  static async getUserReviews(userId: string, maxItems: number = 20): Promise<Review[]> {
    try {
      return await FirestoreAPI.query<Review>(
        this.COLLECTION,
        [
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(maxItems)
        ]
      );
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw error;
    }
  }

  /**
   * Check if user has reviewed a venue
   * @param userId - The user ID
   * @param venueId - The venue ID
   * @returns A promise that resolves to true if the user has reviewed the venue
   */
  static async hasUserReviewedVenue(userId: string, venueId: string): Promise<boolean> {
    try {
      const reviews = await FirestoreAPI.query<Review>(
        this.COLLECTION,
        [
          where('userId', '==', userId),
          where('venueId', '==', venueId)
        ]
      );
      
      return reviews.length > 0;
    } catch (error) {
      console.error('Error checking if user has reviewed venue:', error);
      throw error;
    }
  }

  /**
   * Get reviews by booking
   * @param bookingId - The booking ID
   * @returns A promise that resolves to a review or null if not found
   */
  static async getBookingReview(bookingId: string): Promise<Review | null> {
    try {
      const reviews = await FirestoreAPI.query<Review>(
        this.COLLECTION,
        [where('bookingId', '==', bookingId)]
      );
      
      return reviews.length > 0 ? reviews[0] : null;
    } catch (error) {
      console.error('Error getting booking review:', error);
      throw error;
    }
  }

  /**
   * Get pending review reports
   * @param maxItems - Maximum number of reports to return
   * @returns A promise that resolves to an array of reports
   */
  static async getPendingReports(maxItems: number = 20): Promise<ReviewReport[]> {
    try {
      return await FirestoreAPI.query<ReviewReport>(
        this.REPORTS_COLLECTION,
        [
          where('status', '==', 'pending'),
          orderBy('createdAt', 'asc'),
          limit(maxItems)
        ]
      );
    } catch (error) {
      console.error('Error getting pending reports:', error);
      throw error;
    }
  }

  /**
   * Update report status
   * @param reportId - The report ID
   * @param status - The new status
   * @param resolvedBy - Optional admin user ID who resolved the report
   * @returns A promise that resolves to the updated report
   */
  static async updateReportStatus(
    reportId: string,
    status: 'pending' | 'reviewed' | 'resolved' | 'rejected',
    resolvedBy?: string
  ): Promise<ReviewReport> {
    try {
      const updates: Partial<ReviewReport> = {
        status,
        updatedAt: Date.now()
      };
      
      if (status === 'resolved' && resolvedBy) {
        updates.resolvedAt = Date.now();
        updates.resolvedBy = resolvedBy;
      }
      
      await FirestoreAPI.update(this.REPORTS_COLLECTION, reportId, updates);
      const updatedReport = await FirestoreAPI.getById<ReviewReport>(this.REPORTS_COLLECTION, reportId);
      
      if (!updatedReport) {
        throw new Error('Report not found after update');
      }
      
      // If the report is resolved, update the review status
      if (status === 'resolved') {
        await this.updateReviewStatus(updatedReport.reviewId, ReviewStatus.REMOVED);
      } else if (status === 'rejected') {
        // If the report is rejected, revert the review status if it was flagged
        const review = await this.getReviewById(updatedReport.reviewId);
        if (review && review.status === ReviewStatus.FLAGGED) {
          await this.updateReviewStatus(updatedReport.reviewId, ReviewStatus.PUBLISHED);
        }
      }
      
      return updatedReport;
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  }
} 