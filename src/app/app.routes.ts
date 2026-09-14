import {
  Routes
} from '@angular/router';

import {
  authRoutes
} from './routes/auth.routes';
import {
  bookingRoutes
} from './routes/booking.routes';
import {
  customerRoutes
} from './routes/customer.routes';
import {
  eventRoutes
} from './routes/events.routes';
import {
  reservationRoutes
} from './routes/reservations.routes';
import {
  systemRoutes
} from './routes/system.routes';

export const routes: Routes = [
  // Authentication pages use their own
  // full-screen layout.
  ...authRoutes,

  // All application pages use the shared
  // Navbar, main content area and Footer.
  {
    path: '',
    loadComponent: () =>
      import(
        './shared/layouts/app-shell/app-shell.component'
      ).then(
        component =>
          component.AppShellComponent
      ),
    children: [
      ...eventRoutes,
      ...customerRoutes,
      ...reservationRoutes,
      ...bookingRoutes,
      ...systemRoutes
    ]
  }
];