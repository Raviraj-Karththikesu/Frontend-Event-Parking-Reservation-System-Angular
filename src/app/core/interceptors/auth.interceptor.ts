import { HttpInterceptorFn } from '@angular/common/http';

import { AuthResponse } from '../models/auth.model';

const STORAGE_KEY = 'eventParkingAuth';

export const authInterceptor: HttpInterceptorFn = (
  request,
  next
) => {
  const storedSession =
    localStorage.getItem(STORAGE_KEY);

  if (!storedSession) {
    return next(request);
  }

  try {
    const session =
      JSON.parse(storedSession) as AuthResponse;

    const isExpired =
      new Date(session.expiresAt).getTime() <=
      Date.now();

    if (isExpired || !session.accessToken) {
      localStorage.removeItem(STORAGE_KEY);
      return next(request);
    }

    const authorizedRequest = request.clone({
      setHeaders: {
        Authorization:
          `${session.tokenType || 'Bearer'} ` +
          session.accessToken
      }
    });

    return next(authorizedRequest);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return next(request);
  }
};