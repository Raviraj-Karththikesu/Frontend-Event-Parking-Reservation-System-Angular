export interface PaymentInfo {
  bookingId: number;

  bookingNumber?: string;

  amountDue?: number;
  totalAmount?: number;

  paymentStatus?: string;
  status?: string;
}

export interface PaymentResponse {
  id?: number;

  paymentId?: number;

  bookingId: number;

  amount: number;

  status: string;

  paymentMethod?: string;

  paidAt?: string;
}

export interface PaymentHistoryItem {
  id: number;

  bookingId: number;

  bookingNumber?: string;

  amount: number;

  status: string;

  paidAt?: string;
}

export interface ReceiptResponse {
  id?: number;

  paymentId?: number;

  bookingId?: number;

  bookingNumber?: string;

  customerId?: number;

  eventId?: number;

  customerName?: string;

  eventName?: string;

  seatNumbers?: string[];

  parkingSlotNumber?: string | null;

  seatAmount?: number;

  parkingAmount?: number;

  totalAmount?: number;

  amountPaid?: number;

  paymentStatus?: string;

  paidAt?: string;
}