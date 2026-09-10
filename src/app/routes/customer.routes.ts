import { Routes } from '@angular/router';

import {
  authGuard
} from '../core/guards/auth.guard';

export const customerRoutes: Routes = [
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        '../features/customer/pages/profile/profile.component'
      ).then(
        component => component.ProfileComponent
      ),
    title: 'My Profile | Event Parking'
  }
];