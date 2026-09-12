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
      padding:40px 16px;
      background:#f5f7fb;
      min-height:100vh;
    }

    .card {
      max-width:650px;
      margin:auto;
      padding:28px;
      background:white;
      border-radius:16px;
    }

    button,
    a {
      margin:10px 10px 0 0;
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