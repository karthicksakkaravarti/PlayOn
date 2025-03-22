import { PaymentStatus } from './booking';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  UPI = 'upi',
  NET_BANKING = 'net_banking',
  WALLET = 'wallet',
  CASH = 'cash',
  OTHER = 'other'
}

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  MANUAL = 'manual'
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  venueId: string;
  amount: {
    subtotal: number;
    taxes: number;
    fees: number;
    discounts: number;
    total: number;
    currency: string;
  };
  method: PaymentMethod;
  gateway: PaymentGateway;
  status: PaymentStatus;
  gatewayPaymentId?: string; // Payment ID from the payment gateway
  gatewayOrderId?: string; // Order ID from the payment gateway
  transactionId?: string; // Bank transaction ID
  receipt?: string; // Receipt number or URL
  description?: string;
  metadata?: Record<string, any>; // Additional data from payment gateway
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  failureReason?: string;
  refunds?: Refund[];
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  reason: 'cancellation' | 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'other';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  gateway: PaymentGateway;
  gatewayRefundId?: string; // Refund ID from the payment gateway
  metadata?: Record<string, any>; // Additional data from payment gateway
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  failureReason?: string;
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  metadata?: Record<string, any>; // Additional data for the payment
}

export interface PaymentSettings {
  defaultCurrency: string;
  supportedCurrencies: string[];
  paymentGateways: {
    [key in PaymentGateway]?: {
      enabled: boolean;
      apiKey?: string; // For client-side initialization
      merchantId?: string;
      testMode: boolean;
    };
  };
  taxes: {
    enabled: boolean;
    percentage: number;
    name: string;
  };
  serviceFee: {
    enabled: boolean;
    percentage: number;
    name: string;
  };
  commissionRate: number; // Platform commission percentage
} 