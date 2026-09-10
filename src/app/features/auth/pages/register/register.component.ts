import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import {
  RegisterCustomerRequest
} from '../../../../core/models/auth.model';
import {
  AuthService
} from '../../../../core/services/auth.service';

interface ApiErrorResponse {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password =
    control.get('password')?.value as string;

  const confirmPassword =
    control.get('confirmPassword')?.value as string;

  return password === confirmPassword
    ? null
    : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly formBuilder =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly errorMessage = signal('');
  readonly registrationComplete = signal(false);
  readonly registeredEmail = signal('');

  readonly registerForm =
    this.formBuilder.nonNullable.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100)
          ]
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(256)
          ]
        ],
        phoneNumber: [
          '',
          [
            Validators.pattern(
              /^[0-9+\-\s()]{7,20}$/
            )
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
            )
          ]
        ],
        confirmPassword: [
          '',
          [Validators.required]
        ]
      },
      {
        validators: passwordsMatchValidator
      }
    );

  get fullNameControl() {
    return this.registerForm.controls.fullName;
  }

  get emailControl() {
    return this.registerForm.controls.email;
  }

  get phoneNumberControl() {
    return this.registerForm.controls.phoneNumber;
  }

  get passwordControl() {
    return this.registerForm.controls.password;
  }

  get confirmPasswordControl() {
    return this.registerForm.controls.confirmPassword;
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(
      value => !value
    );
  }

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.registerForm.getRawValue();

    const request: RegisterCustomerRequest = {
      fullName: formValue.fullName.trim(),
      email: formValue.email.trim(),
      phoneNumber:
        formValue.phoneNumber.trim() || null,
      password: formValue.password,
      confirmPassword:
        formValue.confirmPassword
    };

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.authService
      .register(request)
      .pipe(
        finalize(() =>
          this.isSubmitting.set(false)
        )
      )
      .subscribe({
        next: () => {
          this.registeredEmail.set(
            request.email
          );

          this.registrationComplete.set(true);
          this.registerForm.reset();
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

  createAnotherAccount(): void {
    this.errorMessage.set('');
    this.registrationComplete.set(false);
    this.registeredEmail.set('');
  }

  private getErrorMessage(
    error: HttpErrorResponse
  ): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check whether the backend is running.';
    }

    const response =
      error.error as ApiErrorResponse | null;

    const validationErrors =
      response?.errors
        ? Object.values(response.errors)
            .flat()
            .join(' ')
        : null;

    return response?.message ??
      validationErrors ??
      response?.title ??
      'Registration failed. Please try again.';
  }
}