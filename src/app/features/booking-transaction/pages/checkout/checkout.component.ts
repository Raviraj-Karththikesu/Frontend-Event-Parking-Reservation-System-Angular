import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { BookingService }
  from '../../services/booking.service';

import {
  CheckoutState,
  CreateBookingRequest
} from '../../models/booking.models';

import { getCurrentCustomerId }
  from '../../utils/auth-context.util';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="card">

        <h1>Booking Checkout</h1>

        <p *ngIf="eventName">
          <strong>Event:</strong>
          {{ eventName }}
        </p>

        <div class="section">

          <h2>Selected Seats</h2>

          <div
            class="item"
            *ngFor="let seat of seats">

            <span>{{ seat.seatNumber }}</span>

            <strong>
              Rs. {{ seat.price | number:'1.2-2' }}
            </strong>

          </div>

          <p *ngIf="seats.length === 0">
            No seats selected.
          </p>

        </div>

        <div class="section">

          <h2>Parking</h2>

          <div *ngIf="parking; else noParking">

            <p>
              Slot:
              <strong>
                {{ parking.slotNumber }}
              </strong>
            </p>

            <p *ngIf="parking.zone">
              Zone: {{ parking.zone }}
            </p>

            <p>
              Fee:
              Rs.
              {{ parking.fee | number:'1.2-2' }}
            </p>

          </div>

          <ng-template #noParking>
            <p>No parking selected.</p>
          </ng-template>

        </div>

        <div class="total">

          <span>Total</span>

          <strong>
            Rs. {{ total | number:'1.2-2' }}
          </strong>

        </div>

        <p class="error" *ngIf="error">
          {{ error }}
        </p>

        <button
          type="button"
          [disabled]="loading || seats.length === 0"
          (click)="createBooking()">

          {{ loading
            ? 'Creating Booking...'
            : 'Confirm Booking' }}

        </button>

      </div>
    </div>
  `,
  styles: [`
  .page {
    min-height: 100vh;
    padding: 40px 16px;
    background: #f4f6fa;
  }

  .card {
    max-width: 760px;
    margin: 0 auto;
    padding: 32px;

    background: #ffffff;
    color: #111827;

    border-radius: 18px;

    box-shadow:
      0 10px 35px rgba(0, 0, 0, 0.10);
  }

  h1 {
    margin: 0 0 28px;
    color: #111827;
    font-size: 30px;
    font-weight: 700;
  }

  h2 {
    margin: 0 0 16px;
    color: #1f2937;
    font-size: 20px;
  }

  p {
    color: #4b5563;
  }

  .section {
    margin: 28px 0;
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 14px 0;

    border-bottom: 1px solid #e5e7eb;

    color: #374151;
  }

  .item span {
    color: #374151;
    font-weight: 500;
  }

  .item strong {
    color: #111827;
    font-weight: 700;
  }

  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: 25px;
    padding: 20px 0;

    border-top: 2px solid #e5e7eb;
    border-bottom: 2px solid #e5e7eb;

    color: #111827;

    font-size: 22px;
    font-weight: 700;
  }

  .total span {
    color: #111827;
  }

  .total strong {
    color: #111827;
    font-size: 24px;
  }

  button {
    display: block;
    width: 100%;

    margin-top: 28px;
    padding: 14px 20px;

    border: none;
    border-radius: 10px;

    background: #2563eb;
    color: #ffffff;

    font-size: 16px;
    font-weight: 700;

    cursor: pointer;

    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }

  button:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  button:disabled {
    background: #9ca3af;
    color: #f9fafb;
    cursor: not-allowed;
    opacity: 0.8;
  }

  .error {
    margin-top: 18px;
    padding: 12px 14px;

    background: #fee2e2;
    color: #b91c1c;

    border-radius: 8px;
  }

  @media (max-width: 600px) {
    .card {
      padding: 22px;
    }

    h1 {
      font-size: 25px;
    }

    .total {
      font-size: 19px;
    }

    .total strong {
      font-size: 20px;
    }
  }
`]
})
export class CheckoutComponent {

  eventId = 0;

  eventName = '';

  seats: CheckoutState['seats'] = [];

  parking: CheckoutState['parking'] = null;

  loading = false;

  error = '';

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {

    const state =
      history.state as CheckoutState;

    this.eventId =
      Number(state?.eventId ?? 0);

    this.eventName =
      state?.eventName ?? '';

    this.seats =
      state?.seats ?? [];

    this.parking =
      state?.parking ?? null;
  }

  get total(): number {

    const seatTotal =
      this.seats.reduce(
        (sum, seat) =>
          sum + Number(seat.price ?? 0),
        0
      );

    const parkingTotal =
      Number(this.parking?.fee ?? 0);

    return seatTotal + parkingTotal;
  }

  createBooking(): void {

    this.error = '';

    const customerId =
      getCurrentCustomerId();

    if (!customerId) {

      this.error =
        'Customer session was not found. Please login again.';

      return;
    }

    if (!this.eventId) {

      this.error =
        'Event information is missing.';

      return;
    }

    if (!this.seats.length) {

      this.error =
        'Please select at least one seat.';

      return;
    }

    const request:
      CreateBookingRequest = {

        customerId,

        eventId: this.eventId,

        seatIds:
          this.seats.map(
            seat => seat.seatId
          ),

        parkingSlotId:
          this.parking?.parkingSlotId ?? null
      };

    if (!confirm(
      'Confirm this booking?'
    )) {
      return;
    }

    this.loading = true;

    this.bookingService
      .createBooking(request)
      .subscribe({

       next: (response: any) => {

  this.loading = false;

  console.log(
    'BOOKING CREATE RESPONSE:',
    response
  );

  const bookingId =
    typeof response === 'number'
      ? response
      : Number(
          response?.id ??
          response?.bookingId ??
          response?.booking?.id ??
          response?.data?.id
        );

  if (!bookingId || Number.isNaN(bookingId)) {

    console.error(
      'Booking created but booking ID was not found:',
      response
    );

    this.error =
      'Booking was created successfully, but the booking ID was not returned in the expected format.';

    return;
  }

  this.router.navigate([
    '/booking/success',
    bookingId
  ]);
},

        error: err => {

          this.loading = false;

          this.error =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to create booking. A seat or parking slot may already have been reserved.';
        }
      });
  }
}