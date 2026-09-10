import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';
import { Observable, tap } from 'rxjs';

import {
  AuthResponse,
  CurrentUser,
  CustomerResponse,
  LoginRequest,
  MessageResponse,
  RegisterCustomerRequest,
  ResetPasswordRequest,
  UpdateCustomerProfileRequest
} from '../models/auth.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly storageKey = 'eventParkingAuth';

  private readonly currentUserState =
    signal<AuthResponse | null>(
      this.readStoredUser()
    );

  readonly currentUser =
    this.currentUserState.asReadonly();

  readonly isLoggedIn = computed(() => {
    const user = this.currentUserState();

    if (!user) {
      return false;
    }

    return new Date(user.expiresAt).getTime() >
      Date.now();
  });

  login(
    request: LoginRequest
  ): Observable<AuthResponse> {
    return this.apiService
      .post<AuthResponse, LoginRequest>(
        'auth/login',
        request
      )
      .pipe(
        tap(response =>
          this.saveSession(response)
        )
      );
  }

  register(
    request: RegisterCustomerRequest
  ): Observable<CustomerResponse> {
    return this.apiService.post<
      CustomerResponse,
      RegisterCustomerRequest
    >(
      'customers/register',
      request
    );
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.apiService.get<CurrentUser>(
      'auth/me'
    );
  }

  getMyProfile(): Observable<CustomerResponse> {
    return this.apiService.get<CustomerResponse>(
      'customers/me'
    );
  }

  updateMyProfile(
    request: UpdateCustomerProfileRequest
  ): Observable<CustomerResponse> {
    return this.apiService
      .put<
        CustomerResponse,
        UpdateCustomerProfileRequest
      >(
        'customers/me',
        request
      )
      .pipe(
        tap(profile => {
          const session = this.currentUserState();

          if (!session) {
            return;
          }

          this.saveSession({
            ...session,
            fullName: profile.fullName,
            email: profile.email,
            role: profile.role,
            status: profile.status,
            emailVerified: profile.emailVerified
          });
        })
      );
  }

  verifyEmail(
    token: string
  ): Observable<MessageResponse> {
    return this.apiService.get<MessageResponse>(
      'auth/verify-email',
      { token }
    );
  }

  resendVerification(
    email: string
  ): Observable<MessageResponse> {
    return this.apiService.post<
      MessageResponse,
      { email: string }
    >(
      'auth/resend-verification',
      { email }
    );
  }

  forgotPassword(
    email: string
  ): Observable<MessageResponse> {
    return this.apiService.post<
      MessageResponse,
      { email: string }
    >(
      'auth/forgot-password',
      { email }
    );
  }

  resetPassword(
    request: ResetPasswordRequest
  ): Observable<MessageResponse> {
    return this.apiService.post<
      MessageResponse,
      ResetPasswordRequest
    >(
      'auth/reset-password',
      request
    );
  }

  getAccessToken(): string | null {
    if (!this.isLoggedIn()) {
      this.logout();
      return null;
    }

    return this.currentUserState()?.accessToken ??
      null;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserState.set(null);
  }

  private saveSession(
    response: AuthResponse
  ): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(response)
    );

    this.currentUserState.set(response);
  }

  private readStoredUser(): AuthResponse | null {
    const storedUser =
      localStorage.getItem(this.storageKey);

    if (!storedUser) {
      return null;
    }

    try {
      const user =
        JSON.parse(storedUser) as AuthResponse;

      if (
        new Date(user.expiresAt).getTime() <=
        Date.now()
      ) {
        localStorage.removeItem(this.storageKey);
        return null;
      }

      return user;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}