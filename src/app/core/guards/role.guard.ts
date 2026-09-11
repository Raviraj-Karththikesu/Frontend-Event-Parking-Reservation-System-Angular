import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AppRole
} from '../constants/app-roles';
import {
  AuthService
} from '../services/auth.service';

export const roleGuard: CanActivateFn = (
  route,
  state
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(
      ['/login'],
      {
        queryParams: {
          returnUrl: state.url
        }
      }
    );
  }

  const allowedRoles =
    route.data['roles'] as
      readonly AppRole[] | undefined;

  if (!allowedRoles?.length) {
    return true;
  }

  const currentRole =
    authService.currentUser()?.role;

  if (
    currentRole &&
    allowedRoles.includes(
      currentRole as AppRole
    )
  ) {
    return true;
  }

  return router.createUrlTree([
    '/forbidden'
  ]);
};