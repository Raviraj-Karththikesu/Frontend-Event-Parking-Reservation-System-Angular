import {
  Routes
} from '@angular/router';

import {
  APP_ROLES
} from '../core/constants/app-roles';
import {
  authGuard
} from '../core/guards/auth.guard';
import {
  roleGuard
} from '../core/guards/role.guard';

export const bookingRoutes: Routes = [
  {
    path: 'booking/checkout',
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        APP_ROLES.customer
      ]
    },
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/checkout/checkout.component'
      ).then(
        component =>
          component.CheckoutComponent
      ),
    title: 'Checkout | Event Parking'
  },
  {
    path: 'booking/success/:id',
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        APP_ROLES.customer
      ]
    },
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/booking-success/booking-success.component'
      ).then(
        component =>
          component.BookingSuccessComponent
      ),
    title: 'Booking Successful | Event Parking'
  },
  {
    path: 'bookings',
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        APP_ROLES.customer
      ]
    },
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/booking-history/booking-history.component'
      ).then(
        component =>
          component.BookingHistoryComponent
      ),
    title: 'My Bookings | Event Parking'
  },
  {
    path: 'bookings/:id',
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        APP_ROLES.customer
      ]
    },
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/booking-detail/booking-detail.component'
      ).then(
        component =>
          component.BookingDetailComponent
      ),
    title: 'Booking Details | Event Parking'
  },
  {
    path: 'payment/:bookingId',
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        APP_ROLES.customer
      ]
    },
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/payment/payment.component'
      ).then(
        component =>
          component.PaymentComponent
      ),
    title: 'Payment | Event Parking'
  },
  {
    path: 'receipt/:paymentId',
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        APP_ROLES.customer
      ]
    },
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/receipt/receipt.component'
      ).then(
        component =>
          component.ReceiptComponent
      ),
    title: 'Payment Receipt | Event Parking'
  },
  {
    path: 'notifications',
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        APP_ROLES.customer
      ]
    },
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/notifications/notifications.component'
      ).then(
        component =>
          component.NotificationsComponent
      ),
    title: 'Notifications | Event Parking'
  },
  {
    path: 'dashboard',
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        APP_ROLES.customer
      ]
    },
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/customer-dashboard/customer-dashboard.component'
      ).then(
        component =>
          component.CustomerDashboardComponent
      ),
    title: 'Dashboard | Event Parking'
  },
  {
    path: 'admin/dashboard',
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        APP_ROLES.admin
      ]
    },
    loadComponent: () =>
      import(
        '../features/booking-transaction/pages/admin-dashboard/admin-dashboard.component'
      ).then(
        component =>
          component.AdminDashboardComponent
      ),
    title: 'Admin Dashboard | Event Parking'
  }
];