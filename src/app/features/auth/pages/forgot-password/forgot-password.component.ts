import {
  ChangeDetectionStrategy,
  Component,
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
  RouterLink
} from '@angular/router';
import {
  finalize
} from 'rxjs';

import {
  AuthService
} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly requestSent = signal(false);
  readonly serverMessage = signal('');
  readonly errorMessage = signal('');

  readonly forgotPasswordForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    })
  });

  get emailControl(): FormControl<string> {
    return this.forgotPasswordForm.controls.email;
  }

  submit(): void {
    this.errorMessage.set('');
    this.serverMessage.set('');

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const email =
      this.forgotPasswordForm.controls.email.value.trim();

    this.isSubmitting.set(true);

    this.authService
      .forgotPassword(email)
      .pipe(
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: response => {
          this.requestSent.set(true);
          this.serverMessage.set(
            response?.message ??
            'Password reset instructions have been sent.'
          );
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(
            this.getErrorMessage(error)
          );
        }
      });
  }

  tryAgain(): void {
    this.requestSent.set(false);
    this.serverMessage.set('');
    this.errorMessage.set('');
  }

  private getErrorMessage(
    error: HttpErrorResponse
  ): string {
    if (error.status === 0) {
      return 'Backend server-ஐ connect செய்ய முடியவில்லை. Server run ஆகிறதா check செய்யுங்கள்.';
    }

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

    if (apiError?.title) {
      return apiError.title;
    }

    return 'Request process செய்ய முடியவில்லை. மீண்டும் முயற்சி செய்யுங்கள்.';
  }
}