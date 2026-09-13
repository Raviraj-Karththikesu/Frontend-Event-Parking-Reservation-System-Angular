import {
  Component,
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
  PaymentService
} from '../../services/payment.service';

import {
  PaymentInfo
} from '../../models/payment.models';


@Component({
  selector: 'app-payment',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  template: `
    <div class="payment-page">

      <div class="payment-container">


        <!-- =========================
             PROGRESS
             ========================= -->
        <div class="progress-card">

          <div class="progress-step completed">

            <span class="step-number">
              ✓
            </span>

            <span>
              Booking
            </span>

          </div>


          <div class="progress-line completed">
          </div>


          <div class="progress-step active">

            <span class="step-number">
              2
            </span>

            <span>
              Payment
            </span>

          </div>


          <div class="progress-line">
          </div>


          <div class="progress-step">

            <span class="step-number">
              3
            </span>

            <span>
              Receipt
            </span>

          </div>

        </div>



        <!-- =========================
             LOADING / ERROR
             ========================= -->
        <div
          class="state-card"
          *ngIf="!paymentInfo">

          <div
            class="spinner"
            *ngIf="message === 'Loading payment...'">
          </div>


          <div
            class="state-icon"
            *ngIf="message !== 'Loading payment...'">

            !

          </div>


          <div>

            <h2>

              {{
                message === 'Loading payment...'
                  ? 'Preparing payment'
                  : 'Unable to load payment'
              }}

            </h2>

            <p>
              {{ message }}
            </p>

          </div>

        </div>



        <!-- =========================
             PAYMENT CONTENT
             ========================= -->
        <ng-container *ngIf="paymentInfo">


          <!-- Header -->
          <header class="page-header">

            <div>

              <p class="eyebrow">
                PAYMENT
              </p>

              <h1>
                Complete your payment
              </h1>

              <p class="subtitle">
                Review your booking amount and
                complete payment to confirm your reservation.
              </p>

            </div>


            <a
              routerLink="/bookings"
              class="back-link">

              My Bookings

            </a>

          </header>



          <div class="payment-layout">


            <!-- =========================
                 LEFT SIDE
                 ========================= -->
            <main class="payment-main">


              <!-- Booking Information -->
              <section class="content-card">

                <div class="section-header">

                  <div>

                    <p class="section-eyebrow">
                      BOOKING DETAILS
                    </p>

                    <h2>
                      Reservation Information
                    </h2>

                  </div>


                  <span
                    class="status-badge"
                    [class.status-badge--pending]="!isPaid"
                    [class.status-badge--completed]="isPaid">

                    {{
                      displayStatus
                    }}

                  </span>

                </div>


                <div class="booking-reference">

                  <span>
                    Booking Reference
                  </span>

                  <strong>

                    {{
                      paymentInfo.bookingNumber
                      ||
                      ('Booking #' + paymentInfo.bookingId)
                    }}

                  </strong>

                </div>


                <div class="detail-grid">

                  <div class="detail-item">

                    <span>
                      Booking ID
                    </span>

                    <strong>
                      #{{ bookingId }}
                    </strong>

                  </div>


                  <div class="detail-item">

                    <span>
                      Payment Status
                    </span>

                    <strong>
                      {{ displayStatus }}
                    </strong>

                  </div>

                </div>

              </section>



              <!-- Payment Method -->
              <section class="content-card">

                <div class="section-header">

                  <div>

                    <p class="section-eyebrow">
                      PAYMENT METHOD
                    </p>

                    <h2>
                      Payment Simulation
                    </h2>

                  </div>

                </div>


                <div class="simulation-box">

                  <div class="simulation-icon">
                    ✓
                  </div>


                  <div>

                    <strong>
                      Secure simulated payment
                    </strong>

                    <p>
                      This project uses a simulated payment
                      process. No real card or banking
                      information is required.
                    </p>

                  </div>

                </div>


                <div class="payment-method-row">

                  <div class="method-icon">
                    PAY
                  </div>


                  <div>

                    <span class="method-label">
                      Selected method
                    </span>

                    <strong>
                      EventPark Payment Simulation
                    </strong>

                  </div>


                  <span class="selected-badge">
                    Selected
                  </span>

                </div>

              </section>


            </main>



            <!-- =========================
                 PAYMENT SUMMARY
                 ========================= -->
            <aside class="summary-card">

              <p class="section-eyebrow">
                PAYMENT SUMMARY
              </p>

              <h2>
                Amount Due
              </h2>


              <div class="amount-block">

                <span>
                  Total payment
                </span>

                <strong>
                  Rs.
                  {{
                    amount
                      | number:'1.2-2'
                  }}
                </strong>

                <small>
                  LKR
                </small>

              </div>


              <div class="divider">
              </div>


              <div class="summary-row">

                <span>
                  Booking
                </span>

                <strong>

                  {{
                    paymentInfo.bookingNumber
                    ||
                    paymentInfo.bookingId
                  }}

                </strong>

              </div>


              <div class="summary-row">

                <span>
                  Status
                </span>

                <strong>
                  {{ displayStatus }}
                </strong>

              </div>



              <!-- ERROR -->
              <div
                class="error-box"
                *ngIf="error">

                <div class="error-icon">
                  !
                </div>

                <div>

                  <strong>
                    Payment unsuccessful
                  </strong>

                  <p>
                    {{ error }}
                  </p>

                </div>

              </div>



              <!-- PAY BUTTON -->
              <button
                type="button"
                class="pay-button"
                *ngIf="!isPaid"
                [disabled]="paying || amount <= 0"
                (click)="pay()">


                <span
                  class="button-spinner"
                  *ngIf="paying">
                </span>


                <span>

                  {{
                    paying
                      ? 'Processing payment...'
                      : 'Complete Payment'
                  }}

                </span>

              </button>



              <!-- Already Paid -->
              <div
                class="paid-box"
                *ngIf="isPaid">

                <div class="paid-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    Payment completed
                  </strong>

                  <p>
                    This booking has already been paid.
                  </p>

                </div>

              </div>



              <!-- Security -->
              <div class="security-note">

                <div class="security-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    Secure transaction
                  </strong>

                  <p>
                    Payment status is verified by the
                    EventPark backend before confirmation.
                  </p>

                </div>

              </div>


              <p class="terms-note">
                After successful payment, you will
                automatically continue to your receipt.
              </p>

            </aside>

          </div>

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

    .payment-page {
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


    .payment-container {
      width: 100%;
      max-width: 1050px;

      margin: 0 auto;
    }



    /* =========================
       PROGRESS
       ========================= */

    .progress-card {
      display: flex;

      align-items: flex-start;

      max-width: 700px;

      margin:
        0
        auto
        28px;

      padding:
        18px
        22px;

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


    .step-number {
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
    .step-number {
      border-color: #86efac;

      background: #ecfdf5;

      color: #059669;
    }


    .progress-step.active {
      color: #1d4ed8;
    }


    .progress-step.active
    .step-number {
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



    /* =========================
       HEADER
       ========================= */

    .page-header {
      display: flex;

      align-items: flex-end;
      justify-content: space-between;

      gap: 20px;

      margin-bottom: 28px;
    }


    .eyebrow,
    .section-eyebrow {
      margin:
        0
        0
        7px;

      color: #2563eb;

      font-size: 11px;
      font-weight: 800;

      letter-spacing: 0.14em;

      text-transform: uppercase;
    }


    .page-header h1 {
      margin: 0;

      color: #0f172a;

      font-size: 34px;
      font-weight: 800;

      letter-spacing: -0.03em;
    }


    .subtitle {
      max-width: 620px;

      margin:
        9px
        0
        0;

      color: #64748b;

      font-size: 14px;

      line-height: 1.6;
    }


    .back-link {
      display: inline-flex;

      align-items: center;

      min-height: 40px;

      padding:
        9px
        14px;

      border:
        1px solid
        #cbd5e1;

      border-radius: 9px;

      background: #ffffff;

      color: #334155;

      text-decoration: none;

      font-size: 12px;
      font-weight: 700;
    }


    .back-link:hover {
      background: #f8fafc;

      border-color: #94a3b8;
    }



    /* =========================
       LAYOUT
       ========================= */

    .payment-layout {
      display: grid;

      grid-template-columns:
        minmax(0, 1fr)
        350px;

      align-items: start;

      gap: 22px;
    }


    .payment-main {
      display: flex;

      flex-direction: column;

      gap: 18px;
    }



    /* =========================
       CARDS
       ========================= */

    .content-card,
    .summary-card {
      border:
        1px solid
        #e2e8f0;

      border-radius: 16px;

      background: #ffffff;

      color: #0f172a;

      box-shadow:
        0 5px 18px
        rgba(
          15,
          23,
          42,
          0.045
        );
    }


    .content-card {
      padding: 24px;
    }


    .summary-card {
      position: sticky;

      top: 24px;

      padding: 24px;
    }


    .section-header {
      display: flex;

      align-items: flex-start;
      justify-content: space-between;

      gap: 16px;

      margin-bottom: 20px;
    }


    .section-header h2,
    .summary-card h2 {
      margin: 0;

      color: #0f172a;

      font-size: 19px;
      font-weight: 750;
    }



    /* =========================
       STATUS
       ========================= */

    .status-badge {
      padding:
        6px
        10px;

      border-radius: 999px;

      background: #f1f5f9;

      color: #475569;

      font-size: 10px;
      font-weight: 800;

      text-transform: uppercase;
    }


    .status-badge--pending {
      background: #fff7ed;

      color: #c2410c;
    }


    .status-badge--completed {
      background: #ecfdf5;

      color: #047857;
    }



    /* =========================
       BOOKING DETAILS
       ========================= */

    .booking-reference {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 20px;

      padding: 17px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 11px;

      background: #f8fafc;
    }


    .booking-reference span {
      color: #64748b;

      font-size: 12px;
      font-weight: 700;
    }


    .booking-reference strong {
      color: #0f172a;

      font-size: 14px;
      font-weight: 800;

      text-align: right;
    }


    .detail-grid {
      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 14px;

      margin-top: 16px;
    }


    .detail-item {
      padding: 15px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 10px;
    }


    .detail-item span {
      display: block;

      margin-bottom: 6px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;

      text-transform: uppercase;
    }


    .detail-item strong {
      color: #334155;

      font-size: 13px;
    }



    /* =========================
       SIMULATION
       ========================= */

    .simulation-box {
      display: flex;

      gap: 12px;

      padding: 15px;

      border:
        1px solid
        #bfdbfe;

      border-radius: 11px;

      background: #eff6ff;
    }


    .simulation-icon {
      display: grid;

      place-items: center;

      width: 32px;
      height: 32px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #dbeafe;

      color: #1d4ed8;

      font-weight: 800;
    }


    .simulation-box strong {
      display: block;

      color: #1e3a8a;

      font-size: 12px;
    }


    .simulation-box p {
      margin:
        4px
        0
        0;

      color: #64748b;

      font-size: 11px;

      line-height: 1.5;
    }



    /* =========================
       METHOD
       ========================= */

    .payment-method-row {
      display: grid;

      grid-template-columns:
        auto
        minmax(0, 1fr)
        auto;

      align-items: center;

      gap: 13px;

      margin-top: 16px;
      padding: 16px;

      border:
        1px solid
        #d1fae5;

      border-radius: 11px;

      background: #f8fffb;
    }


    .method-icon {
      display: grid;

      place-items: center;

      width: 44px;
      height: 44px;

      border-radius: 10px;

      background: #ecfdf5;

      color: #047857;

      font-size: 9px;
      font-weight: 800;
    }


    .method-label {
      display: block;

      margin-bottom: 3px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;

      text-transform: uppercase;
    }


    .payment-method-row strong {
      color: #334155;

      font-size: 13px;
    }


    .selected-badge {
      padding:
        5px
        8px;

      border-radius: 999px;

      background: #ecfdf5;

      color: #047857;

      font-size: 10px;
      font-weight: 800;
    }



    /* =========================
       AMOUNT
       ========================= */

    .amount-block {
      margin-top: 22px;

      padding: 20px;

      border-radius: 12px;

      background:
        linear-gradient(
          135deg,
          #eff6ff 0%,
          #f8fafc 100%
        );
    }


    .amount-block span {
      display: block;

      color: #64748b;

      font-size: 11px;
      font-weight: 700;
    }


    .amount-block strong {
      display: block;

      margin-top: 7px;

      color: #0f172a;

      font-size: 30px;
      font-weight: 850;

      letter-spacing: -0.03em;
    }


    .amount-block small {
      display: block;

      margin-top: 3px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;
    }


    .divider {
      height: 1px;

      margin:
        22px
        0;

      background: #e2e8f0;
    }


    .summary-row {
      display: flex;

      justify-content: space-between;

      gap: 16px;

      margin-bottom: 14px;

      color: #64748b;

      font-size: 12px;
    }


    .summary-row strong {
      color: #334155;

      font-weight: 700;

      text-align: right;
    }



    /* =========================
       PAY BUTTON
       ========================= */

    .pay-button {
      display: flex;

      align-items: center;
      justify-content: center;

      gap: 9px;

      width: 100%;

      min-height: 50px;

      margin-top: 24px;

      border: none;

      border-radius: 10px;

      background:
        linear-gradient(
          135deg,
          #2563eb 0%,
          #1d4ed8 100%
        );

      color: #ffffff;

      font-size: 14px;
      font-weight: 750;

      cursor: pointer;

      box-shadow:
        0 8px 20px
        rgba(
          37,
          99,
          235,
          0.20
        );

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        opacity 0.2s ease;
    }


    .pay-button:hover:not(:disabled) {
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


    .pay-button:disabled {
      opacity: 0.55;

      cursor: not-allowed;

      box-shadow: none;
    }


    .button-spinner {
      width: 17px;
      height: 17px;

      border:
        2px solid
        rgba(
          255,
          255,
          255,
          0.45
        );

      border-top-color: #ffffff;

      border-radius: 50%;

      animation:
        spin
        0.75s
        linear
        infinite;
    }


    @keyframes spin {

      to {
        transform:
          rotate(360deg);
      }

    }



    /* =========================
       PAID
       ========================= */

    .paid-box {
      display: flex;

      gap: 11px;

      margin-top: 20px;
      padding: 14px;

      border:
        1px solid
        #a7f3d0;

      border-radius: 10px;

      background: #ecfdf5;
    }


    .paid-icon {
      display: grid;

      place-items: center;

      width: 30px;
      height: 30px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #d1fae5;

      color: #047857;

      font-weight: 800;
    }


    .paid-box strong {
      display: block;

      color: #065f46;

      font-size: 12px;
    }


    .paid-box p {
      margin:
        3px
        0
        0;

      color: #047857;

      font-size: 11px;
    }



    /* =========================
       ERROR
       ========================= */

    .error-box {
      display: flex;

      gap: 10px;

      margin-top: 18px;
      padding: 13px;

      border:
        1px solid
        #fecaca;

      border-radius: 10px;

      background: #fff7f7;
    }


    .error-icon {
      display: grid;

      place-items: center;

      width: 27px;
      height: 27px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #fee2e2;

      color: #b91c1c;

      font-size: 11px;
      font-weight: 800;
    }


    .error-box strong {
      display: block;

      color: #991b1b;

      font-size: 11px;
    }


    .error-box p {
      margin:
        3px
        0
        0;

      color: #b91c1c;

      font-size: 10px;

      line-height: 1.5;
    }



    /* =========================
       SECURITY
       ========================= */

    .security-note {
      display: flex;

      gap: 10px;

      margin-top: 18px;
      padding: 13px;

      border:
        1px solid
        #d1fae5;

      border-radius: 10px;

      background: #f0fdf4;
    }


    .security-icon {
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


    .terms-note {
      margin:
        14px
        0
        0;

      color: #94a3b8;

      font-size: 10px;

      line-height: 1.5;

      text-align: center;
    }



    /* =========================
       STATE
       ========================= */

    .state-card {
      display: flex;

      align-items: center;

      gap: 16px;

      max-width: 620px;

      margin: 0 auto;

      padding: 28px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 16px;

      background: #ffffff;

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


    .state-icon {
      display: grid;

      place-items: center;

      width: 36px;
      height: 36px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #fee2e2;

      color: #b91c1c;

      font-weight: 800;
    }



    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 850px) {

      .payment-layout {
        grid-template-columns:
          1fr;
      }


      .summary-card {
        position: static;
      }

    }


    @media (max-width: 640px) {

      .payment-page {
        padding:
          30px
          14px
          50px;
      }


      .page-header {
        align-items: flex-start;

        flex-direction: column;
      }


      .page-header h1 {
        font-size: 28px;
      }


      .back-link {
        width: 100%;

        justify-content: center;
      }


      .content-card,
      .summary-card {
        padding: 19px;
      }


      .detail-grid {
        grid-template-columns:
          1fr;
      }


      .booking-reference {
        align-items: flex-start;

        flex-direction: column;
      }


      .booking-reference strong {
        text-align: left;
      }


      .progress-card {
        padding:
          16px
          14px;
      }

    }

  `]
})


export class PaymentComponent
  implements OnInit {

  bookingId = 0;

  paymentInfo?:
    PaymentInfo;

  paying = false;

  error = '';

  message =
    'Loading payment...';


  constructor(
    private route:
      ActivatedRoute,

    private router:
      Router,

    private paymentService:
      PaymentService
  ) {}


  ngOnInit(): void {

    this.bookingId =
      Number(
        this.route
          .snapshot
          .paramMap
          .get('bookingId')
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


    this.load();

  }



  /* =========================
     AMOUNT
     ========================= */

  get amount(): number {

    return Number(

      this.paymentInfo
        ?.amountDue

      ??

      this.paymentInfo
        ?.totalAmount

      ??

      0

    );

  }



  /* =========================
     STATUS
     ========================= */

  get rawStatus(): string {

    return String(

      this.paymentInfo
        ?.paymentStatus

      ??

      this.paymentInfo
        ?.status

      ??

      'NotPaid'

    );

  }


  get normalizedStatus(): string {

    return this.rawStatus
      .trim()
      .toLowerCase();

  }


  get isPaid(): boolean {

    return (
      this.normalizedStatus ===
        'completed'
      ||
      this.normalizedStatus ===
        'paid'
    );

  }


  get displayStatus(): string {

    if (this.isPaid) {
      return 'Completed';
    }


    if (
      this.normalizedStatus ===
        'notpaid'
      ||
      this.normalizedStatus ===
        'pending'
    ) {

      return 'Payment Pending';

    }


    return this.rawStatus;

  }



  /* =========================
     LOAD PAYMENT
     ========================= */

  load(): void {

    this.message =
      'Loading payment...';


    this.paymentService
      .getBookingPayment(
        this.bookingId
      )
      .subscribe({

        next: result => {

          this.paymentInfo =
            result;

        },


        error: err => {

          console.error(
            'Unable to load payment:',
            err
          );


          this.message =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to load payment.';

        }

      });

  }



  /* =========================
     PAY
     ========================= */

  pay(): void {

    if (
      this.paying ||
      this.isPaid ||
      this.amount <= 0
    ) {

      return;

    }


    const confirmed =
      confirm(
        `Confirm payment of Rs. ${this.amount.toFixed(2)}?`
      );


    if (!confirmed) {
      return;
    }


    this.paying = true;

    this.error = '';


    this.paymentService
      .payBooking(
        this.bookingId
      )
      .subscribe({

        next: result => {

          this.paying =
            false;


          const paymentId =
            result.id ??
            result.paymentId;


          if (paymentId) {

            this.router.navigate([
              '/receipt',
              paymentId
            ]);

            return;

          }


          this.router.navigate([
            '/booking/success',
            this.bookingId
          ]);

        },


        error: err => {

          this.paying =
            false;


          console.error(
            'Payment failed:',
            err
          );


          this.error =
            err?.error?.message ??
            err?.error?.title ??
            'Payment could not be completed. Please try again.';

        }

      });

  }

}