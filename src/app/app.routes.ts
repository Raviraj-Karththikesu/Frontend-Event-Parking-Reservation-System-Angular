import { Routes } from '@angular/router';

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
  ...authRoutes,
  ...customerRoutes,
  ...eventRoutes,
  ...reservationRoutes,
  ...bookingRoutes,
  ...systemRoutes
];