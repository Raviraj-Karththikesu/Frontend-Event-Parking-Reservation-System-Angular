import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

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

      <!-- Loading -->
      <p
        class="loading"
        *ngIf="loading">

        Loading bookings...

      </p>


      <!-- Error -->
      <p
        class="error"
        *ngIf="error">

        {{ error }}

      </p>


      <!-- Booking Cards -->
      <div
        class="booking"
        *ngFor="let booking of bookings">

        <div class="booking-info">

          <h3>
            {{ booking.bookingNumber }}
          </h3>

          <p>
            <strong>Event:</strong>

            {{
              booking.eventName ||
              ('Event #' + booking.eventId)
            }}
          </p>

          <p>
            <strong>Status:</strong>

            {{ booking.status | bookingStatus }}
          </p>

          <p *ngIf="booking.totalAmount != null">
            <strong>Total:</strong>

            Rs.
            {{
              booking.totalAmount
                | number:'1.2-2'
            }}
          </p>

        </div>


        <div class="actions">

          <!-- Details -->
          <a
            *ngIf="getBookingId(booking) !== null"
            [routerLink]="[
              '/bookings',
              getBookingId(booking)
            ]">

            Details

          </a>


          <!-- Payment -->
          <a
            class="pay-button"
            *ngIf="
              booking.status?.toLowerCase() === 'pending'
              &&
              getBookingId(booking) !== null
            "
            [routerLink]="[
              '/payment',
              getBookingId(booking)
            ]">

            Pay Now

          </a>


          <!-- Cancel -->
          <button
            class="cancel-button"
            type="button"
            *ngIf="
              booking.status?.toLowerCase() === 'pending'
              ||
              booking.status?.toLowerCase() === 'confirmed'
            "
            (click)="cancel(booking)">

            Cancel

          </button>

        </div>

      </div>


      <!-- Empty State -->
      <div
        class="empty-state"
        *ngIf="
          !loading
          &&
          !error
          &&
          bookings.length === 0
        ">

        <h2>No bookings found</h2>

        <p>
          You have not created any bookings yet.
        </p>

      </div>

    </div>
  `,

  styles: [`
    .page {
      min-height: 100vh;
      max-width: 1000px;

      margin: 0 auto;
      padding: 40px 16px;

      color: #ffffff;
    }


    h1 {
      margin: 0 0 28px;

      color: #ffffff;

      font-size: 30px;
      font-weight: 700;
    }


    .loading {
      color: #e5e7eb;
      font-size: 16px;
    }


    .booking {
      display: flex;
      justify-content: space-between;
      align-items: center;

      gap: 24px;

      margin: 18px 0;
      padding: 24px 26px;

      background: #ffffff;
      color: #111827;

      border-radius: 14px;

      box-shadow:
        0 5px 20px
        rgba(0, 0, 0, 0.12);
    }


    .booking-info {
      flex: 1;
    }


    .booking h3 {
      margin: 0 0 12px;

      color: #111827;

      font-size: 20px;
      font-weight: 700;
    }


    .booking p {
      margin: 7px 0;

      color: #4b5563;

      font-size: 15px;
    }


    .booking p strong {
      color: #111827;
    }


    .actions {
      display: flex;
      align-items: center;

      gap: 10px;

      flex-wrap: wrap;
    }


    .actions a {
      display: inline-block;

      padding: 10px 16px;

      background: #2563eb;
      color: #ffffff;

      text-decoration: none;

      border-radius: 8px;

      font-weight: 600;

      transition:
        background 0.2s ease,
        transform 0.2s ease;
    }


    .actions a:hover {
      background: #1d4ed8;

      transform:
        translateY(-1px);
    }


    .actions .pay-button {
      background: #059669;
    }


    .actions .pay-button:hover {
      background: #047857;
    }


    .cancel-button {
      padding: 10px 16px;

      border: none;
      border-radius: 8px;

      background: #dc2626;
      color: #ffffff;

      cursor: pointer;

      font-weight: 600;

      transition:
        background 0.2s ease,
        transform 0.2s ease;
    }


    .cancel-button:hover {
      background: #b91c1c;

      transform:
        translateY(-1px);
    }


    .error {
      padding: 14px 16px;

      background: #fee2e2;
      color: #b91c1c;

      border: 1px solid #fecaca;
      border-radius: 10px;

      font-weight: 600;
    }


    .empty-state {
      margin-top: 30px;
      padding: 40px 25px;

      text-align: center;

      background: #ffffff;
      color: #111827;

      border-radius: 14px;

      box-shadow:
        0 5px 20px
        rgba(0, 0, 0, 0.10);
    }


    .empty-state h2 {
      margin: 0 0 10px;

      color: #111827;
    }


    .empty-state p {
      margin: 0;

      color: #6b7280;
    }


    @media (max-width: 700px) {

      .booking {
        flex-direction: column;
        align-items: flex-start;
      }


      .actions {
        width: 100%;
      }


      .actions a,
      .cancel-button {
        flex: 1;

        text-align: center;
      }
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


  /*
   * Backend currently returns bookingId.
   * Some frontend models may use id.
   *
   * This helper supports both.
   */
  getBookingId(
    booking: BookingResponse
  ): number | null {

    const id =
      booking.id ??
      booking.bookingId;

    if (
      id === undefined ||
      id === null
    ) {
      return null;
    }

    const numericId =
      Number(id);

    if (
      Number.isNaN(numericId) ||
      numericId <= 0
    ) {
      return null;
    }

    return numericId;
  }


  loadBookings(): void {

    this.error = '';

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

          this.bookings =
            Array.isArray(result)
              ? result
              : [];

          this.loading = false;
        },


        error: err => {

          this.loading = false;

          this.error =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to load bookings.';
        }
      });
  }


  cancel(
    booking: BookingResponse
  ): void {

    const bookingId =
      this.getBookingId(booking);


    if (!bookingId) {

      alert(
        'Booking ID was not found.'
      );

      return;
    }


    const confirmed =
      confirm(
        `Cancel booking ${booking.bookingNumber}?`
      );


    if (!confirmed) {
      return;
    }


    this.bookingService
      .cancelBooking(bookingId)
      .subscribe({

        next: () => {

          this.loadBookings();
        },


        error: err => {

          alert(
            err?.error?.message ??
            err?.error?.title ??
            'Unable to cancel booking.'
          );
        }
      });
  }
}