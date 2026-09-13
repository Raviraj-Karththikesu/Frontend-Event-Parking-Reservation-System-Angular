import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

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
  selector: 'app-booking-detail',
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
        *ngIf="booking; else loading">

        <h1>Booking Details</h1>

        <p>
          Booking:
          <strong>
            {{ booking.bookingNumber }}
          </strong>
        </p>

        <p>
          Event:
          {{ booking.eventName || booking.eventId }}
        </p>

        <p>
          Status:
          {{ booking.status | bookingStatus }}
        </p>

        <h2>Seats</h2>

        <ul>
          <li *ngFor="let seat of booking.seats">
            {{ seat.seatNumber }}
            -
            Rs. {{ seat.price | number:'1.2-2' }}
          </li>
        </ul>

        <div *ngIf="booking.parking">

          <h2>Parking</h2>

          <p>
            Slot:
            {{ booking.parking.slotNumber }}
          </p>

          <p>
            Fee:
            Rs.
            {{ booking.parking.fee | number:'1.2-2' }}
          </p>

        </div>

        <p *ngIf="booking.totalAmount != null">

          <strong>
            Total:
            Rs.
            {{ booking.totalAmount | number:'1.2-2' }}
          </strong>

        </p>

        <button
          *ngIf="booking.status === 'Pending'"
          (click)="pay()">

          Pay Now

        </button>

        <button
          *ngIf="
            booking.status === 'Pending'
            || booking.status === 'Confirmed'
          "
          (click)="cancel()">

          Cancel Booking

        </button>

        <a routerLink="/bookings">
          Back to Bookings
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

  .card {
    max-width: 700px;
    margin: 0 auto;
    padding: 32px;

    background: #ffffff;
    color: #111827;

    border-radius: 18px;

    box-shadow:
      0 10px 35px rgba(0, 0, 0, 0.10);
  }

  h1 {
    margin: 0 0 24px;

    color: #111827;

    font-size: 30px;
    font-weight: 700;
  }

  h2 {
    margin-top: 24px;
    margin-bottom: 12px;

    color: #1f2937;

    font-size: 20px;
    font-weight: 700;
  }

  p {
    margin: 10px 0;

    color: #4b5563;

    font-size: 16px;
    line-height: 1.5;
  }

  p strong {
    color: #111827;
  }

  ul {
    margin: 10px 0 20px;
    padding-left: 22px;
  }

  li {
    margin: 8px 0;

    color: #374151;

    font-size: 15px;
  }

  button {
    display: inline-block;

    margin-top: 20px;
    margin-right: 10px;
    padding: 12px 18px;

    border: none;
    border-radius: 9px;

    color: #ffffff;

    font-size: 15px;
    font-weight: 700;

    cursor: pointer;

    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }

  button:first-of-type {
    background: #2563eb;
  }

  button:first-of-type:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  button:last-of-type {
    background: #dc2626;
  }

  button:last-of-type:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }

  a {
    display: inline-block;

    margin-top: 20px;
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
    .card {
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
`]
})
export class BookingDetailComponent
  implements OnInit {

  booking?: BookingResponse;

  bookingId = 0;

  message = 'Loading...';

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

    this.load();
  }

  load(): void {

    this.bookingService
      .getBooking(this.bookingId)
      .subscribe({

        next: result => {
          this.booking = result;
        },

        error: () => {
          this.message =
            'Unable to load booking.';
        }
      });
  }

  pay(): void {

    this.router.navigate([
      '/payment',
      this.bookingId
    ]);
  }

  cancel(): void {

    if (!confirm(
      'Are you sure you want to cancel this booking?'
    )) {
      return;
    }

    this.bookingService
      .cancelBooking(this.bookingId)
      .subscribe({

        next: () => {

          this.router.navigate([
            '/bookings'
          ]);
        },

        error: err => {

          alert(
            err?.error?.message ??
            'Unable to cancel booking.'
          );
        }
      });
  }
}