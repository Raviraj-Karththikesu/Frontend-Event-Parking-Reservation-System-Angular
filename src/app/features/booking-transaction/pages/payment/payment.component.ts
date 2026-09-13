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
    min-height: 100vh;
    display: grid;
    place-items: center;

    padding: 24px;

    background: #f4f6fa;
  }

  .card {
    width: min(500px, 100%);

    padding: 36px 32px;

    background: #ffffff;
    color: #111827;

    border-radius: 18px;

    text-align: center;

    box-shadow:
      0 10px 35px
      rgba(0, 0, 0, 0.10);
  }

  h1 {
    margin: 0 0 20px;

    color: #111827;

    font-size: 30px;
    font-weight: 700;
  }

  p {
    margin: 10px 0;

    color: #4b5563;

    font-size: 16px;
  }

  .amount {
    margin: 28px 0;

    color: #111827;

    font-size: 36px;
    font-weight: 800;
  }

  button {
    width: 100%;

    margin-top: 24px;
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

    opacity: 0.75;
  }

  .error {
    margin-top: 18px;
    padding: 12px 14px;

    background: #fee2e2;
    color: #b91c1c;

    border: 1px solid #fecaca;
    border-radius: 8px;

    font-weight: 600;
  }

  @media (max-width: 600px) {
    .card {
      padding: 28px 22px;
    }

    h1 {
      font-size: 25px;
    }

    .amount {
      font-size: 30px;
    }
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