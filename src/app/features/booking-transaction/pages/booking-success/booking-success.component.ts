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
      min-height:100vh;
      display:grid;
      place-items:center;
      padding:20px;
      background:#f5f7fb;
    }

    .card {
      width:min(550px,100%);
      background:white;
      padding:30px;
      border-radius:16px;
      box-shadow:0 8px 30px rgba(0,0,0,.08);
    }

    .timer {
      padding:15px;
      margin:20px 0;
      border-radius:10px;
      background:#f4f4f4;
      font-size:18px;
    }

    .expired {
      color:#b00020;
    }

    button,
    a {
      display:block;
      margin-top:15px;
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

    if (!this.booking?.holdExpiresAt) {
      return;
    }

    this.updateRemainingTime();

    this.timer = setInterval(
      () => this.updateRemainingTime(),
      1000
    );
  }

  updateRemainingTime(): void {

    if (!this.booking?.holdExpiresAt) {
      return;
    }

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

    if (
      this.remainingSeconds === 0
      && this.timer
    ) {

      clearInterval(this.timer);
    }
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