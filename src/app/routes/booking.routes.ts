import { Routes } from '@angular/router';

export const bookingRoutes: Routes = [

  {
    path: 'booking/checkout',
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/checkout/checkout.component'
      ).then(
        m => m.CheckoutComponent
      )
  },

  {
    path: 'booking/success/:id',
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/booking-success/booking-success.component'
      ).then(
        m => m.BookingSuccessComponent
      )
  },

  {
    path: 'bookings',
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/booking-history/booking-history.component'
      ).then(
        m => m.BookingHistoryComponent
      )
  },

  {
    path: 'bookings/:id',
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/booking-detail/booking-detail.component'
      ).then(
        m => m.BookingDetailComponent
      )
  },

  {
    path: 'payment/:bookingId',
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/payment/payment.component'
      ).then(
        m => m.PaymentComponent
      )
  },

  {
    path: 'receipt/:paymentId',
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/receipt/receipt.component'
      ).then(
        m => m.ReceiptComponent
      )
  },

  {
    path: 'notifications',
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/notifications/notifications.component'
      ).then(
        m => m.NotificationsComponent
      )
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/customer-dashboard/customer-dashboard.component'
      ).then(
        m => m.CustomerDashboardComponent
      )
  },

  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/admin-dashboard/admin-dashboard.component'
      ).then(
        m => m.AdminDashboardComponent
      )
  }

];