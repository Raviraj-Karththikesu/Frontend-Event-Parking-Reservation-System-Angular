export const API_ENDPOINTS = {
  auth: {
    login: 'auth/login',
    currentUser: 'auth/me',
    verifyEmail: 'auth/verify-email',
    resendVerification: 'auth/resend-verification',
    forgotPassword: 'auth/forgot-password',
    resetPassword: 'auth/reset-password'
  },

  customers: {
    root: 'customers',
    register: 'customers/register',
    currentProfile: 'customers/me',
    byId: (customerId: number) =>
      `customers/${customerId}`,
    status: (customerId: number) =>
      `customers/${customerId}/status`,
    reactivate: (customerId: number) =>
      `customers/${customerId}/reactivate`
  },

  venues: {
    root: 'venues',
    byId: (venueId: number) =>
      `venues/${venueId}`,
    availability: 'venues/availability'
  },

  categories: {
    root: 'categories',
    byId: (categoryId: number) =>
      `categories/${categoryId}`
  },

  events: {
    root: 'events',
    byId: (eventId: number) =>
      `events/${eventId}`
  },

  seats: {
    byEvent: (eventId: number) =>
      `events/${eventId}/seats`,
    byId: (eventId: number, seatId: number) =>
      `events/${eventId}/seats/${seatId}`
  },

  parkingSlots: {
    byEvent: (eventId: number) =>
      `events/${eventId}/parkingslots`,
    byId: (
      eventId: number,
      parkingSlotId: number
    ) =>
      `events/${eventId}/parkingslots/${parkingSlotId}`
  },

  bookings: {
    root: 'bookings',
    byId: (bookingId: number) =>
      `bookings/${bookingId}`
  },

  payments: {
    root: 'payments'
  },

  notifications: {
    root: 'notifications'
  },

  dashboard: {
    root: 'dashboard'
  }
} as const;