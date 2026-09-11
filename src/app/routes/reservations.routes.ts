import { Routes } from '@angular/router';

import { authGuard } from '../core/guards/auth.guard';

export const reservationRoutes: Routes = [
  {
    path: 'events/:eventId/seats',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        '../features/seat-parking/seat-selection/seat-selection.component'
      ).then(
        component => component.SeatSelectionComponent
      )
  },
  {
    path: 'events/:eventId/parking',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        '../features/seat-parking/parking-selection/parking-selection.component'
      ).then(
        component => component.ParkingSelectionComponent
      )
  }
];
