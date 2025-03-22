export interface Review {
  id: string;
  venueId: string;
  userId: string;
  bookingId: string;
  rating: number; // Rating from 1-5
  title?: string;
  comment?: string;
  photos?: string[]; // Array of photo URLs
  categories: ReviewCategory[];
  reply?: ReviewReply;
  status: ReviewStatus;
  helpfulCount: number;
  reportCount: number;
  verified: boolean; // Whether the reviewer actually booked and used the venue
  createdAt: number;
  updatedAt: number;
}

export enum ReviewStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  FLAGGED = 'flagged',
  REMOVED = 'removed'
}

export interface ReviewCategory {
  name: string; // e.g., "Cleanliness", "Value", "Amenities", etc.
  rating: number; // Rating from 1-5
}

export interface ReviewReply {
  userId: string; // ID of the user who replied (usually venue owner)
  comment: string;
  createdAt: number;
  updatedAt: number;
}

export interface ReviewSummary {
  venueId: string;
  averageRating: number;
  totalReviews: number;
  categoryAverages: {
    [category: string]: number; // Average rating per category
  };
  ratingDistribution: {
    '1': number; // Count of 1-star ratings
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  recentReviews: Review[];
}

export interface ReviewRequest {
  venueId: string;
  bookingId: string;
  rating: number;
  title?: string;
  comment?: string;
  photos?: string[];
  categories: {
    name: string;
    rating: number;
  }[];
}

export interface ReviewReport {
  id: string;
  reviewId: string;
  userId: string; // User who reported the review
  reason: ReviewReportReason;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  resolvedBy?: string; // Admin user ID who resolved the report
}

export enum ReviewReportReason {
  INAPPROPRIATE = 'inappropriate',
  SPAM = 'spam',
  FAKE = 'fake',
  OFFENSIVE = 'offensive',
  PRIVATE_INFO = 'private_info',
  OTHER = 'other'
} 