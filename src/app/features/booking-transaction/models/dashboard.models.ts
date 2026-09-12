import { BookingResponse } from './booking.models';
import { PaymentHistoryItem } from './payment.models';
import { NotificationResponse } from './notification.models';

export interface CustomerDashboard {
  upcomingBookings: BookingResponse[];

  recentPayments: PaymentHistoryItem[];

  unreadNotifications: NotificationResponse[];

  reservedParkingCount: number;
}

export interface AdminDashboard {
  totalEvents: number;

  totalBookings: number;

  availableSeats: number;

  occupiedParkingSlots: number;

  totalRevenue: number;

  totalCustomers: number;
}