import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { finalize } from 'rxjs';

import {
  AuthService
} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly formBuilder =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  private readonly activatedRoute =
    inject(ActivatedRoute);

  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal('');

  readonly loginForm =
    this.formBuilder.nonNullable.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });

  get emailControl() {
    return this.loginForm.controls.email;
  }

  get passwordControl() {
    return this.loginForm.controls.password;
  }

  togglePassword(): void {
    this.showPassword.update(
      value => !value
    );
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(
        finalize(() =>
          this.isSubmitting.set(false)
        )
      )
      .subscribe({
        next: () => {
          const returnUrl =
            this.activatedRoute.snapshot
              .queryParamMap
              .get('returnUrl');

          void this.router.navigateByUrl(
            this.getRedirectUrl(returnUrl)
          );
        },
        error: (
          error: HttpErrorResponse
        ) => {
          this.errorMessage.set(
            this.getErrorMessage(error)
          );
        }
      });
  }

  private getRedirectUrl(
    returnUrl: string | null
  ): string {
    const isSafeReturnUrl =
      returnUrl?.startsWith('/') &&
      !returnUrl.startsWith('//');

    if (returnUrl && isSafeReturnUrl) {
      return returnUrl;
    }

    if (this.authService.isAdmin()) {
      return '/admin/dashboard';
    }

    return '/dashboard';
  }

  private getErrorMessage(
    error: HttpErrorResponse
  ): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check whether the backend is running.';
    }

    const response =
      error.error as {
        message?: string;
      } | null;

    return response?.message ??
      'Login failed. Please check your email and password.';
  }
}