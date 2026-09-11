import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';
import {
  Observable,
  tap
} from 'rxjs';

import {
  API_ENDPOINTS
} from '../constants/api-endpoints';
import {
  APP_ROLES
} from '../constants/app-roles';
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
import {
  ApiService
} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService =
    inject(ApiService);

  private readonly storageKey =
    'eventParkingAuth';

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

  readonly isAdmin = computed(() =>
    this.currentUserState()?.role ===
      APP_ROLES.admin
  );

  readonly isCustomer = computed(() =>
    this.currentUserState()?.role ===
      APP_ROLES.customer
  );

  login(
    request: LoginRequest
  ): Observable<AuthResponse> {
    return this.apiService
      .post<AuthResponse, LoginRequest>(
        API_ENDPOINTS.auth.login,
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
      API_ENDPOINTS.customers.register,
      request
    );
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.apiService.get<CurrentUser>(
      API_ENDPOINTS.auth.currentUser
    );
  }

  getMyProfile(): Observable<CustomerResponse> {
    return this.apiService.get<CustomerResponse>(
      API_ENDPOINTS.customers.currentProfile
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
        API_ENDPOINTS.customers.currentProfile,
        request
      )
      .pipe(
        tap(profile => {
          const session =
            this.currentUserState();

          if (!session) {
            return;
          }

          this.saveSession({
            ...session,
            fullName: profile.fullName,
            email: profile.email,
            role: profile.role,
            status: profile.status,
            emailVerified:
              profile.emailVerified
          });
        })
      );
  }

  verifyEmail(
    token: string
  ): Observable<MessageResponse> {
    return this.apiService.get<MessageResponse>(
      API_ENDPOINTS.auth.verifyEmail,
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
      API_ENDPOINTS.auth.resendVerification,
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
      API_ENDPOINTS.auth.forgotPassword,
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
      API_ENDPOINTS.auth.resetPassword,
      request
    );
  }

  getAccessToken(): string | null {
    if (!this.isLoggedIn()) {
      this.logout();
      return null;
    }

    return (
      this.currentUserState()?.accessToken ??
      null
    );
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

      const expiresAt =
        new Date(user.expiresAt).getTime();

      if (
        !Number.isFinite(expiresAt) ||
        expiresAt <= Date.now()
      ) {
        localStorage.removeItem(
          this.storageKey
        );

        return null;
      }

      return user;
    } catch {
      localStorage.removeItem(
        this.storageKey
      );

      return null;
    }
  }
}