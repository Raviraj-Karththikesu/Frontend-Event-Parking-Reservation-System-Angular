import { Routes } from '@angular/router';

import { APP_ROLES } from '../core/constants/app-roles';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';

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
  },
  {
    path: 'admin/events/:eventId/seats',
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
        '../features/seat-parking/admin-seat-management/admin-seat-management.component'
      ).then(
        component => component.AdminSeatManagementComponent
      )
  },
  {
    path: 'admin/events/:eventId/parking',
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
        '../features/seat-parking/admin-parking-management/admin-parking-management.component'
      ).then(
        component => component.AdminParkingManagementComponent
      )
  }
];
