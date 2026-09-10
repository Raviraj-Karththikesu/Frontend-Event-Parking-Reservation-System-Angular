import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  HttpErrorResponse
} from '@angular/common/http';
import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';
import {
  finalize
} from 'rxjs';

import {
  AuthService
} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyEmailComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly isVerifying = signal(true);
  readonly verificationSuccessful = signal(false);
  readonly verificationMessage = signal('');
  readonly verificationError = signal('');

  readonly showResendForm = signal(false);
  readonly isResending = signal(false);
  readonly resendMessage = signal('');
  readonly resendError = signal('');

  readonly token =
    this.route.snapshot.queryParamMap
      .get('token')
      ?.trim() ?? '';

  readonly resendForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    })
  });

  get emailControl(): FormControl<string> {
    return this.resendForm.controls.email;
  }

  ngOnInit(): void {
    if (!this.token) {
      this.isVerifying.set(false);
      this.verificationError.set(
        'The verification token is missing.'
      );
      return;
    }

    this.verifyEmail();
  }

  verifyEmail(): void {
    this.isVerifying.set(true);
    this.verificationError.set('');
    this.verificationMessage.set('');

    this.authService
      .verifyEmail(this.token)
      .pipe(
        finalize(() => this.isVerifying.set(false))
      )
      .subscribe({
        next: response => {
          this.verificationSuccessful.set(true);
          this.verificationMessage.set(
            response?.message ??
            'Your email address has been verified successfully.'
          );
        },
        error: (error: HttpErrorResponse) => {
          this.verificationSuccessful.set(false);
          this.verificationError.set(
            this.getVerificationError(error)
          );
        }
      });
  }

  openResendForm(): void {
    this.showResendForm.set(true);
    this.resendMessage.set('');
    this.resendError.set('');
  }

  resendVerification(): void {
    this.resendMessage.set('');
    this.resendError.set('');

    if (this.resendForm.invalid) {
      this.resendForm.markAllAsTouched();
      return;
    }

    const email =
      this.resendForm.controls.email.value.trim();

    this.isResending.set(true);

    this.authService
      .resendVerification(email)
      .pipe(
        finalize(() => this.isResending.set(false))
      )
      .subscribe({
        next: response => {
          this.resendMessage.set(
            response?.message ??
            'A new verification email has been sent.'
          );
        },
        error: (error: HttpErrorResponse) => {
          this.resendError.set(
            this.getResendError(error)
          );
        }
      });
  }

  private getVerificationError(
    error: HttpErrorResponse
  ): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Make sure the backend is running.';
    }

    const message = this.getApiMessage(error);

    if (message) {
      return message;
    }

    if (error.status === 400) {
      return 'The verification link is invalid or has expired.';
    }

    return 'Email verification failed. Please request a new verification link.';
  }

  private getResendError(
    error: HttpErrorResponse
  ): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Make sure the backend is running.';
    }

    return this.getApiMessage(error) ??
      'Unable to send the verification email. Please try again.';
  }

  private getApiMessage(
    error: HttpErrorResponse
  ): string | null {
    const apiError = error.error as {
      message?: string;
      title?: string;
      errors?: Record<string, string[]>;
    } | null;

    if (apiError?.message) {
      return apiError.message;
    }

    if (apiError?.errors) {
      const validationMessages =
        Object.values(apiError.errors).flat();

      if (validationMessages.length > 0) {
        return validationMessages[0];
      }
    }

    return apiError?.title ?? null;
  }
}