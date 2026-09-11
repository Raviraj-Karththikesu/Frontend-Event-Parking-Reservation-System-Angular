import { Routes } from '@angular/router';

import {
  authGuard
} from '../core/guards/auth.guard';

export const systemRoutes: Routes = [
  {
    path: 'forbidden',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        '../shared/pages/forbidden/forbidden.component'
      ).then(
        component => component.ForbiddenComponent
      ),
    title: 'Access Denied | Event Parking'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () =>
      import(
        '../shared/pages/not-found/not-found.component'
      ).then(
        component => component.NotFoundComponent
      ),
    title: 'Page Not Found | Event Parking'
  }
];