import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import {
  CustomerResponse,
  UpdateCustomerProfileRequest
} from '../../../../core/models/auth.model';
import {
  AuthService
} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  profile: CustomerResponse | null = null;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  readonly profileForm =
    this.formBuilder.nonNullable.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      phoneNumber: [
        '',
        [
          Validators.maxLength(20),
          Validators.pattern(
            /^[+]?[0-9\s()-]{7,20}$/
          )
        ]
      ]
    });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .getMyProfile()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: profile => {
          this.profile = profile;

          this.profileForm.reset({
            fullName: profile.fullName,
            phoneNumber: profile.phoneNumber ?? ''
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
            void this.router.navigate(['/login']);
            return;
          }

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to load your profile.'
            );
        }
      });
  }

  saveProfile(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const fullName =
      this.profileForm.controls.fullName.value.trim();

    if (fullName.length < 2) {
      this.profileForm.controls.fullName.setErrors({
        minlength: true
      });

      this.profileForm.controls.fullName.markAsTouched();
      return;
    }

    const phoneNumber =
      this.profileForm.controls.phoneNumber.value
        .trim();

    const request: UpdateCustomerProfileRequest = {
      fullName,
      phoneNumber: phoneNumber || null
    };

    this.isSaving = true;

    this.authService
      .updateMyProfile(request)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: profile => {
          this.profile = profile;

          this.profileForm.reset({
            fullName: profile.fullName,
            phoneNumber: profile.phoneNumber ?? ''
          });

          this.successMessage =
            'Your profile was updated successfully.';
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to update your profile.'
            );
        }
      });
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  get initials(): string {
    if (!this.profile?.fullName) {
      return 'EP';
    }

    return this.profile.fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  private getErrorMessage(
    error: HttpErrorResponse,
    fallbackMessage: string
  ): string {
    if (error.status === 0) {
      return 'Unable to connect to the server.';
    }

    const apiMessage = error.error?.message;

    return typeof apiMessage === 'string'
      ? apiMessage
      : fallbackMessage;
  }
}