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
  BookingService
} from '../../services/booking.service';

import {
  BookingResponse
} from '../../models/booking.models';

import {
  BookingStatusPipe
} from '../../pipes/booking-status.pipe';


@Component({
  selector: 'app-booking-detail',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    BookingStatusPipe
  ],

  template: `
    <div class="booking-page">

      <div class="booking-container">


        <!-- =========================
             PAGE HEADER
             ========================= -->
        <header
          class="page-header"
          *ngIf="booking">

          <div>

            <p class="eyebrow">
              MY BOOKINGS
            </p>

            <h1>
              Booking Details
            </h1>

            <p class="subtitle">
              Review your event reservation,
              selected seats, parking and payment information.
            </p>

          </div>


          <a
            routerLink="/bookings"
            class="back-button">

            ← Back to Bookings

          </a>

        </header>



        <!-- =========================
             LOADING / ERROR
             ========================= -->
        <div
          class="state-card"
          *ngIf="!booking">

          <div
            class="spinner"
            *ngIf="message === 'Loading booking...'">
          </div>


          <div
            class="state-icon"
            *ngIf="message !== 'Loading booking...'">

            !

          </div>


          <div class="state-content">

            <h2>

              {{
                message === 'Loading booking...'
                  ? 'Loading booking details'
                  : 'Unable to load booking'
              }}

            </h2>

            <p>
              {{ message }}
            </p>


            <button
              type="button"
              class="retry-button"
              *ngIf="message !== 'Loading booking...'"
              (click)="load()">

              Try Again

            </button>

          </div>

        </div>



        <!-- =========================
             BOOKING CONTENT
             ========================= -->
        <ng-container *ngIf="booking">


          <!-- BOOKING OVERVIEW -->
          <section class="overview-card">

            <div class="overview-top">

              <div>

                <span class="label">
                  Booking Reference
                </span>

                <strong class="booking-number">
                  {{ booking.bookingNumber }}
                </strong>

              </div>


              <span
                class="status-badge"
                [class.status-pending]="isPending"
                [class.status-confirmed]="isConfirmed"
                [class.status-cancelled]="isCancelled"
                [class.status-expired]="isExpired">

                {{ booking.status | bookingStatus }}

              </span>

            </div>


            <div class="overview-grid">


              <div class="overview-item">

                <span>
                  Event
                </span>

                <strong>
                  {{
                    booking.eventName
                    ||
                    ('Event #' + booking.eventId)
                  }}
                </strong>

              </div>


              <div class="overview-item">

                <span>
                  Booking ID
                </span>

                <strong>
                  #{{ bookingId }}
                </strong>

              </div>


              <div
                class="overview-item"
                *ngIf="booking.createdAt">

                <span>
                  Created On
                </span>

                <strong>
                  {{
                    booking.createdAt
                      | date:'medium'
                  }}
                </strong>

              </div>


              <div class="overview-item">

                <span>
                  Status
                </span>

                <strong>
                  {{ booking.status | bookingStatus }}
                </strong>

              </div>

            </div>

          </section>



          <!-- MAIN GRID -->
          <div class="booking-layout">


            <!-- =========================
                 LEFT CONTENT
                 ========================= -->
            <main class="booking-main">


              <!-- SEATS -->
              <section class="content-card">

                <div class="section-header">

                  <div>

                    <p class="section-eyebrow">
                      RESERVATION
                    </p>

                    <h2>
                      Selected Seats
                    </h2>

                  </div>


                  <span class="count-badge">

                    {{ booking.seats?.length || 0 }}

                    {{
                      (booking.seats?.length || 0) === 1
                        ? 'seat'
                        : 'seats'
                    }}

                  </span>

                </div>


                <div
                  class="seat-list"
                  *ngIf="
                    booking.seats &&
                    booking.seats.length > 0
                  ">

                  <div
                    class="seat-row"
                    *ngFor="let seat of booking.seats">

                    <div class="seat-info">

                      <div class="seat-icon">
                        {{ seat.seatNumber }}
                      </div>


                      <div>

                        <span class="item-label">
                          Seat
                        </span>

                        <strong>
                          {{ seat.seatNumber }}
                        </strong>

                      </div>

                    </div>


                    <strong class="price">

                      Rs.
                      {{
                        seat.price
                          | number:'1.2-2'
                      }}

                    </strong>

                  </div>

                </div>


                <div
                  class="empty-box"
                  *ngIf="
                    !booking.seats ||
                    booking.seats.length === 0
                  ">

                  <div class="empty-icon">
                    S
                  </div>

                  <div>

                    <strong>
                      No seat information
                    </strong>

                    <p>
                      Seat details are not available
                      for this booking.
                    </p>

                  </div>

                </div>

              </section>



              <!-- PARKING -->
              <section class="content-card">

                <div class="section-header">

                  <div>

                    <p class="section-eyebrow">
                      PARKING
                    </p>

                    <h2>
                      Parking Reservation
                    </h2>

                  </div>


                  <span
                    class="parking-badge"
                    *ngIf="booking.parking">

                    Reserved

                  </span>

                </div>


                <div
                  class="parking-card"
                  *ngIf="booking.parking; else noParking">

                  <div class="parking-icon">
                    P
                  </div>


                  <div class="parking-info">

                    <span class="item-label">
                      Parking Slot
                    </span>

                    <strong>
                      {{ booking.parking.slotNumber }}
                    </strong>


                    <small
                      *ngIf="booking.parking.zone">

                      Zone {{ booking.parking.zone }}

                    </small>

                  </div>


                  <strong class="price">

                    Rs.
                    {{
                      booking.parking.fee
                        | number:'1.2-2'
                    }}

                  </strong>

                </div>


                <ng-template #noParking>

                  <div class="empty-box">

                    <div class="empty-icon neutral">
                      P
                    </div>

                    <div>

                      <strong>
                        No parking reserved
                      </strong>

                      <p>
                        This booking does not include
                        a parking reservation.
                      </p>

                    </div>

                  </div>

                </ng-template>

              </section>


            </main>



            <!-- =========================
                 RIGHT SUMMARY
                 ========================= -->
            <aside class="summary-card">

              <p class="section-eyebrow">
                BOOKING SUMMARY
              </p>

              <h2>
                Reservation Total
              </h2>


              <div class="summary-row">

                <span>
                  Selected Seats
                </span>

                <strong>
                  {{ booking.seats?.length || 0 }}
                </strong>

              </div>


              <div class="summary-row">

                <span>
                  Parking
                </span>

                <strong>

                  {{
                    booking.parking
                      ? 'Included'
                      : 'Not included'
                  }}

                </strong>

              </div>


              <div class="summary-row">

                <span>
                  Booking Status
                </span>

                <strong>
                  {{ booking.status | bookingStatus }}
                </strong>

              </div>


              <div class="divider">
              </div>


              <div class="total-row">

                <div>

                  <span>
                    Total
                  </span>

                  <small>
                    LKR
                  </small>

                </div>


                <strong>

                  <ng-container
                    *ngIf="booking.totalAmount != null">

                    Rs.
                    {{
                      booking.totalAmount
                        | number:'1.2-2'
                    }}

                  </ng-container>


                  <ng-container
                    *ngIf="booking.totalAmount == null">

                    N/A

                  </ng-container>

                </strong>

              </div>



              <!-- Pending booking information -->
              <div
                class="info-box"
                *ngIf="isPending">

                <div class="info-icon">
                  i
                </div>

                <div>

                  <strong>
                    Payment required
                  </strong>

                  <p>
                    Complete payment to confirm
                    this reservation.
                  </p>

                </div>

              </div>



              <!-- Confirmed -->
              <div
                class="success-box"
                *ngIf="isConfirmed">

                <div class="success-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    Booking confirmed
                  </strong>

                  <p>
                    Your reservation is confirmed.
                  </p>

                </div>

              </div>



              <!-- Cancelled -->
              <div
                class="danger-box"
                *ngIf="isCancelled">

                <div class="danger-icon">
                  !
                </div>

                <div>

                  <strong>
                    Booking cancelled
                  </strong>

                  <p>
                    This reservation is no longer active.
                  </p>

                </div>

              </div>



              <!-- Expired -->
              <div
                class="danger-box"
                *ngIf="isExpired">

                <div class="danger-icon">
                  !
                </div>

                <div>

                  <strong>
                    Booking expired
                  </strong>

                  <p>
                    The temporary booking hold has ended.
                  </p>

                </div>

              </div>



              <!-- Error -->
              <div
                class="action-error"
                *ngIf="actionError">

                {{ actionError }}

              </div>



              <!-- ACTIONS -->
              <div class="actions">


                <button
                  type="button"
                  class="pay-button"
                  *ngIf="isPending"
                  [disabled]="cancelling"
                  (click)="pay()">

                  Continue to Payment

                  <span>
                    →
                  </span>

                </button>


                <button
                  type="button"
                  class="cancel-button"
                  *ngIf="
                    isPending ||
                    isConfirmed
                  "
                  [disabled]="cancelling"
                  (click)="cancel()">


                  <span
                    class="button-spinner"
                    *ngIf="cancelling">
                  </span>


                  {{
                    cancelling
                      ? 'Cancelling...'
                      : 'Cancel Booking'
                  }}

                </button>


                <a
                  routerLink="/bookings"
                  class="secondary-button">

                  Back to My Bookings

                </a>

              </div>


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

    .booking-page {
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


    .booking-container {
      width: 100%;
      max-width: 1120px;

      margin: 0 auto;
    }



    /* =========================
       HEADER
       ========================= */

    .page-header {
      display: flex;

      align-items: flex-end;
      justify-content: space-between;

      gap: 24px;

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

      font-size: 35px;
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


    .back-button {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      min-height: 41px;

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

      transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease;
    }


    .back-button:hover {
      border-color: #94a3b8;

      background: #f8fafc;

      transform:
        translateY(-1px);
    }



    /* =========================
       OVERVIEW
       ========================= */

    .overview-card {
      margin-bottom: 22px;

      padding: 24px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 16px;

      background: #ffffff;

      box-shadow:
        0 5px 18px
        rgba(
          15,
          23,
          42,
          0.045
        );
    }


    .overview-top {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 18px;

      padding-bottom: 20px;

      border-bottom:
        1px solid
        #e2e8f0;
    }


    .label {
      display: block;

      margin-bottom: 5px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: 0.05em;
    }


    .booking-number {
      color: #0f172a;

      font-size: 18px;
      font-weight: 800;
    }


    .overview-grid {
      display: grid;

      grid-template-columns:
        repeat(
          4,
          minmax(0, 1fr)
        );

      gap: 12px;

      margin-top: 20px;
    }


    .overview-item {
      min-width: 0;
    }


    .overview-item span {
      display: block;

      margin-bottom: 5px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;

      text-transform: uppercase;
    }


    .overview-item strong {
      display: block;

      overflow-wrap: anywhere;

      color: #334155;

      font-size: 12px;
      font-weight: 750;
    }



    /* =========================
       STATUS
       ========================= */

    .status-badge {
      flex-shrink: 0;

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


    .status-pending {
      background: #fff7ed;

      color: #c2410c;
    }


    .status-confirmed {
      background: #ecfdf5;

      color: #047857;
    }


    .status-cancelled,
    .status-expired {
      background: #fef2f2;

      color: #b91c1c;
    }



    /* =========================
       LAYOUT
       ========================= */

    .booking-layout {
      display: grid;

      grid-template-columns:
        minmax(0, 1fr)
        350px;

      gap: 22px;

      align-items: start;
    }


    .booking-main {
      display: flex;

      flex-direction: column;

      gap: 18px;
    }



    /* =========================
       CONTENT CARDS
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

      gap: 14px;

      margin-bottom: 19px;
    }


    .section-header h2,
    .summary-card h2 {
      margin: 0;

      color: #0f172a;

      font-size: 19px;
      font-weight: 750;
    }


    .count-badge,
    .parking-badge {
      padding:
        5px
        9px;

      border-radius: 999px;

      font-size: 10px;
      font-weight: 800;
    }


    .count-badge {
      background: #eff6ff;

      color: #1d4ed8;
    }


    .parking-badge {
      background: #ecfdf5;

      color: #047857;
    }



    /* =========================
       SEATS
       ========================= */

    .seat-list {
      border-top:
        1px solid
        #e2e8f0;
    }


    .seat-row {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 18px;

      padding:
        16px
        0;

      border-bottom:
        1px solid
        #e2e8f0;
    }


    .seat-info {
      display: flex;

      align-items: center;

      gap: 13px;
    }


    .seat-icon {
      display: grid;

      place-items: center;

      min-width: 45px;
      height: 40px;

      padding:
        0
        8px;

      border:
        1px solid
        #bfdbfe;

      border-radius: 9px;

      background: #eff6ff;

      color: #1d4ed8;

      font-size: 11px;
      font-weight: 800;
    }


    .item-label {
      display: block;

      margin-bottom: 3px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;

      text-transform: uppercase;
    }


    .seat-info strong {
      color: #0f172a;

      font-size: 13px;
    }


    .price {
      color: #0f172a;

      font-size: 13px;
      font-weight: 750;
    }



    /* =========================
       PARKING
       ========================= */

    .parking-card {
      display: grid;

      grid-template-columns:
        auto
        minmax(0, 1fr)
        auto;

      align-items: center;

      gap: 14px;

      padding: 16px;

      border:
        1px solid
        #d1fae5;

      border-radius: 12px;

      background: #f8fffb;
    }


    .parking-icon {
      display: grid;

      place-items: center;

      width: 44px;
      height: 44px;

      border-radius: 10px;

      background: #ecfdf5;

      color: #047857;

      font-size: 16px;
      font-weight: 800;
    }


    .parking-info strong {
      display: block;

      color: #0f172a;

      font-size: 14px;
    }


    .parking-info small {
      display: block;

      margin-top: 4px;

      color: #64748b;

      font-size: 11px;
    }



    /* =========================
       EMPTY
       ========================= */

    .empty-box {
      display: flex;

      align-items: center;

      gap: 12px;

      padding: 16px;

      border:
        1px dashed
        #cbd5e1;

      border-radius: 11px;

      background: #f8fafc;
    }


    .empty-icon {
      display: grid;

      place-items: center;

      width: 38px;
      height: 38px;

      flex-shrink: 0;

      border-radius: 9px;

      background: #eff6ff;

      color: #1d4ed8;

      font-weight: 800;
    }


    .empty-icon.neutral {
      background: #f1f5f9;

      color: #64748b;
    }


    .empty-box strong {
      display: block;

      color: #334155;

      font-size: 12px;
    }


    .empty-box p {
      margin:
        4px
        0
        0;

      color: #64748b;

      font-size: 11px;
    }



    /* =========================
       SUMMARY
       ========================= */

    .summary-row {
      display: flex;

      justify-content: space-between;

      gap: 16px;

      margin-top: 15px;

      color: #64748b;

      font-size: 12px;
    }


    .summary-row strong {
      color: #334155;

      font-weight: 700;

      text-align: right;
    }


    .divider {
      height: 1px;

      margin:
        22px
        0;

      background: #e2e8f0;
    }


    .total-row {
      display: flex;

      align-items: flex-end;
      justify-content: space-between;

      gap: 16px;
    }


    .total-row span {
      display: block;

      color: #0f172a;

      font-size: 15px;
      font-weight: 750;
    }


    .total-row small {
      display: block;

      margin-top: 3px;

      color: #94a3b8;

      font-size: 10px;
    }


    .total-row strong {
      color: #0f172a;

      font-size: 22px;
      font-weight: 850;

      text-align: right;
    }



    /* =========================
       INFORMATION BOXES
       ========================= */

    .info-box,
    .success-box,
    .danger-box {
      display: flex;

      gap: 10px;

      margin-top: 20px;
      padding: 13px;

      border-radius: 10px;
    }


    .info-box {
      border:
        1px solid
        #bfdbfe;

      background: #eff6ff;
    }


    .success-box {
      border:
        1px solid
        #a7f3d0;

      background: #ecfdf5;
    }


    .danger-box {
      border:
        1px solid
        #fecaca;

      background: #fef2f2;
    }


    .info-icon,
    .success-icon,
    .danger-icon {
      display: grid;

      place-items: center;

      width: 27px;
      height: 27px;

      flex-shrink: 0;

      border-radius: 50%;

      font-size: 11px;
      font-weight: 800;
    }


    .info-icon {
      background: #dbeafe;

      color: #1d4ed8;
    }


    .success-icon {
      background: #d1fae5;

      color: #047857;
    }


    .danger-icon {
      background: #fee2e2;

      color: #b91c1c;
    }


    .info-box strong {
      color: #1e40af;
    }


    .success-box strong {
      color: #065f46;
    }


    .danger-box strong {
      color: #991b1b;
    }


    .info-box strong,
    .success-box strong,
    .danger-box strong {
      display: block;

      font-size: 11px;
    }


    .info-box p,
    .success-box p,
    .danger-box p {
      margin:
        3px
        0
        0;

      font-size: 10px;

      line-height: 1.5;
    }


    .info-box p {
      color: #3b5f9c;
    }


    .success-box p {
      color: #047857;
    }


    .danger-box p {
      color: #b91c1c;
    }



    /* =========================
       ACTIONS
       ========================= */

    .actions {
      display: flex;

      flex-direction: column;

      gap: 10px;

      margin-top: 22px;
    }


    .pay-button,
    .cancel-button,
    .secondary-button {
      display: flex;

      align-items: center;
      justify-content: center;

      gap: 8px;

      width: 100%;
      min-height: 46px;

      border-radius: 9px;

      font-size: 12px;
      font-weight: 750;

      text-decoration: none;

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
    }


    .pay-button {
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
        0 7px 16px
        rgba(
          37,
          99,
          235,
          0.18
        );
    }


    .pay-button:hover:not(:disabled) {
      transform:
        translateY(-1px);
    }


    .cancel-button {
      border:
        1px solid
        #fecaca;

      background: #ffffff;

      color: #b91c1c;

      cursor: pointer;
    }


    .cancel-button:hover:not(:disabled) {
      background: #fef2f2;

      transform:
        translateY(-1px);
    }


    .secondary-button {
      border:
        1px solid
        #cbd5e1;

      background: #ffffff;

      color: #334155;
    }


    .secondary-button:hover {
      background: #f8fafc;

      border-color: #94a3b8;
    }


    button:disabled {
      opacity: 0.55;

      cursor: not-allowed;
    }


    .button-spinner {
      width: 15px;
      height: 15px;

      border:
        2px solid
        rgba(
          185,
          28,
          28,
          0.25
        );

      border-top-color: #b91c1c;

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


    .action-error {
      margin-top: 16px;
      padding: 11px;

      border:
        1px solid
        #fecaca;

      border-radius: 9px;

      background: #fef2f2;

      color: #b91c1c;

      font-size: 11px;
      font-weight: 600;

      line-height: 1.5;
    }



    /* =========================
       LOADING
       ========================= */

    .state-card {
      display: flex;

      align-items: center;

      gap: 16px;

      max-width: 700px;

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


    .state-content h2 {
      margin:
        0
        0
        5px;

      color: #0f172a;

      font-size: 16px;
    }


    .state-content p {
      margin: 0;

      color: #64748b;

      font-size: 12px;
    }


    .retry-button {
      margin-top: 12px;
      padding:
        8px
        12px;

      border: none;

      border-radius: 8px;

      background: #2563eb;

      color: #ffffff;

      font-size: 11px;
      font-weight: 700;

      cursor: pointer;
    }



    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 900px) {

      .booking-layout {
        grid-template-columns:
          1fr;
      }


      .summary-card {
        position: static;
      }


      .overview-grid {
        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );
      }

    }


    @media (max-width: 640px) {

      .booking-page {
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


      .back-button {
        width: 100%;
      }


      .overview-top {
        align-items: flex-start;

        flex-direction: column;
      }


      .overview-grid {
        grid-template-columns:
          1fr;
      }


      .content-card,
      .summary-card {
        padding: 19px;
      }


      .parking-card {
        grid-template-columns:
          auto
          minmax(0, 1fr);
      }


      .parking-card
      .price {
        grid-column: 2;
      }

    }

  `]
})


export class BookingDetailComponent
  implements OnInit {

  booking?:
    BookingResponse;

  bookingId = 0;

  message =
    'Loading booking...';

  cancelling = false;

  actionError = '';


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


    this.load();

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


  get isCancelled(): boolean {

    return (
      this.normalizedStatus ===
      'cancelled'
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

  load(): void {

    this.message =
      'Loading booking...';

    this.actionError = '';


    this.bookingService
      .getBooking(
        this.bookingId
      )
      .subscribe({

        next: result => {

          this.booking =
            result;

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
     PAY
     ========================= */

  pay(): void {

    if (!this.isPending) {
      return;
    }


    this.router.navigate([
      '/payment',
      this.bookingId
    ]);

  }



  /* =========================
     CANCEL
     ========================= */

  cancel(): void {

    if (
      this.cancelling ||
      (
        !this.isPending &&
        !this.isConfirmed
      )
    ) {

      return;

    }


    const confirmed =
      confirm(
        'Are you sure you want to cancel this booking?'
      );


    if (!confirmed) {
      return;
    }


    this.cancelling = true;

    this.actionError = '';


    this.bookingService
      .cancelBooking(
        this.bookingId
      )
      .subscribe({

        next: () => {

          this.cancelling =
            false;


          this.router.navigate([
            '/bookings'
          ]);

        },


        error: err => {

          this.cancelling =
            false;


          console.error(
            'Unable to cancel booking:',
            err
          );


          this.actionError =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to cancel booking. Please try again.';

        }

      });

  }

}