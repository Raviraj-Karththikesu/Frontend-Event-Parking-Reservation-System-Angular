import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { PaymentService }
  from '../../services/payment.service';

import { PaymentInfo }
  from '../../models/payment.models';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">

      <div
        class="card"
        *ngIf="paymentInfo; else loadingBlock">

        <h1>Payment</h1>

        <p>
          Booking:
          {{ paymentInfo.bookingNumber
             || paymentInfo.bookingId }}
        </p>

        <div class="amount">

          Rs.
          {{
            amount
            | number:'1.2-2'
          }}

        </div>

        <p>
          Status:
          {{
            paymentInfo.paymentStatus
            || paymentInfo.status
          }}
        </p>

        <p class="error" *ngIf="error">
          {{ error }}
        </p>

        <button
          [disabled]="paying"
          (click)="pay()">

          {{
            paying
            ? 'Processing...'
            : 'Complete Payment'
          }}

        </button>

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
      background:#f5f7fb;
      padding:20px;
    }

    .card {
      width:min(500px,100%);
      background:white;
      padding:30px;
      border-radius:16px;
      text-align:center;
    }

    .amount {
      font-size:32px;
      font-weight:bold;
      margin:25px 0;
    }

    button {
      width:100%;
      padding:14px;
    }

    .error {
      color:#b00020;
    }
  `]
})
export class PaymentComponent
  implements OnInit {

  bookingId = 0;

  paymentInfo?: PaymentInfo;

  paying = false;

  error = '';

  message = 'Loading payment...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {

    this.bookingId =
      Number(
        this.route.snapshot
          .paramMap.get('bookingId')
      );

    this.load();
  }

  get amount(): number {

    return Number(
      this.paymentInfo?.amountDue ??
      this.paymentInfo?.totalAmount ??
      0
    );
  }

  load(): void {

    this.paymentService
      .getBookingPayment(this.bookingId)
      .subscribe({

        next: result => {
          this.paymentInfo = result;
        },

        error: err => {

          this.message =
            err?.error?.message ??
            'Unable to load payment.';
        }
      });
  }

  pay(): void {

    if (!confirm(
      `Confirm payment of Rs. ${this.amount.toFixed(2)}?`
    )) {
      return;
    }

    this.paying = true;

    this.error = '';

    this.paymentService
      .payBooking(this.bookingId)
      .subscribe({

        next: result => {

          this.paying = false;

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

          this.paying = false;

          this.error =
            err?.error?.message ??
            'Payment failed.';
        }
      });
  }
}