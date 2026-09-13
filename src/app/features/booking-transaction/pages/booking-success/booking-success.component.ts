import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  BookingService
} from '../../services/booking.service';

import {
  BookingResponse
} from '../../models/booking.models';

import {
  BookingStatusPipe
} from '../../pipes/booking-status.pipe';


@Component({
  selector: 'app-booking-success',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    BookingStatusPipe
  ],

  template: `
    <div class="success-page">

      <div class="success-container">


        <!-- =========================
             LOADING / ERROR STATE
             ========================= -->
        <div
          class="state-card"
          *ngIf="!booking">

          <div
            class="spinner"
            *ngIf="message === 'Loading booking...'">
          </div>

          <div
            class="state-icon state-icon--error"
            *ngIf="message !== 'Loading booking...'">

            !

          </div>

          <div>

            <h2>
              {{
                message === 'Loading booking...'
                  ? 'Loading your booking'
                  : 'Unable to load booking'
              }}
            </h2>

            <p>
              {{ message }}
            </p>

          </div>

        </div>



        <!-- =========================
             BOOKING SUCCESS
             ========================= -->
        <ng-container *ngIf="booking">


          <!-- Progress -->
          <div class="progress-card">

            <div class="progress-step completed">

              <span class="progress-number">
                ✓
              </span>

              <span>
                Event
              </span>

            </div>


            <div class="progress-line completed">
            </div>


            <div class="progress-step completed">

              <span class="progress-number">
                ✓
              </span>

              <span>
                Seats
              </span>

            </div>


            <div class="progress-line completed">
            </div>


            <div class="progress-step completed">

              <span class="progress-number">
                ✓
              </span>

              <span>
                Checkout
              </span>

            </div>


            <div class="progress-line active">
            </div>


            <div class="progress-step active">

              <span class="progress-number">
                4
              </span>

              <span>
                Payment
              </span>

            </div>

          </div>



          <!-- Main Card -->
          <article class="success-card">


            <!-- Success Header -->
            <div class="success-header">

              <div class="success-icon">
                ✓
              </div>


              <div>

                <p class="eyebrow">
                  RESERVATION CREATED
                </p>

                <h1>
                  Your booking is reserved
                </h1>

                <p class="intro">
                  Your seats have been temporarily held.
                  Complete payment before the timer expires
                  to confirm your reservation.
                </p>

              </div>

            </div>



            <!-- Booking Reference -->
            <div class="booking-reference">

              <div>

                <span class="label">
                  Booking reference
                </span>

                <strong class="booking-number">
                  {{ booking.bookingNumber }}
                </strong>

              </div>


              <span
                class="status-badge"
                [class.status-badge--pending]="isPending"
                [class.status-badge--confirmed]="isConfirmed"
                [class.status-badge--expired]="isExpired">

                {{ booking.status | bookingStatus }}

              </span>

            </div>



            <!-- Booking Information -->
            <div class="details-grid">


              <div class="detail-item">

                <span class="detail-label">
                  Event
                </span>

                <strong>
                  {{
                    booking.eventName ||
                    ('Event #' + booking.eventId)
                  }}
                </strong>

              </div>


              <div
                class="detail-item"
                *ngIf="booking.totalAmount != null">

                <span class="detail-label">
                  Booking Total
                </span>

                <strong>
                  Rs.
                  {{
                    booking.totalAmount
                      | number:'1.2-2'
                  }}
                </strong>

              </div>


              <div class="detail-item">

                <span class="detail-label">
                  Booking Status
                </span>

                <strong>
                  {{ booking.status | bookingStatus }}
                </strong>

              </div>


              <div class="detail-item">

                <span class="detail-label">
                  Booking ID
                </span>

                <strong>
                  #{{ bookingId }}
                </strong>

              </div>

            </div>



            <!-- =========================
                 COUNTDOWN
                 ========================= -->
            <div
              class="timer-panel"
              *ngIf="
                isPending &&
                remainingSeconds > 0
              "
              [class.timer-panel--urgent]="
                remainingSeconds <= 300
              ">

              <div class="timer-copy">

                <div class="timer-icon">
                  ◷
                </div>

                <div>

                  <span class="timer-label">
                    Payment hold expires in
                  </span>

                  <p>
                    Complete your payment before
                    this reservation is released.
                  </p>

                </div>

              </div>


              <strong
                class="timer-value"
                aria-live="polite">

                {{ formattedTime }}

              </strong>

            </div>



            <!-- Expired -->
            <div
              class="expired-panel"
              *ngIf="
                isPending &&
                remainingSeconds <= 0
              ">

              <div class="expired-icon">
                !
              </div>

              <div>

                <strong>
                  Booking hold expired
                </strong>

                <p>
                  The temporary reservation period has ended.
                  Please select available seats again to create
                  a new booking.
                </p>

              </div>

            </div>



            <!-- Confirmed -->
            <div
              class="confirmed-panel"
              *ngIf="isConfirmed">

              <div class="confirmed-icon">
                ✓
              </div>

              <div>

                <strong>
                  Booking confirmed
                </strong>

                <p>
                  Your payment has been completed and
                  your reservation is confirmed.
                </p>

              </div>

            </div>



            <!-- =========================
                 ACTIONS
                 ========================= -->
            <div class="actions">


              <button
                type="button"
                class="primary-button"
                *ngIf="
                  isPending &&
                  remainingSeconds > 0
                "
                (click)="payNow()">

                Continue to Payment

                <span>
                  →
                </span>

              </button>


              <a
                routerLink="/bookings"
                class="secondary-button">

                View My Bookings

              </a>

            </div>



            <!-- Security Note -->
            <div
              class="security-note"
              *ngIf="
                isPending &&
                remainingSeconds > 0
              ">

              <div class="security-symbol">
                ✓
              </div>

              <div>

                <strong>
                  Secure payment process
                </strong>

                <p>
                  Your reservation is temporarily protected
                  while you complete payment.
                </p>

              </div>

            </div>


          </article>

        </ng-container>

      </div>

    </div>
  `,


  styles: [`

    :host {
      display: block;
    }


    * {
      box-sizing: border-box;
    }



    /* =========================
       PAGE
       ========================= */

    .success-page {
      min-height: 100vh;

      padding:
        46px
        20px
        72px;

      background:
        linear-gradient(
          180deg,
          #f8fafc 0%,
          #f1f5f9 100%
        );

      color: #0f172a;
    }


    .success-container {
      width: 100%;
      max-width: 760px;

      margin: 0 auto;
    }



    /* =========================
       PROGRESS
       ========================= */

    .progress-card {
      display: flex;

      align-items: flex-start;

      margin-bottom: 22px;
      padding: 18px 22px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 14px;

      background: #ffffff;

      box-shadow:
        0 4px 14px
        rgba(
          15,
          23,
          42,
          0.04
        );
    }


    .progress-step {
      display: flex;

      flex-direction: column;
      align-items: center;

      gap: 6px;

      flex-shrink: 0;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;
    }


    .progress-number {
      display: grid;

      place-items: center;

      width: 29px;
      height: 29px;

      border:
        1px solid
        #cbd5e1;

      border-radius: 50%;

      background: #ffffff;

      font-size: 11px;
      font-weight: 800;
    }


    .progress-step.completed {
      color: #475569;
    }


    .progress-step.completed
    .progress-number {
      border-color: #86efac;

      background: #ecfdf5;

      color: #059669;
    }


    .progress-step.active {
      color: #1d4ed8;
    }


    .progress-step.active
    .progress-number {
      border-color: #2563eb;

      background: #2563eb;

      color: #ffffff;
    }


    .progress-line {
      height: 2px;

      margin:
        14px
        12px
        0;

      flex: 1;

      background: #e2e8f0;
    }


    .progress-line.completed {
      background: #86efac;
    }


    .progress-line.active {
      background:
        linear-gradient(
          90deg,
          #86efac 0%,
          #2563eb 100%
        );
    }



    /* =========================
       MAIN CARD
       ========================= */

    .success-card {
      padding: 34px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 18px;

      background: #ffffff;

      color: #0f172a;

      box-shadow:
        0 12px 35px
        rgba(
          15,
          23,
          42,
          0.08
        );
    }



    /* =========================
       HEADER
       ========================= */

    .success-header {
      display: flex;

      align-items: flex-start;

      gap: 18px;

      padding-bottom: 28px;

      border-bottom:
        1px solid
        #e2e8f0;
    }


    .success-icon {
      display: grid;

      place-items: center;

      width: 54px;
      height: 54px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #ecfdf5;

      color: #059669;

      font-size: 24px;
      font-weight: 900;

      box-shadow:
        inset 0 0 0 1px
        #a7f3d0;
    }


    .eyebrow {
      margin: 2px 0 6px;

      color: #059669;

      font-size: 11px;
      font-weight: 800;

      letter-spacing: 0.14em;

      text-transform: uppercase;
    }


    .success-header h1 {
      margin: 0;

      color: #0f172a;

      font-size: 29px;
      font-weight: 800;

      letter-spacing: -0.025em;
    }


    .intro {
      max-width: 540px;

      margin: 9px 0 0;

      color: #64748b;

      font-size: 14px;

      line-height: 1.65;
    }



    /* =========================
       BOOKING REFERENCE
       ========================= */

    .booking-reference {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 18px;

      margin-top: 26px;
      padding: 18px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 12px;

      background: #f8fafc;
    }


    .label {
      display: block;

      margin-bottom: 5px;

      color: #94a3b8;

      font-size: 11px;
      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: 0.05em;
    }


    .booking-number {
      color: #0f172a;

      font-size: 17px;
      font-weight: 800;

      letter-spacing: 0.015em;
    }



    /* =========================
       STATUS
       ========================= */

    .status-badge {
      display: inline-flex;

      align-items: center;

      padding:
        6px
        10px;

      border-radius: 999px;

      background: #f1f5f9;

      color: #475569;

      font-size: 11px;
      font-weight: 800;
    }


    .status-badge--pending {
      background: #fff7ed;

      color: #c2410c;
    }


    .status-badge--confirmed {
      background: #ecfdf5;

      color: #047857;
    }


    .status-badge--expired {
      background: #fef2f2;

      color: #b91c1c;
    }



    /* =========================
       DETAILS
       ========================= */

    .details-grid {
      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 1px;

      margin-top: 26px;

      overflow: hidden;

      border:
        1px solid
        #e2e8f0;

      border-radius: 12px;

      background: #e2e8f0;
    }


    .detail-item {
      padding: 17px;

      background: #ffffff;
    }


    .detail-label {
      display: block;

      margin-bottom: 6px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;

      letter-spacing: 0.04em;

      text-transform: uppercase;
    }


    .detail-item strong {
      color: #334155;

      font-size: 13px;
      font-weight: 750;
    }



    /* =========================
       TIMER
       ========================= */

    .timer-panel {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 20px;

      margin-top: 26px;
      padding: 18px;

      border:
        1px solid
        #bfdbfe;

      border-radius: 12px;

      background: #eff6ff;
    }


    .timer-copy {
      display: flex;

      align-items: center;

      gap: 12px;
    }


    .timer-icon {
      display: grid;

      place-items: center;

      width: 38px;
      height: 38px;

      flex-shrink: 0;

      border-radius: 10px;

      background: #dbeafe;

      color: #1d4ed8;

      font-size: 18px;
    }


    .timer-label {
      display: block;

      color: #1e40af;

      font-size: 13px;
      font-weight: 800;
    }


    .timer-copy p {
      margin:
        4px
        0
        0;

      color: #64748b;

      font-size: 11px;
    }


    .timer-value {
      flex-shrink: 0;

      color: #1d4ed8;

      font-size: 27px;
      font-weight: 850;

      letter-spacing: 0.02em;

      font-variant-numeric:
        tabular-nums;
    }


    .timer-panel--urgent {
      border-color: #fed7aa;

      background: #fff7ed;
    }


    .timer-panel--urgent
    .timer-icon {
      background: #ffedd5;

      color: #c2410c;
    }


    .timer-panel--urgent
    .timer-label,
    .timer-panel--urgent
    .timer-value {
      color: #c2410c;
    }



    /* =========================
       EXPIRED
       ========================= */

    .expired-panel {
      display: flex;

      gap: 12px;

      margin-top: 26px;
      padding: 17px;

      border:
        1px solid
        #fecaca;

      border-radius: 12px;

      background: #fef2f2;
    }


    .expired-icon {
      display: grid;

      place-items: center;

      width: 34px;
      height: 34px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #fee2e2;

      color: #b91c1c;

      font-weight: 800;
    }


    .expired-panel strong {
      display: block;

      color: #991b1b;

      font-size: 13px;
    }


    .expired-panel p {
      margin:
        4px
        0
        0;

      color: #b91c1c;

      font-size: 11px;

      line-height: 1.5;
    }



    /* =========================
       CONFIRMED
       ========================= */

    .confirmed-panel {
      display: flex;

      gap: 12px;

      margin-top: 26px;
      padding: 17px;

      border:
        1px solid
        #a7f3d0;

      border-radius: 12px;

      background: #ecfdf5;
    }


    .confirmed-icon {
      display: grid;

      place-items: center;

      width: 34px;
      height: 34px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #d1fae5;

      color: #047857;

      font-weight: 800;
    }


    .confirmed-panel strong {
      display: block;

      color: #065f46;

      font-size: 13px;
    }


    .confirmed-panel p {
      margin:
        4px
        0
        0;

      color: #047857;

      font-size: 11px;

      line-height: 1.5;
    }



    /* =========================
       ACTIONS
       ========================= */

    .actions {
      display: flex;

      gap: 12px;

      margin-top: 28px;
    }


    .primary-button,
    .secondary-button {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      min-height: 48px;

      border-radius: 10px;

      font-size: 13px;
      font-weight: 750;

      text-decoration: none;

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
    }


    .primary-button {
      gap: 8px;

      flex: 1;

      border: none;

      background:
        linear-gradient(
          135deg,
          #2563eb 0%,
          #1d4ed8 100%
        );

      color: #ffffff;

      cursor: pointer;

      box-shadow:
        0 8px 20px
        rgba(
          37,
          99,
          235,
          0.20
        );
    }


    .primary-button:hover {
      transform:
        translateY(-1px);

      box-shadow:
        0 11px 24px
        rgba(
          37,
          99,
          235,
          0.26
        );
    }


    .secondary-button {
      padding:
        0
        18px;

      border:
        1px solid
        #cbd5e1;

      background: #ffffff;

      color: #334155;
    }


    .secondary-button:hover {
      border-color: #94a3b8;

      background: #f8fafc;

      transform:
        translateY(-1px);
    }



    /* =========================
       SECURITY
       ========================= */

    .security-note {
      display: flex;

      gap: 10px;

      margin-top: 20px;
      padding: 13px;

      border:
        1px solid
        #d1fae5;

      border-radius: 10px;

      background: #f0fdf4;
    }


    .security-symbol {
      display: grid;

      place-items: center;

      width: 25px;
      height: 25px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #dcfce7;

      color: #15803d;

      font-size: 11px;
      font-weight: 800;
    }


    .security-note strong {
      display: block;

      color: #166534;

      font-size: 11px;
    }


    .security-note p {
      margin:
        3px
        0
        0;

      color: #4b7a5c;

      font-size: 10px;

      line-height: 1.5;
    }



    /* =========================
       LOADING / ERROR
       ========================= */

    .state-card {
      display: flex;

      align-items: center;

      gap: 16px;

      padding: 28px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 16px;

      background: #ffffff;

      color: #0f172a;

      box-shadow:
        0 8px 24px
        rgba(
          15,
          23,
          42,
          0.06
        );
    }


    .state-card h2 {
      margin:
        0
        0
        5px;

      color: #0f172a;

      font-size: 16px;
    }


    .state-card p {
      margin: 0;

      color: #64748b;

      font-size: 13px;
    }


    .spinner {
      width: 34px;
      height: 34px;

      flex-shrink: 0;

      border:
        3px solid
        #dbeafe;

      border-top-color: #2563eb;

      border-radius: 50%;

      animation:
        spin
        0.8s
        linear
        infinite;
    }


    @keyframes spin {

      to {
        transform:
          rotate(360deg);
      }

    }


    .state-icon {
      display: grid;

      place-items: center;

      width: 36px;
      height: 36px;

      flex-shrink: 0;

      border-radius: 50%;
    }


    .state-icon--error {
      background: #fee2e2;

      color: #b91c1c;

      font-weight: 800;
    }



    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 640px) {

      .success-page {
        padding:
          30px
          14px
          50px;
      }


      .success-card {
        padding: 23px;
      }


      .success-header {
        flex-direction: column;
      }


      .success-header h1 {
        font-size: 25px;
      }


      .booking-reference {
        align-items: flex-start;

        flex-direction: column;
      }


      .details-grid {
        grid-template-columns:
          1fr;
      }


      .timer-panel {
        align-items: flex-start;

        flex-direction: column;
      }


      .timer-value {
        font-size: 25px;
      }


      .actions {
        flex-direction: column;
      }


      .secondary-button {
        min-height: 46px;
      }


      .progress-card {
        overflow-x: auto;

        padding:
          16px
          14px;
      }


      .progress-line {
        min-width: 28px;

        margin-left: 7px;
        margin-right: 7px;
      }

    }

  `]
})


export class BookingSuccessComponent
  implements OnInit, OnDestroy {

  booking?:
    BookingResponse;

  bookingId = 0;

  remainingSeconds = 0;

  message =
    'Loading booking...';

  private timer?:
    ReturnType<typeof setInterval>;


  constructor(
    private route:
      ActivatedRoute,

    private router:
      Router,

    private bookingService:
      BookingService
  ) {}


  ngOnInit(): void {

    this.bookingId =
      Number(
        this.route
          .snapshot
          .paramMap
          .get('id')
      );


    if (
      !this.bookingId ||
      Number.isNaN(
        this.bookingId
      )
    ) {

      this.message =
        'Invalid booking reference.';

      return;

    }


    this.loadBooking();

  }



  /* =========================
     STATUS HELPERS
     ========================= */

  get normalizedStatus(): string {

    return String(
      this.booking?.status ?? ''
    )
      .trim()
      .toLowerCase();

  }


  get isPending(): boolean {

    return (
      this.normalizedStatus ===
      'pending'
    );

  }


  get isConfirmed(): boolean {

    return (
      this.normalizedStatus ===
      'confirmed'
    );

  }


  get isExpired(): boolean {

    return (
      this.normalizedStatus ===
      'expired'
    );

  }



  /* =========================
     LOAD BOOKING
     ========================= */

  loadBooking(): void {

    this.message =
      'Loading booking...';


    this.bookingService
      .getBooking(
        this.bookingId
      )
      .subscribe({

        next: booking => {

          this.booking =
            booking;

          this.startTimer();

        },


        error: err => {

          console.error(
            'Unable to load booking:',
            err
          );


          this.message =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to load booking.';

        }

      });

  }



  /* =========================
     TIMER
     ========================= */

  startTimer(): void {

    if (
      this.timer
    ) {

      clearInterval(
        this.timer
      );

      this.timer =
        undefined;

    }


    if (
      !this.booking
    ) {

      return;

    }


    if (
      this.booking
        .remainingHoldSeconds
        !== undefined
      &&
      this.booking
        .remainingHoldSeconds
        !== null
    ) {

      this.remainingSeconds =
        Math.max(
          0,
          Number(
            this.booking
              .remainingHoldSeconds
          )
        );

    }

    else if (
      this.booking
        .holdExpiresAt
    ) {

      const expiry =
        new Date(
          this.booking
            .holdExpiresAt
        )
          .getTime();


      const now =
        Date.now();


      this.remainingSeconds =
        Math.max(
          0,
          Math.floor(
            (
              expiry -
              now
            )
            /
            1000
          )
        );

    }

    else {

      this.remainingSeconds =
        0;

    }


    if (
      this.remainingSeconds <= 0
    ) {

      return;

    }


    this.timer =
      setInterval(
        () => {

          if (
            this.remainingSeconds > 0
          ) {

            this.remainingSeconds--;

          }


          if (
            this.remainingSeconds <= 0
            &&
            this.timer
          ) {

            clearInterval(
              this.timer
            );


            this.timer =
              undefined;


            this.remainingSeconds =
              0;

          }

        },
        1000
      );

  }



  get formattedTime(): string {

    const minutes =
      Math.floor(
        this.remainingSeconds
        /
        60
      );


    const seconds =
      this.remainingSeconds
      %
      60;


    return (
      `${minutes}:`
      +
      seconds
        .toString()
        .padStart(
          2,
          '0'
        )
    );

  }



  /* =========================
     PAYMENT
     ========================= */

  payNow(): void {

    if (
      !this.bookingId ||
      this.remainingSeconds <= 0
    ) {

      return;

    }


    this.router.navigate([
      '/payment',
      this.bookingId
    ]);

  }



  /* =========================
     CLEANUP
     ========================= */

  ngOnDestroy(): void {

    if (
      this.timer
    ) {

      clearInterval(
        this.timer
      );

    }

  }

}