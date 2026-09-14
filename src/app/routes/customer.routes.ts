import { Routes } from '@angular/router';

import {
  APP_ROLES
} from '../core/constants/app-roles';
import {
  authGuard
} from '../core/guards/auth.guard';
import {
  roleGuard
} from '../core/guards/role.guard';

export const customerRoutes: Routes = [
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        '../features/customer/pages/profile/profile.component'
      ).then(
        component =>
          component.ProfileComponent
      ),
    title: 'My Profile | Event Parking'
  },
  {
    path: 'admin/customers',
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
        '../features/customer/pages/admin-customer-management/admin-customer-management.component'
      ).then(
        component =>
          component.AdminCustomerManagementComponent
      ),
    title: 'Manage Customers | Event Parking'
  }
];