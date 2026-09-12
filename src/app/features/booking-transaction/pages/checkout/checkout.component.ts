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
      background: #f5f7fb;
    }

    .card {
      max-width: 700px;
      margin: auto;
      padding: 28px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,.08);
    }

    h1 {
      margin-top: 0;
    }

    .section {
      margin: 25px 0;
    }

    .item,
    .total {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #ddd;
    }

    .total {
      font-size: 20px;
      margin-bottom: 20px;
    }

    button {
      width: 100%;
      padding: 13px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: .6;
    }

    .error {
      color: #b00020;
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

        next: booking => {

          this.loading = false;

          this.router.navigate([
            '/booking/success',
            booking.id
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