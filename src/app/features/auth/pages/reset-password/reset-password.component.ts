import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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

const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('newPassword')?.value;
  const confirmPassword =
    control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword
    ? null
    : { passwordMismatch: true };
};

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly isSubmitting = signal(false);
  readonly resetComplete = signal(false);
  readonly showPassword = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  readonly token =
    this.route.snapshot.queryParamMap
      .get('token')
      ?.trim() ?? '';

  readonly tokenMissing = this.token.length === 0;

  readonly resetPasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[a-z]/),
          Validators.pattern(/[0-9]/),
          Validators.pattern(/[^A-Za-z0-9]/)
        ]
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      })
    },
    {
      validators: passwordsMatchValidator
    }
  );

  get newPasswordControl(): FormControl<string> {
    return this.resetPasswordForm.controls.newPassword;
  }

  get confirmPasswordControl(): FormControl<string> {
    return this.resetPasswordForm.controls.confirmPassword;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  submit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.tokenMissing) {
      this.errorMessage.set(
        'The password reset token is missing.'
      );
      return;
    }

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.resetPasswordForm.getRawValue();

    this.isSubmitting.set(true);

    this.authService
      .resetPassword({
        token: this.token,
        newPassword: formValue.newPassword,
        confirmPassword: formValue.confirmPassword
      })
      .pipe(
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: response => {
          this.resetComplete.set(true);
          this.successMessage.set(
            response?.message ??
            'Your password has been reset successfully.'
          );

          this.resetPasswordForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(
            this.getErrorMessage(error)
          );
        }
      });
  }

  private getErrorMessage(
    error: HttpErrorResponse
  ): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Make sure the backend is running.';
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

    if (error.status === 400) {
      return 'The reset link is invalid or has expired.';
    }

    return 'Unable to reset your password. Please try again.';
  }
}