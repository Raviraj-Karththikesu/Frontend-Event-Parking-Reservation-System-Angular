export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Cancelled'
  | 'Expired';

export interface SelectedSeat {
  seatId: number;
  seatNumber: string;
  price: number;
}

export interface SelectedParking {
  parkingSlotId: number;
  slotNumber: string;
  zone?: string | null;
  fee: number;
}

export interface CreateBookingRequest {
  customerId: number;
  eventId: number;
  seatIds: number[];
  parkingSlotId?: number | null;
}

export interface BookingResponse {
  id?: number;
  bookingId?: number;

  bookingNumber: string;

  customerId: number;
  eventId: number;

  eventName?: string;

  status: BookingStatus | string;

  holdExpiresAt?: string | null;

  remainingHoldSeconds?: number;

  totalAmount?: number;

  createdAt?: string;

  seatIds?: number[];

  parkingSlotId?: number | null;

  seats?: SelectedSeat[];

  parking?: SelectedParking | null;
}

export interface BookingHoldStatus {
  bookingId: number;

  status: string;

  holdExpiresAt?: string | null;

  remainingSeconds?: number;
}

export interface CheckoutState {
  eventId: number;

  eventName?: string;

  seats: SelectedSeat[];

  parking?: SelectedParking | null;
}