export type CustomerAccountStatus =
  'Active' | 'Deactivated';

export interface AdminCustomerListItem {
  customerId: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  status: CustomerAccountStatus;
  emailVerified: boolean;
  createdAt: string;
}

export interface CustomerBookingSummary {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  expiredBookings: number;
  activeUpcomingBookings: number;
}

export interface AdminCustomerDetail
  extends AdminCustomerListItem {
  updatedAt: string | null;
  bookingSummary: CustomerBookingSummary;
}

export interface UpdateCustomerStatusRequest {
  status: CustomerAccountStatus;
}