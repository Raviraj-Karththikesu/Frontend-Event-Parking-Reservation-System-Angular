import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  PaymentService
} from '../../services/payment.service';

import {
  ReceiptResponse
} from '../../models/payment.models';


@Component({
  selector: 'app-receipt',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  template: `
    <div class="receipt-page">

      <div class="receipt-container">


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


          <div class="progress-step completed">

            <span class="step-number">
              ✓
            </span>

            <span>
              Payment
            </span>

          </div>


          <div class="progress-line completed">
          </div>


          <div class="progress-step active">

            <span class="step-number">
              ✓
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
          *ngIf="!receipt">

          <div
            class="spinner"
            *ngIf="message === 'Loading receipt...'">
          </div>


          <div
            class="state-icon"
            *ngIf="message !== 'Loading receipt...'">

            !

          </div>


          <div>

            <h2>

              {{
                message === 'Loading receipt...'
                  ? 'Preparing your receipt'
                  : 'Unable to load receipt'
              }}

            </h2>

            <p>
              {{ message }}
            </p>

          </div>

        </div>



        <!-- =========================
             RECEIPT
             ========================= -->
        <article
          id="receipt"
          class="receipt-card"
          *ngIf="receipt">


          <!-- =========================
               SUCCESS HEADER
               ========================= -->
          <header class="receipt-header">

            <div class="success-icon">
              ✓
            </div>


            <div class="header-copy">

              <p class="eyebrow">
                PAYMENT SUCCESSFUL
              </p>

              <h1>
                Payment Receipt
              </h1>

              <p class="subtitle">
                Your payment has been completed successfully
                and your booking is confirmed.
              </p>

            </div>


            <span
              class="status-badge"
              [class.status-badge--success]="isCompleted">

              {{ displayStatus }}

            </span>

          </header>



          <!-- =========================
               RECEIPT REFERENCE
               ========================= -->
          <section class="reference-section">

            <div>

              <span class="label">
                Payment Reference
              </span>

              <strong>
                #{{ receipt.paymentId || receipt.id || paymentId }}
              </strong>

            </div>


            <div>

              <span class="label">
                Booking Reference
              </span>

              <strong>
                {{
                  receipt.bookingNumber
                  ||
                  ('Booking #' + receipt.bookingId)
                }}
              </strong>

            </div>

          </section>



          <!-- =========================
               RECEIPT DETAILS
               ========================= -->
          <section class="details-section">

            <div class="section-heading">

              <p class="section-eyebrow">
                TRANSACTION DETAILS
              </p>

              <h2>
                Receipt Information
              </h2>

            </div>


            <div class="details-grid">


              <div
                class="detail-item"
                *ngIf="receipt.customerName">

                <span>
                  Customer
                </span>

                <strong>
                  {{ receipt.customerName }}
                </strong>

              </div>


              <div
                class="detail-item"
                *ngIf="receipt.customerId">

                <span>
                  Customer ID
                </span>

                <strong>
                  #{{ receipt.customerId }}
                </strong>

              </div>


              <div
                class="detail-item"
                *ngIf="receipt.eventName">

                <span>
                  Event
                </span>

                <strong>
                  {{ receipt.eventName }}
                </strong>

              </div>


              <div
                class="detail-item"
                *ngIf="receipt.eventId">

                <span>
                  Event ID
                </span>

                <strong>
                  #{{ receipt.eventId }}
                </strong>

              </div>


              <div
                class="detail-item"
                *ngIf="receipt.seatNumbers?.length">

                <span>
                  Seats
                </span>

                <strong>
                  {{ receipt.seatNumbers?.join(', ') }}
                </strong>

              </div>


              <div
                class="detail-item"
                *ngIf="receipt.parkingSlotNumber">

                <span>
                  Parking
                </span>

                <strong>
                  {{ receipt.parkingSlotNumber }}
                </strong>

              </div>


              <div
                class="detail-item"
                *ngIf="receipt.paidAt">

                <span>
                  Paid On
                </span>

                <strong>
                  {{
                    receipt.paidAt
                      | date:'medium'
                  }}
                </strong>

              </div>


              <div
                class="detail-item"
                *ngIf="receipt.paymentStatus">

                <span>
                  Payment Status
                </span>

                <strong class="completed-text">
                  {{ displayStatus }}
                </strong>

              </div>

            </div>

          </section>



          <!-- =========================
               PAYMENT SUMMARY
               ========================= -->
          <section class="payment-summary">

            <div class="summary-copy">

              <p class="section-eyebrow">
                PAYMENT SUMMARY
              </p>

              <h2>
                Amount Paid
              </h2>

              <p>
                Final amount successfully processed
                for this booking.
              </p>

            </div>


            <div class="amount">

              <span>
                LKR
              </span>

              <strong>
                Rs.
                {{
                  receiptTotal
                    | number:'1.2-2'
                }}
              </strong>

            </div>

          </section>



          <!-- =========================
               CONFIRMATION MESSAGE
               ========================= -->
          <section class="confirmation-note">

            <div class="confirmation-icon">
              ✓
            </div>


            <div>

              <strong>
                Booking confirmed
              </strong>

              <p>
                Your payment was completed successfully.
                Your booking information is now available
                under My Bookings.
              </p>

            </div>

          </section>



          <!-- =========================
               ACTIONS
               ========================= -->
          <div class="actions">

            <button
              type="button"
              class="print-button"
              (click)="printReceipt()">

              <span>
                ⎙
              </span>

              Print / Save Receipt

            </button>


            <a
              routerLink="/bookings"
              class="bookings-button">

              My Bookings

              <span>
                →
              </span>

            </a>

          </div>



          <!-- =========================
               FOOTER
               ========================= -->
          <footer class="receipt-footer">

            <div class="footer-brand">

              <strong>
                EventPark
              </strong>

              <span>
                Event & Parking Reservation System
              </span>

            </div>


            <p>
              Please keep this receipt for your records.
            </p>

          </footer>


        </article>

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

    .receipt-page {
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


    .receipt-container {
      width: 100%;
      max-width: 800px;

      margin: 0 auto;
    }



    /* =========================
       PROGRESS
       ========================= */

    .progress-card {
      display: flex;

      align-items: flex-start;

      max-width: 620px;

      margin:
        0
        auto
        24px;

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


    .progress-step.completed,
    .progress-step.active {
      color: #047857;
    }


    .progress-step.completed
    .step-number,
    .progress-step.active
    .step-number {
      border-color: #86efac;

      background: #ecfdf5;

      color: #059669;
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
       RECEIPT CARD
       ========================= */

    .receipt-card {
      overflow: hidden;

      border:
        1px solid
        #e2e8f0;

      border-radius: 18px;

      background: #ffffff;

      color: #0f172a;

      box-shadow:
        0 12px 36px
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

    .receipt-header {
      display: grid;

      grid-template-columns:
        auto
        minmax(0, 1fr)
        auto;

      align-items: flex-start;

      gap: 18px;

      padding: 34px;

      border-bottom:
        1px solid
        #e2e8f0;
    }


    .success-icon {
      display: grid;

      place-items: center;

      width: 52px;
      height: 52px;

      border:
        1px solid
        #a7f3d0;

      border-radius: 50%;

      background: #ecfdf5;

      color: #059669;

      font-size: 23px;
      font-weight: 900;
    }


    .eyebrow,
    .section-eyebrow {
      margin:
        2px
        0
        6px;

      color: #059669;

      font-size: 10px;
      font-weight: 800;

      letter-spacing: 0.14em;

      text-transform: uppercase;
    }


    .receipt-header h1 {
      margin: 0;

      color: #0f172a;

      font-size: 28px;
      font-weight: 800;

      letter-spacing: -0.025em;
    }


    .subtitle {
      max-width: 520px;

      margin:
        8px
        0
        0;

      color: #64748b;

      font-size: 13px;

      line-height: 1.6;
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


    .status-badge--success {
      background: #ecfdf5;

      color: #047857;
    }



    /* =========================
       REFERENCE
       ========================= */

    .reference-section {
      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 1px;

      margin:
        28px
        34px
        0;

      overflow: hidden;

      border:
        1px solid
        #e2e8f0;

      border-radius: 12px;

      background: #e2e8f0;
    }


    .reference-section > div {
      padding: 18px;

      background: #f8fafc;
    }


    .label {
      display: block;

      margin-bottom: 6px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;

      letter-spacing: 0.05em;

      text-transform: uppercase;
    }


    .reference-section strong {
      color: #0f172a;

      font-size: 14px;
      font-weight: 800;
    }



    /* =========================
       DETAILS
       ========================= */

    .details-section {
      padding:
        30px
        34px
        0;
    }


    .section-heading {
      margin-bottom: 18px;
    }


    .section-heading h2,
    .summary-copy h2 {
      margin: 0;

      color: #0f172a;

      font-size: 18px;
      font-weight: 750;
    }


    .details-grid {
      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 12px;
    }


    .detail-item {
      padding: 15px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 10px;

      background: #ffffff;
    }


    .detail-item span {
      display: block;

      margin-bottom: 6px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: 0.04em;
    }


    .detail-item strong {
      color: #334155;

      font-size: 13px;
      font-weight: 750;
    }


    .completed-text {
      color: #047857 !important;
    }



    /* =========================
       PAYMENT SUMMARY
       ========================= */

    .payment-summary {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 24px;

      margin:
        30px
        34px
        0;

      padding: 22px;

      border:
        1px solid
        #bfdbfe;

      border-radius: 13px;

      background:
        linear-gradient(
          135deg,
          #eff6ff 0%,
          #f8fafc 100%
        );
    }


    .summary-copy p:last-child {
      max-width: 350px;

      margin:
        7px
        0
        0;

      color: #64748b;

      font-size: 11px;

      line-height: 1.5;
    }


    .amount {
      flex-shrink: 0;

      text-align: right;
    }


    .amount span {
      display: block;

      margin-bottom: 4px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 800;
    }


    .amount strong {
      display: block;

      color: #0f172a;

      font-size: 27px;
      font-weight: 850;

      letter-spacing: -0.03em;
    }



    /* =========================
       CONFIRMATION
       ========================= */

    .confirmation-note {
      display: flex;

      gap: 12px;

      margin:
        20px
        34px
        0;

      padding: 16px;

      border:
        1px solid
        #a7f3d0;

      border-radius: 11px;

      background: #ecfdf5;
    }


    .confirmation-icon {
      display: grid;

      place-items: center;

      width: 32px;
      height: 32px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #d1fae5;

      color: #047857;

      font-weight: 900;
    }


    .confirmation-note strong {
      display: block;

      color: #065f46;

      font-size: 12px;
    }


    .confirmation-note p {
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

      padding:
        28px
        34px
        32px;
    }


    .print-button,
    .bookings-button {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      gap: 8px;

      min-height: 47px;

      border-radius: 10px;

      font-size: 13px;
      font-weight: 750;

      cursor: pointer;

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
    }


    .print-button {
      flex: 1;

      border: none;

      background:
        linear-gradient(
          135deg,
          #2563eb 0%,
          #1d4ed8 100%
        );

      color: #ffffff;

      box-shadow:
        0 8px 18px
        rgba(
          37,
          99,
          235,
          0.18
        );
    }


    .print-button:hover {
      transform:
        translateY(-1px);

      box-shadow:
        0 11px 23px
        rgba(
          37,
          99,
          235,
          0.24
        );
    }


    .bookings-button {
      padding:
        0
        18px;

      border:
        1px solid
        #cbd5e1;

      background: #ffffff;

      color: #334155;

      text-decoration: none;
    }


    .bookings-button:hover {
      border-color: #94a3b8;

      background: #f8fafc;

      transform:
        translateY(-1px);
    }



    /* =========================
       FOOTER
       ========================= */

    .receipt-footer {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 20px;

      padding:
        19px
        34px;

      border-top:
        1px solid
        #e2e8f0;

      background: #f8fafc;
    }


    .footer-brand strong {
      display: block;

      color: #0f172a;

      font-size: 13px;
    }


    .footer-brand span {
      display: block;

      margin-top: 2px;

      color: #94a3b8;

      font-size: 10px;
    }


    .receipt-footer p {
      margin: 0;

      color: #94a3b8;

      font-size: 10px;
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

      background: #fee2e2;

      color: #b91c1c;

      font-weight: 800;
    }



    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 640px) {

      .receipt-page {
        padding:
          30px
          14px
          50px;
      }


      .receipt-header {
        grid-template-columns:
          auto
          minmax(0, 1fr);

        padding: 24px;
      }


      .receipt-header
      .status-badge {
        grid-column: 2;

        justify-self: flex-start;
      }


      .receipt-header h1 {
        font-size: 24px;
      }


      .reference-section {
        grid-template-columns:
          1fr;

        margin:
          22px
          24px
          0;
      }


      .details-section {
        padding:
          26px
          24px
          0;
      }


      .details-grid {
        grid-template-columns:
          1fr;
      }


      .payment-summary {
        align-items: flex-start;

        flex-direction: column;

        margin:
          26px
          24px
          0;
      }


      .amount {
        text-align: left;
      }


      .confirmation-note {
        margin:
          18px
          24px
          0;
      }


      .actions {
        flex-direction: column;

        padding:
          24px;
      }


      .bookings-button {
        min-height: 47px;
      }


      .receipt-footer {
        align-items: flex-start;

        flex-direction: column;

        padding:
          18px
          24px;
      }

    }



    /* =========================
       PRINT
       ========================= */

    @media print {

      @page {
        margin: 14mm;
      }


      .receipt-page {
        min-height: auto;

        padding: 0;

        background: #ffffff;
      }


      .progress-card,
      .actions {
        display: none !important;
      }


      .receipt-container {
        max-width: none;
      }


      .receipt-card {
        border:
          1px solid
          #d1d5db;

        border-radius: 0;

        box-shadow: none;
      }


      .receipt-header,
      .reference-section,
      .details-section,
      .payment-summary,
      .confirmation-note,
      .receipt-footer {
        break-inside: avoid;
      }


      .receipt-footer {
        background: #ffffff;
      }

    }

  `]
})


export class ReceiptComponent
  implements OnInit {

  paymentId = 0;

  receipt?:
    ReceiptResponse;

  message =
    'Loading receipt...';


  constructor(
    private route:
      ActivatedRoute,

    private paymentService:
      PaymentService
  ) {}


  ngOnInit(): void {

    this.paymentId =
      Number(
        this.route
          .snapshot
          .paramMap
          .get('paymentId')
      );


    if (
      !this.paymentId ||
      Number.isNaN(
        this.paymentId
      )
    ) {

      this.message =
        'Invalid payment reference.';

      return;

    }


    this.loadReceipt();

  }



  /* =========================
     LOAD RECEIPT
     ========================= */

  loadReceipt(): void {

    this.message =
      'Loading receipt...';


    this.paymentService
      .getReceipt(
        this.paymentId
      )
      .subscribe({

        next: result => {

          this.receipt =
            result;

        },


        error: err => {

          console.error(
            'Unable to load receipt:',
            err
          );


          this.message =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to load receipt.';

        }

      });

  }



  /* =========================
     TOTAL
     ========================= */

  get receiptTotal(): number {

    return Number(

      this.receipt
        ?.amountPaid

      ??

      this.receipt
        ?.totalAmount

      ??

      0

    );

  }



  /* =========================
     STATUS
     ========================= */

  get displayStatus(): string {

    const status =
      String(
        this.receipt
          ?.paymentStatus
        ??
        'Completed'
      );


    if (
      status
        .trim()
        .toLowerCase()
        === 'completed'
    ) {

      return 'Completed';

    }


    if (
      status
        .trim()
        .toLowerCase()
        === 'paid'
    ) {

      return 'Completed';

    }


    return status;

  }


  get isCompleted(): boolean {

    const status =
      this.displayStatus
        .toLowerCase();


    return (
      status === 'completed'
      ||
      status === 'paid'
    );

  }



  /* =========================
     PRINT
     ========================= */

  printReceipt(): void {

    window.print();

  }

}