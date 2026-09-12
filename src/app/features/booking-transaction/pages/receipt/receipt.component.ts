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
          Rs.
          {{ receipt.totalAmount | number:'1.2-2' }}
        </h2>

        <p *ngIf="receipt.paidAt">
          Paid:
          {{ receipt.paidAt | date:'medium' }}
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
      padding:40px 16px;
      min-height:100vh;
      background:#f5f7fb;
    }

    .receipt {
      max-width:650px;
      margin:auto;
      background:white;
      padding:35px;
      border-radius:16px;
    }

    button,
    a {
      margin:15px 10px 0 0;
    }

    @media print {
      button,
      a {
        display:none;
      }

      .page {
        background:white;
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
}