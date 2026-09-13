import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { BookingService }
  from '../../services/booking.service';

import { BookingResponse }
  from '../../models/booking.models';

import { BookingStatusPipe }
  from '../../pipes/booking-status.pipe';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BookingStatusPipe
  ],
  template: `
    <div class="page">

      <div
        class="card"
        *ngIf="booking; else loadingBlock">

        <h1>Booking Created</h1>

        <p>
          Booking Number:
          <strong>
            {{ booking.bookingNumber }}
          </strong>
        </p>

        <p>
          Status:
          <strong>
            {{ booking.status | bookingStatus }}
          </strong>
        </p>

        <div
          class="timer"
          *ngIf="
            booking.status === 'Pending'
            && remainingSeconds > 0
          ">

          Payment hold expires in:

          <strong>
            {{ formattedTime }}
          </strong>

        </div>

        <p
          class="expired"
          *ngIf="
            booking.status === 'Pending'
            && remainingSeconds <= 0
          ">

          This booking hold has expired.

        </p>

        <button
          *ngIf="
            booking.status === 'Pending'
            && remainingSeconds > 0
          "
          (click)="payNow()">

          Pay Now

        </button>

        <a routerLink="/bookings">
          View My Bookings
        </a>

      </div>

      <ng-template #loadingBlock>
        <p>{{ message }}</p>
      </ng-template>

    </div>
  `,
 styles: [`
  .page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;

    background: #f4f6fa;
  }

  .card {
    width: min(560px, 100%);
    padding: 32px;

    background: #ffffff;
    color: #111827;

    border-radius: 18px;

    box-shadow:
      0 10px 35px rgba(0, 0, 0, 0.10);
  }

  h1 {
    margin: 0 0 22px;

    color: #111827;

    font-size: 30px;
    font-weight: 700;
  }

  p {
    margin: 10px 0;

    color: #4b5563;

    font-size: 16px;
  }

  p strong {
    color: #111827;
  }

  .timer {
    margin: 22px 0;
    padding: 16px 18px;

    background: #eff6ff;
    color: #1e3a8a;

    border: 1px solid #bfdbfe;
    border-radius: 10px;

    font-size: 18px;
  }

  .timer strong {
    color: #1d4ed8;
  }

  .expired {
    margin: 20px 0;
    padding: 14px 16px;

    background: #fee2e2;
    color: #b91c1c;

    border: 1px solid #fecaca;
    border-radius: 10px;

    font-weight: 600;
  }

  button {
    width: 100%;

    margin-top: 18px;
    padding: 14px 18px;

    border: none;
    border-radius: 10px;

    background: #2563eb;
    color: #ffffff;

    font-size: 16px;
    font-weight: 700;

    cursor: pointer;
  }

  button:hover {
    background: #1d4ed8;
  }

  a {
    display: inline-block;

    margin-top: 18px;

    color: #2563eb;

    text-decoration: none;
    font-weight: 600;
  }

  a:hover {
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    .card {
      padding: 24px;
    }

    h1 {
      font-size: 25px;
    }
  }
`]
})
export class BookingSuccessComponent
  implements OnInit, OnDestroy {

  booking?: BookingResponse;

  bookingId = 0;

  remainingSeconds = 0;

  message = 'Loading booking...';

  private timer?: ReturnType<typeof setInterval>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {

    this.bookingId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.loadBooking();
  }

  loadBooking(): void {

    this.bookingService
      .getBooking(this.bookingId)
      .subscribe({

        next: booking => {

          this.booking = booking;

          this.startTimer();
        },

        error: () => {

          this.message =
            'Unable to load booking.';
        }
      });
  }

  startTimer(): void {

  if (!this.booking) {
    return;
  }

  // Prefer server-calculated remaining time.
  // This avoids browser/server clock differences.
  if (
    this.booking.remainingHoldSeconds !== undefined &&
    this.booking.remainingHoldSeconds !== null
  ) {

    this.remainingSeconds =
      Math.max(
        0,
        Number(
          this.booking.remainingHoldSeconds
        )
      );

  } else if (this.booking.holdExpiresAt) {

    const expiry =
      new Date(
        this.booking.holdExpiresAt
      ).getTime();

    const now =
      Date.now();

    this.remainingSeconds =
      Math.max(
        0,
        Math.floor(
          (expiry - now) / 1000
        )
      );
  }

  if (this.remainingSeconds <= 0) {
    return;
  }

  this.timer = setInterval(() => {

    if (this.remainingSeconds > 0) {

      this.remainingSeconds--;

    }

    if (
      this.remainingSeconds <= 0 &&
      this.timer
    ) {

      clearInterval(this.timer);

      this.remainingSeconds = 0;
    }

  }, 1000);
}

  get formattedTime(): string {

    const minutes =
      Math.floor(
        this.remainingSeconds / 60
      );

    const seconds =
      this.remainingSeconds % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  payNow(): void {

    this.router.navigate([
      '/payment',
      this.bookingId
    ]);
  }

  ngOnDestroy(): void {

    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}