import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { PaymentService }
  from '../../services/payment.service';

import { ReceiptResponse }
  from '../../models/payment.models';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  template: `
    <div class="page">

      <div
        id="receipt"
        class="receipt"
        *ngIf="receipt; else loading">

        <h1>Payment Receipt</h1>

        <p>
          Payment ID:
          {{ receipt.paymentId || receipt.id }}
        </p>

        <p>
          Booking:
          {{ receipt.bookingNumber || receipt.bookingId }}
        </p>

        <p *ngIf="receipt.customerName">
          Customer:
          {{ receipt.customerName }}
        </p>

        <p *ngIf="receipt.eventName">
          Event:
          {{ receipt.eventName }}
        </p>

        <p *ngIf="receipt.seatNumbers?.length">
          Seats:
          {{ receipt.seatNumbers?.join(', ') }}
        </p>

        <p *ngIf="receipt.parkingSlotNumber">
          Parking:
          {{ receipt.parkingSlotNumber }}
        </p>

        <hr>

       <h2>
  Total:
  Rs. {{ receiptTotal | number:'1.2-2' }}
</h2>

        <p *ngIf="receipt.paidAt">
          Paid:
          {{ receipt.paidAt | date:'medium' }}
        </p>
        <p *ngIf="receipt.paymentStatus">
  Payment Status:
  <strong>{{ receipt.paymentStatus }}</strong>
</p>

        <button
          type="button"
          (click)="printReceipt()">

          Print / Save Receipt

        </button>

        <a routerLink="/bookings">
          My Bookings
        </a>

      </div>

      <ng-template #loading>
        <p>{{ message }}</p>
      </ng-template>

    </div>
  `,
styles: [`
  .page {
    min-height: 100vh;
    padding: 40px 16px;

    background: #f4f6fa;
  }

  .receipt {
    max-width: 650px;
    margin: 0 auto;
    padding: 36px;

    background: #ffffff;
    color: #111827;

    border-radius: 18px;

    box-shadow:
      0 10px 35px
      rgba(0, 0, 0, 0.10);
  }

  h1 {
    margin: 0 0 24px;

    color: #111827;

    font-size: 30px;
    font-weight: 700;
  }

  h2 {
    margin-top: 22px;

    color: #111827;

    font-size: 24px;
    font-weight: 700;
  }

  p {
    margin: 10px 0;

    color: #4b5563;

    font-size: 16px;
    line-height: 1.6;
  }

  p strong {
    color: #111827;
  }

  hr {
    margin: 22px 0;

    border: none;
    border-top: 1px solid #e5e7eb;
  }

  button {
    display: inline-block;

    margin-top: 22px;
    margin-right: 12px;
    padding: 12px 18px;

    border: none;
    border-radius: 9px;

    background: #2563eb;
    color: #ffffff;

    font-size: 15px;
    font-weight: 700;

    cursor: pointer;

    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }

  button:hover {
    background: #1d4ed8;

    transform: translateY(-1px);
  }

  a {
    display: inline-block;

    margin-top: 22px;
    padding: 12px 18px;

    border-radius: 9px;

    background: #059669;
    color: #ffffff;

    text-decoration: none;

    font-size: 15px;
    font-weight: 700;

    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }

  a:hover {
    background: #047857;

    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    .receipt {
      padding: 24px;
    }

    h1 {
      font-size: 25px;
    }

    button,
    a {
      width: 100%;
      margin-right: 0;
      text-align: center;
    }
  }

  @media print {
    .page {
      padding: 0;
      background: #ffffff;
    }

    .receipt {
      max-width: none;

      box-shadow: none;

      border-radius: 0;
    }

    button,
    a {
      display: none;
    }
  }
`]
})
export class ReceiptComponent
  implements OnInit {

  paymentId = 0;

  receipt?: ReceiptResponse;

  message = 'Loading receipt...';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {

    this.paymentId =
      Number(
        this.route.snapshot.paramMap
          .get('paymentId')
      );

    this.paymentService
      .getReceipt(this.paymentId)
      .subscribe({

        next: result => {
          this.receipt = result;
        },

        error: () => {
          this.message =
            'Unable to load receipt.';
        }
      });
  }

  printReceipt(): void {
    window.print();
  }
  get receiptTotal(): number {

  return Number(
    this.receipt?.amountPaid ??
    this.receipt?.totalAmount ??
    0
  );
}
}