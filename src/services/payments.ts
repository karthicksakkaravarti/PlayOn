import { FirestoreAPI } from './api';
import { Payment, PaymentMethod, PaymentGateway, Refund, PaymentRequest } from '../types/payment';
import { PaymentStatus } from '../types/booking';
import { BookingService } from './bookings';
import { where, orderBy, limit } from 'firebase/firestore';

/**
 * Service for payment-related operations
 */
export class PaymentService {
  private static readonly COLLECTION = 'payments';

  /**
   * Create a new payment
   * @param paymentData - The payment data
   * @returns A promise that resolves to the created payment
   */
  static async createPayment(paymentData: PaymentRequest): Promise<Payment> {
    try {
      // Get booking to extract details
      const booking = await BookingService.getBookingById(paymentData.bookingId);
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Create payment object
      const payment: Omit<Payment, 'id'> = {
        bookingId: paymentData.bookingId,
        userId: booking.userId,
        venueId: booking.venueId,
        amount: {
          subtotal: booking.price.baseAmount,
          taxes: booking.price.taxes,
          fees: booking.price.fees,
          discounts: booking.price.discounts,
          total: booking.price.totalAmount,
          currency: booking.price.currency
        },
        method: paymentData.method,
        gateway: this.getGatewayForMethod(paymentData.method),
        status: PaymentStatus.PENDING,
        metadata: paymentData.metadata,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      // Create document
      const docRef = await FirestoreAPI.create(this.COLLECTION, payment);
      const createdPayment = { ...payment, id: docRef.id };
      
      // Update booking with payment ID
      await BookingService.updatePaymentStatus(
        booking.id,
        PaymentStatus.PENDING,
        createdPayment.id
      );
      
      return createdPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Get appropriate payment gateway based on payment method
   */
  private static getGatewayForMethod(method: PaymentMethod): PaymentGateway {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
      case PaymentMethod.NET_BANKING:
      case PaymentMethod.UPI:
      case PaymentMethod.WALLET:
        return PaymentGateway.RAZORPAY;
      case PaymentMethod.CASH:
        return PaymentGateway.MANUAL;
      default:
        return PaymentGateway.RAZORPAY;
    }
  }

  /**
   * Get a payment by ID
   * @param paymentId - The payment ID
   * @returns A promise that resolves to the payment or null if not found
   */
  static async getPaymentById(paymentId: string): Promise<Payment | null> {
    try {
      return await FirestoreAPI.getById<Payment>(this.COLLECTION, paymentId);
    } catch (error) {
      console.error('Error getting payment by ID:', error);
      throw error;
    }
  }

  /**
   * Update a payment
   * @param paymentId - The payment ID
   * @param paymentData - The payment data to update
   * @returns A promise that resolves to the updated payment
   */
  static async updatePayment(paymentId: string, paymentData: Partial<Payment>): Promise<Payment> {
    try {
      // Include updatedAt timestamp
      const updates = {
        ...paymentData,
        updatedAt: Date.now()
      };
      
      await FirestoreAPI.update(this.COLLECTION, paymentId, updates);
      const updatedPayment = await this.getPaymentById(paymentId);
      
      if (!updatedPayment) {
        throw new Error('Payment not found after update');
      }
      
      return updatedPayment;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  /**
   * Update payment status
   * @param paymentId - The payment ID
   * @param status - The new status
   * @param gatewayResponse - Optional response from payment gateway
   * @returns A promise that resolves to the updated payment
   */
  static async updatePaymentStatus(
    paymentId: string, 
    status: PaymentStatus,
    gatewayResponse?: Record<string, any>
  ): Promise<Payment> {
    try {
      const payment = await this.getPaymentById(paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // Build updates
      const updates: Partial<Payment> = {
        status,
        updatedAt: Date.now()
      };
      
      // Add gateway-specific fields if provided
      if (gatewayResponse) {
        if (gatewayResponse.id) {
          updates.gatewayPaymentId = gatewayResponse.id;
        }
        
        if (gatewayResponse.order_id) {
          updates.gatewayOrderId = gatewayResponse.order_id;
        }
        
        if (status === PaymentStatus.PAID) {
          updates.completedAt = Date.now();
        }
        
        // Store entire gateway response in metadata
        updates.metadata = {
          ...payment.metadata,
          gatewayResponse
        };
      }
      
      // Update payment
      const updatedPayment = await this.updatePayment(paymentId, updates);
      
      // Update booking payment status
      await BookingService.updatePaymentStatus(payment.bookingId, status);
      
      return updatedPayment;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  /**
   * Process a successful payment
   * @param paymentId - The payment ID
   * @param gatewayResponse - Response from payment gateway
   * @returns A promise that resolves to the updated payment
   */
  static async processSuccessfulPayment(
    paymentId: string,
    gatewayResponse: Record<string, any>
  ): Promise<Payment> {
    try {
      return await this.updatePaymentStatus(
        paymentId,
        PaymentStatus.PAID,
        gatewayResponse
      );
    } catch (error) {
      console.error('Error processing successful payment:', error);
      throw error;
    }
  }

  /**
   * Process a failed payment
   * @param paymentId - The payment ID
   * @param failureReason - The reason for the failure
   * @param gatewayResponse - Optional response from payment gateway
   * @returns A promise that resolves to the updated payment
   */
  static async processFailedPayment(
    paymentId: string,
    failureReason: string,
    gatewayResponse?: Record<string, any>
  ): Promise<Payment> {
    try {
      const updates: Partial<Payment> = {
        status: PaymentStatus.FAILED,
        failureReason,
        updatedAt: Date.now()
      };
      
      if (gatewayResponse) {
        updates.metadata = { gatewayResponse };
      }
      
      const payment = await this.updatePayment(paymentId, updates);
      
      // Update booking payment status
      await BookingService.updatePaymentStatus(payment.bookingId, PaymentStatus.FAILED);
      
      return payment;
    } catch (error) {
      console.error('Error processing failed payment:', error);
      throw error;
    }
  }

  /**
   * Create a refund
   * @param paymentId - The payment ID
   * @param amount - The refund amount
   * @param reason - The reason for the refund
   * @param gatewayResponse - Optional response from payment gateway
   * @returns A promise that resolves to the updated payment with refund
   */
  static async createRefund(
    paymentId: string,
    amount: number,
    reason: 'cancellation' | 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'other',
    gatewayResponse?: Record<string, any>
  ): Promise<Payment> {
    try {
      const payment = await this.getPaymentById(paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // Create refund object
      const refund: Refund = {
        id: `${paymentId}_${Date.now()}`,
        paymentId,
        amount,
        currency: payment.amount.currency,
        reason,
        status: 'pending',
        gateway: payment.gateway,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      // Add gateway details if provided
      if (gatewayResponse) {
        refund.gatewayRefundId = gatewayResponse.id;
        refund.metadata = { gatewayResponse };
      }
      
      // Update payment with refund
      const refunds = payment.refunds || [];
      const updatedRefunds = [...refunds, refund];
      
      // Calculate total refunded amount
      const totalRefunded = updatedRefunds.reduce((total, r) => total + r.amount, 0);
      
      // Determine new payment status
      let newStatus = payment.status;
      if (totalRefunded >= payment.amount.total) {
        newStatus = PaymentStatus.FULLY_REFUNDED;
      } else if (totalRefunded > 0) {
        newStatus = PaymentStatus.PARTIALLY_REFUNDED;
      }
      
      // Update payment
      const updatedPayment = await this.updatePayment(paymentId, {
        refunds: updatedRefunds,
        status: newStatus
      });
      
      // Update booking payment status
      await BookingService.updatePaymentStatus(payment.bookingId, newStatus);
      
      return updatedPayment;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }

  /**
   * Update refund status
   * @param paymentId - The payment ID
   * @param refundId - The refund ID
   * @param status - The new status
   * @returns A promise that resolves to the updated payment
   */
  static async updateRefundStatus(
    paymentId: string,
    refundId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed'
  ): Promise<Payment> {
    try {
      const payment = await this.getPaymentById(paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      if (!payment.refunds) {
        throw new Error('Payment has no refunds');
      }
      
      // Find and update refund
      const refunds = [...payment.refunds];
      const refundIndex = refunds.findIndex(r => r.id === refundId);
      
      if (refundIndex === -1) {
        throw new Error('Refund not found');
      }
      
      // Update refund
      refunds[refundIndex] = {
        ...refunds[refundIndex],
        status,
        updatedAt: Date.now(),
        completedAt: status === 'completed' ? Date.now() : refunds[refundIndex].completedAt
      };
      
      // Update payment
      return await this.updatePayment(paymentId, { refunds });
    } catch (error) {
      console.error('Error updating refund status:', error);
      throw error;
    }
  }

  /**
   * Get user payments
   * @param userId - The user ID
   * @param maxItems - Maximum number of payments to return
   * @returns A promise that resolves to an array of payments
   */
  static async getUserPayments(userId: string, maxItems: number = 20): Promise<Payment[]> {
    try {
      return await FirestoreAPI.query<Payment>(
        this.COLLECTION,
        [
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(maxItems)
        ]
      );
    } catch (error) {
      console.error('Error getting user payments:', error);
      throw error;
    }
  }

  /**
   * Get venue payments
   * @param venueId - The venue ID
   * @param maxItems - Maximum number of payments to return
   * @returns A promise that resolves to an array of payments
   */
  static async getVenuePayments(venueId: string, maxItems: number = 20): Promise<Payment[]> {
    try {
      return await FirestoreAPI.query<Payment>(
        this.COLLECTION,
        [
          where('venueId', '==', venueId),
          orderBy('createdAt', 'desc'),
          limit(maxItems)
        ]
      );
    } catch (error) {
      console.error('Error getting venue payments:', error);
      throw error;
    }
  }

  /**
   * Get booking payment
   * @param bookingId - The booking ID
   * @returns A promise that resolves to the payment or null if not found
   */
  static async getBookingPayment(bookingId: string): Promise<Payment | null> {
    try {
      const payments = await FirestoreAPI.query<Payment>(
        this.COLLECTION,
        [where('bookingId', '==', bookingId)]
      );
      
      return payments.length > 0 ? payments[0] : null;
    } catch (error) {
      console.error('Error getting booking payment:', error);
      throw error;
    }
  }
} 