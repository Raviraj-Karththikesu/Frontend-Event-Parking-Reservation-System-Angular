import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { GenerateSeatMapRequest } from '../models/generate-seat-map-request';
import { Seat } from '../models/seat';
import { UpdateSeatRequest } from '../models/update-seat-request';
import { SeatService } from '../seat-selection/services/seat.service';

@Component({
  selector: 'app-admin-seat-management',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin-seat-management.component.html',
  styleUrl: './admin-seat-management.component.scss'
})
export class AdminSeatManagementComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seatService = inject(SeatService);
  private readonly formBuilder = inject(FormBuilder);

  eventId: number | null = null;

  seats: Seat[] = [];

  isLoading = false;

  errorMessage = '';

  successMessage = '';

  editingSeatId: number | null = null;

  readonly generateForm = this.formBuilder.group({
    rows: [
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(100)
      ]
    ],
    columns: [
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(100)
      ]
    ],
    seatType: ['Standard'],
    price: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ]
  });

  readonly editForm = this.formBuilder.group({
    seatNumber: [
      '',
      [
        Validators.required
      ]
    ],
    rowLabel: [''],
    seatType: [''],
    price: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ]
  });

  ngOnInit(): void {
    const routeEventId =
      Number(this.route.snapshot.paramMap.get('eventId'));

    if (!Number.isInteger(routeEventId) || routeEventId <= 0) {
      this.errorMessage = 'A valid event ID is required.';
      return;
    }

    this.eventId = routeEventId;

    this.loadSeats();
  }

  loadSeats(): void {
    if (this.eventId === null) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.seatService
      .getSeatsByEvent(this.eventId)
      .subscribe({
        next: seats => {
          this.seats = seats;
          this.isLoading = false;
        },
        error: error => {
          this.seats = [];
          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to load seats.'
          );
          this.isLoading = false;
        }
      });
  }

  generateSeatMap(): void {
    if (
      this.eventId === null ||
      this.generateForm.invalid
    ) {
      this.generateForm.markAllAsTouched();
      return;
    }

    const formValue = this.generateForm.getRawValue();

    const request: GenerateSeatMapRequest = {
      rows: formValue.rows ?? 1,
      columns: formValue.columns ?? 1,
      seatType: formValue.seatType || null,
      price: formValue.price ?? 0
    };

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.seatService
      .generateSeatMap(this.eventId, request)
      .subscribe({
        next: seats => {
          this.seats = seats;
          this.successMessage =
            'Seat map generated successfully.';
          this.isLoading = false;
        },
        error: error => {
          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to generate seat map.'
          );
          this.isLoading = false;
        }
      });
  }

  startEdit(seat: Seat): void {
    this.editingSeatId = seat.id;

    this.editForm.setValue({
      seatNumber: seat.seatNumber,
      rowLabel: seat.rowLabel ?? '',
      seatType: seat.seatType ?? '',
      price: seat.price
    });

    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.editingSeatId = null;
    this.editForm.reset({
      seatNumber: '',
      rowLabel: '',
      seatType: '',
      price: 0
    });
  }

  saveSeat(): void {
    if (
      this.eventId === null ||
      this.editingSeatId === null ||
      this.editForm.invalid
    ) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValue = this.editForm.getRawValue();

    const request: UpdateSeatRequest = {
      seatNumber: formValue.seatNumber ?? '',
      rowLabel: formValue.rowLabel || null,
      seatType: formValue.seatType || null,
      price: formValue.price ?? 0
    };

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.seatService
      .updateSeat(
        this.eventId,
        this.editingSeatId,
        request
      )
      .subscribe({
        next: updatedSeat => {
          this.seats = this.seats.map(seat =>
            seat.id === updatedSeat.id
              ? updatedSeat
              : seat
          );

          this.successMessage =
            'Seat updated successfully.';

          this.isLoading = false;
          this.cancelEdit();
        },
        error: error => {
          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to update seat.'
          );
          this.isLoading = false;
        }
      });
  }

  deleteSeat(seat: Seat): void {
    if (
      this.eventId === null ||
      !confirm(
        `Delete seat ${seat.seatNumber}?`
      )
    ) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.seatService
      .deleteSeat(this.eventId, seat.id)
      .subscribe({
        next: () => {
          this.seats = this.seats.filter(
            currentSeat => currentSeat.id !== seat.id
          );

          this.successMessage =
            'Seat deleted successfully.';

          this.isLoading = false;
        },
        error: error => {
          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to delete seat.'
          );
          this.isLoading = false;
        }
      });
  }
}
