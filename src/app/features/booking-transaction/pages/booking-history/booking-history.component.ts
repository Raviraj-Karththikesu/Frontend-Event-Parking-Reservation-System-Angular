import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink }
  from '@angular/router';

import { BookingService }
  from '../../services/booking.service';

import { BookingResponse }
  from '../../models/booking.models';

import { BookingStatusPipe }
  from '../../pipes/booking-status.pipe';

import { getCurrentCustomerId }
  from '../../utils/auth-context.util';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BookingStatusPipe
  ],
  template: `
    <div class="page">

      <h1>My Bookings</h1>

      <p *ngIf="loading">
        Loading...
      </p>

      <p
        class="error"
        *ngIf="error">
        {{ error }}
      </p>

      <div
        class="booking"
        *ngFor="let booking of bookings">

        <div>

          <h3>
            {{ booking.bookingNumber }}
          </h3>

          <p>
            {{ booking.eventName || ('Event #' + booking.eventId) }}
          </p>

          <p>
            Status:
            {{ booking.status | bookingStatus }}
          </p>

        </div>

        <div class="actions">

          <a
            [routerLink]="[
              '/bookings',
              booking.id
            ]">

            Details

          </a>

          <a
            *ngIf="booking.status === 'Pending'"
            [routerLink]="[
              '/payment',
              booking.id
            ]">

            Pay

          </a>

          <button
            *ngIf="
              booking.status === 'Pending'
              || booking.status === 'Confirmed'
            "
            (click)="cancel(booking)">

            Cancel

          </button>

        </div>

      </div>

      <p
        *ngIf="
          !loading
          && !error
          && bookings.length === 0
        ">

        No bookings found.

      </p>

    </div>
  `,
  styles: [`
    .page {
      max-width:1000px;
      margin:auto;
      padding:35px 16px;
    }

    .booking {
      display:flex;
      justify-content:space-between;
      gap:20px;
      margin:15px 0;
      padding:20px;
      background:#fff;
      border-radius:12px;
      box-shadow:0 3px 15px rgba(0,0,0,.07);
    }

    .actions {
      display:flex;
      align-items:center;
      gap:12px;
    }

    .error {
      color:#b00020;
    }
  `]
})
export class BookingHistoryComponent
  implements OnInit {

  bookings: BookingResponse[] = [];

  loading = true;

  error = '';

  constructor(
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {

    const customerId =
      getCurrentCustomerId();

    if (!customerId) {

      this.loading = false;

      this.error =
        'Customer session not found.';

      return;
    }

    this.loading = true;

    this.bookingService
      .getCustomerBookings(customerId)
      .subscribe({

        next: result => {

          this.bookings = result;

          this.loading = false;
        },

        error: err => {

          this.loading = false;

          this.error =
            err?.error?.message ??
            'Unable to load bookings.';
        }
      });
  }

  cancel(
    booking: BookingResponse
  ): void {

    if (!confirm(
      `Cancel booking ${booking.bookingNumber}?`
    )) {
      return;
    }

    this.bookingService
      .cancelBooking(booking.id)
      .subscribe({

        next: () =>
          this.loadBookings(),

        error: err => {

          alert(
            err?.error?.message ??
            'Unable to cancel booking.'
          );
        }
      });
  }
}