import { CommonModule } from '@angular/common';

import {
  Component
} from '@angular/core';

import {
  Router
} from '@angular/router';

import { BookingService }
  from '../../services/booking.service';

import {
  CheckoutState,
  CreateBookingRequest
} from '../../models/booking.models';

import { getCurrentCustomerId }
  from '../../utils/auth-context.util';


@Component({
  selector: 'app-checkout',

  standalone: true,

  imports: [
    CommonModule
  ],

  template: `
    <div class="checkout-page">

      <div class="checkout-container">


        <!-- =========================
             PAGE HEADER
             ========================= -->
        <header class="page-header">

          <div>

            <p class="eyebrow">
              SECURE CHECKOUT
            </p>

            <h1>
              Review your booking
            </h1>

            <p class="subtitle">
              Check your selected seats and parking
              before confirming your reservation.
            </p>

          </div>


          <button
            type="button"
            class="back-button"
            [disabled]="loading"
            (click)="goBack()">

            ← Back

          </button>

        </header>



        <!-- =========================
             PROGRESS
             ========================= -->
        <div class="progress-card">

          <div class="progress-step completed">

            <span class="step-number">
              ✓
            </span>

            <span class="step-label">
              Event
            </span>

          </div>


          <div class="progress-line completed">
          </div>


          <div class="progress-step completed">

            <span class="step-number">
              ✓
            </span>

            <span class="step-label">
              Seats
            </span>

          </div>


          <div class="progress-line completed">
          </div>


          <div class="progress-step completed">

            <span class="step-number">
              ✓
            </span>

            <span class="step-label">
              Parking
            </span>

          </div>


          <div class="progress-line active">
          </div>


          <div class="progress-step active">

            <span class="step-number">
              4
            </span>

            <span class="step-label">
              Checkout
            </span>

          </div>


          <div class="progress-line">
          </div>


          <div class="progress-step">

            <span class="step-number">
              5
            </span>

            <span class="step-label">
              Payment
            </span>

          </div>

        </div>



        <!-- =========================
             MAIN LAYOUT
             ========================= -->
        <div class="checkout-layout">


          <!-- LEFT COLUMN -->
          <main class="checkout-main">


            <!-- EVENT -->
            <section
              class="content-card event-card"
              *ngIf="eventName">

              <div class="section-header">

                <div>

                  <p class="section-eyebrow">
                    EVENT
                  </p>

                  <h2>
                    {{ eventName }}
                  </h2>

                </div>


                <span class="confirmed-badge">
                  Selected
                </span>

              </div>

            </section>



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

                  {{ seats.length }}

                  {{
                    seats.length === 1
                      ? 'seat'
                      : 'seats'
                  }}

                </span>

              </div>


              <div
                class="seat-list"
                *ngIf="seats.length > 0">

                <div
                  class="seat-row"
                  *ngFor="let seat of seats">

                  <div class="seat-info">

                    <div class="seat-icon">
                      {{ seat.seatNumber }}
                    </div>

                    <div>

                      <span class="seat-label">
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
                class="empty-selection"
                *ngIf="seats.length === 0">

                <div class="empty-icon">
                  !
                </div>

                <div>

                  <strong>
                    No seats selected
                  </strong>

                  <p>
                    Please return to seat selection
                    and choose at least one seat.
                  </p>

                </div>

              </div>

            </section>



            <!-- PARKING -->
            <section class="content-card">

              <div class="section-header">

                <div>

                  <p class="section-eyebrow">
                    OPTIONAL ADD-ON
                  </p>

                  <h2>
                    Parking
                  </h2>

                </div>


                <span
                  class="confirmed-badge"
                  *ngIf="parking">

                  Reserved

                </span>

              </div>


              <div
                class="parking-card"
                *ngIf="parking; else noParking">

                <div class="parking-icon">
                  P
                </div>


                <div class="parking-details">

                  <div class="parking-main">

                    <span>
                      Parking Slot
                    </span>

                    <strong>
                      {{ parking.slotNumber }}
                    </strong>

                  </div>


                  <div
                    class="parking-meta"
                    *ngIf="parking.zone">

                    Zone {{ parking.zone }}

                  </div>

                </div>


                <strong class="price">

                  Rs.
                  {{
                    parking.fee
                      | number:'1.2-2'
                  }}

                </strong>

              </div>


              <ng-template #noParking>

                <div class="no-parking">

                  <div class="empty-icon neutral">
                    P
                  </div>

                  <div>

                    <strong>
                      No parking selected
                    </strong>

                    <p>
                      You can continue without
                      reserving parking.
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

            <div class="summary-header">

              <p class="section-eyebrow">
                ORDER SUMMARY
              </p>

              <h2>
                Booking Summary
              </h2>

            </div>


            <div class="summary-row">

              <span>
                Seats
              </span>

              <strong>
                {{ seats.length }}
              </strong>

            </div>


            <div class="summary-row">

              <span>
                Seat subtotal
              </span>

              <strong>
                Rs.
                {{
                  seatTotal
                    | number:'1.2-2'
                }}
              </strong>

            </div>


            <div class="summary-row">

              <span>
                Parking
              </span>

              <strong>

                <ng-container *ngIf="parking">
                  Rs.
                  {{
                    parkingTotal
                      | number:'1.2-2'
                  }}
                </ng-container>

                <ng-container *ngIf="!parking">
                  Not selected
                </ng-container>

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
                Rs.
                {{
                  total
                    | number:'1.2-2'
                }}
              </strong>

            </div>



            <!-- ERROR -->
            <div
              class="error-box"
              role="alert"
              *ngIf="error">

              <div class="error-symbol">
                !
              </div>

              <div>

                <strong>
                  Unable to confirm booking
                </strong>

                <p>
                  {{ error }}
                </p>

              </div>

            </div>



            <!-- CONFIRM BUTTON -->
            <button
              type="button"
              class="confirm-button"
              [disabled]="
                loading ||
                seats.length === 0
              "
              (click)="createBooking()">


              <span
                class="button-spinner"
                *ngIf="loading">
              </span>


              <span>

                {{
                  loading
                    ? 'Creating your booking...'
                    : 'Confirm Booking'
                }}

              </span>

            </button>



            <!-- SECURITY INFO -->
            <div class="security-note">

              <div class="security-icon">
                ✓
              </div>

              <div>

                <strong>
                  Secure reservation
                </strong>

                <p>
                  Your selected seats will be held
                  temporarily after confirmation
                  while you complete payment.
                </p>

              </div>

            </div>


            <p class="terms-note">
              By confirming this booking,
              you agree to continue to the
              payment stage before the reservation
              hold expires.
            </p>

          </aside>


        </div>

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

    .checkout-page {
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


    .checkout-container {
      width: 100%;
      max-width: 1180px;

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
      margin: 0 0 7px;

      color: #2563eb;

      font-size: 11px;
      font-weight: 800;

      letter-spacing: 0.14em;

      text-transform: uppercase;
    }


    .page-header h1 {
      margin: 0;

      color: #0f172a;

      font-size: 36px;
      font-weight: 800;

      letter-spacing: -0.03em;
    }


    .subtitle {
      max-width: 620px;

      margin: 10px 0 0;

      color: #64748b;

      font-size: 15px;

      line-height: 1.6;
    }


    .back-button {
      min-width: 100px;

      padding:
        10px
        15px;

      border:
        1px solid
        #cbd5e1;

      border-radius: 9px;

      background: #ffffff;

      color: #334155;

      font-size: 13px;
      font-weight: 700;

      cursor: pointer;

      transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease;
    }


    .back-button:hover:not(:disabled) {
      border-color: #94a3b8;

      background: #f8fafc;

      transform:
        translateY(-1px);
    }


    .back-button:disabled {
      opacity: 0.5;

      cursor: not-allowed;
    }



    /* =========================
       PROGRESS
       ========================= */

    .progress-card {
      display: flex;

      align-items: flex-start;

      margin-bottom: 26px;
      padding: 20px 24px;

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

      gap: 7px;

      flex-shrink: 0;
    }


    .step-number {
      display: grid;

      place-items: center;

      width: 30px;
      height: 30px;

      border:
        1px solid
        #cbd5e1;

      border-radius: 50%;

      background: #ffffff;

      color: #94a3b8;

      font-size: 11px;
      font-weight: 800;
    }


    .step-label {
      color: #94a3b8;

      font-size: 11px;
      font-weight: 700;
    }


    .progress-step.completed
    .step-number {
      border-color: #86efac;

      background: #ecfdf5;

      color: #059669;
    }


    .progress-step.completed
    .step-label {
      color: #475569;
    }


    .progress-step.active
    .step-number {
      border-color: #2563eb;

      background: #2563eb;

      color: #ffffff;
    }


    .progress-step.active
    .step-label {
      color: #1d4ed8;
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
       MAIN GRID
       ========================= */

    .checkout-layout {
      display: grid;

      grid-template-columns:
        minmax(0, 1fr)
        370px;

      gap: 24px;

      align-items: start;
    }


    .checkout-main {
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


    .section-header {
      display: flex;

      align-items: flex-start;
      justify-content: space-between;

      gap: 16px;

      margin-bottom: 20px;
    }


    .section-header h2,
    .summary-header h2 {
      margin: 0;

      color: #0f172a;

      font-size: 19px;
      font-weight: 750;
    }


    .confirmed-badge,
    .count-badge {
      display: inline-flex;

      align-items: center;

      min-height: 27px;

      padding:
        5px
        9px;

      border-radius: 999px;

      font-size: 11px;
      font-weight: 800;
    }


    .confirmed-badge {
      background: #ecfdf5;

      color: #047857;
    }


    .count-badge {
      background: #eff6ff;

      color: #1d4ed8;
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

      min-width: 44px;
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

      font-size: 12px;
      font-weight: 800;
    }


    .seat-label {
      display: block;

      margin-bottom: 3px;

      color: #94a3b8;

      font-size: 11px;
      font-weight: 700;

      text-transform: uppercase;
    }


    .seat-info strong {
      color: #0f172a;

      font-size: 14px;
    }


    .price {
      color: #0f172a;

      font-size: 14px;
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


    .parking-main span {
      display: block;

      margin-bottom: 3px;

      color: #94a3b8;

      font-size: 11px;
      font-weight: 700;
    }


    .parking-main strong {
      color: #0f172a;

      font-size: 15px;
    }


    .parking-meta {
      margin-top: 5px;

      color: #64748b;

      font-size: 12px;
    }


    .no-parking,
    .empty-selection {
      display: flex;

      align-items: center;

      gap: 13px;

      padding: 16px;

      border:
        1px dashed
        #cbd5e1;

      border-radius: 12px;

      background: #f8fafc;
    }


    .empty-icon {
      display: grid;

      place-items: center;

      width: 38px;
      height: 38px;

      flex-shrink: 0;

      border-radius: 9px;

      background: #fee2e2;

      color: #b91c1c;

      font-weight: 800;
    }


    .empty-icon.neutral {
      background: #f1f5f9;

      color: #64748b;
    }


    .no-parking strong,
    .empty-selection strong {
      display: block;

      color: #0f172a;

      font-size: 13px;
    }


    .no-parking p,
    .empty-selection p {
      margin:
        4px
        0
        0;

      color: #64748b;

      font-size: 12px;
    }



    /* =========================
       SUMMARY
       ========================= */

    .summary-card {
      position: sticky;

      top: 24px;

      padding: 24px;
    }


    .summary-header {
      margin-bottom: 24px;
    }


    .summary-row {
      display: flex;

      justify-content: space-between;

      gap: 18px;

      margin-bottom: 15px;

      color: #64748b;

      font-size: 13px;
    }


    .summary-row strong {
      color: #334155;

      text-align: right;

      font-weight: 700;
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

      gap: 18px;
    }


    .total-row span {
      display: block;

      color: #0f172a;

      font-size: 16px;
      font-weight: 750;
    }


    .total-row small {
      display: block;

      margin-top: 3px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;
    }


    .total-row strong {
      color: #0f172a;

      font-size: 23px;
      font-weight: 800;

      letter-spacing: -0.02em;
    }



    /* =========================
       CONFIRM BUTTON
       ========================= */

    .confirm-button {
      display: flex;

      align-items: center;
      justify-content: center;

      gap: 9px;

      width: 100%;

      min-height: 50px;

      margin-top: 26px;

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
        0 8px 18px
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


    .confirm-button:hover:not(:disabled) {
      transform:
        translateY(-1px);

      box-shadow:
        0 11px 23px
        rgba(
          37,
          99,
          235,
          0.26
        );
    }


    .confirm-button:disabled {
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
       SECURITY NOTE
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

      font-size: 12px;
      font-weight: 800;
    }


    .security-note strong {
      display: block;

      color: #166534;

      font-size: 12px;
    }


    .security-note p {
      margin:
        3px
        0
        0;

      color: #4b7a5c;

      font-size: 11px;

      line-height: 1.5;
    }


    .terms-note {
      margin:
        15px
        0
        0;

      color: #94a3b8;

      font-size: 10px;

      line-height: 1.55;

      text-align: center;
    }



    /* =========================
       ERROR
       ========================= */

    .error-box {
      display: flex;

      gap: 11px;

      margin-top: 20px;
      padding: 13px;

      border:
        1px solid
        #fecaca;

      border-radius: 10px;

      background: #fff7f7;
    }


    .error-symbol {
      display: grid;

      place-items: center;

      width: 28px;
      height: 28px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #fee2e2;

      color: #b91c1c;

      font-size: 12px;
      font-weight: 800;
    }


    .error-box strong {
      display: block;

      color: #991b1b;

      font-size: 12px;
    }


    .error-box p {
      margin:
        4px
        0
        0;

      color: #b91c1c;

      font-size: 11px;

      line-height: 1.5;
    }



    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 920px) {

      .checkout-layout {
        grid-template-columns:
          1fr;
      }


      .summary-card {
        position: static;
      }

    }


    @media (max-width: 700px) {

      .checkout-page {
        padding:
          30px
          14px
          48px;
      }


      .page-header {
        align-items: flex-start;

        flex-direction: column;
      }


      .page-header h1 {
        font-size: 29px;
      }


      .back-button {
        width: 100%;
      }


      .progress-card {
        overflow-x: auto;

        padding: 16px;
      }


      .progress-line {
        min-width: 28px;

        margin-left: 8px;
        margin-right: 8px;
      }


      .content-card,
      .summary-card {
        padding: 19px;
      }

    }


    @media (max-width: 480px) {

      .step-label {
        font-size: 9px;
      }


      .step-number {
        width: 27px;
        height: 27px;
      }


      .seat-row {
        align-items: flex-start;
      }


      .parking-card {
        grid-template-columns:
          auto
          minmax(0, 1fr);
      }


      .parking-card .price {
        grid-column: 2;
      }


      .total-row strong {
        font-size: 20px;
      }

    }

  `]
})


export class CheckoutComponent {

  eventId = 0;

  eventName = '';

  seats:
    CheckoutState['seats'] = [];

  parking:
    CheckoutState['parking'] = null;

  loading = false;

  error = '';


  constructor(
    private bookingService:
      BookingService,

    private router:
      Router
  ) {

    const state =
      history.state as CheckoutState;


    this.eventId =
      Number(
        state?.eventId ?? 0
      );


    this.eventName =
      state?.eventName ?? '';


    this.seats =
      state?.seats ?? [];


    this.parking =
      state?.parking ?? null;

  }



  /* =========================
     TOTALS
     ========================= */

  get seatTotal(): number {

    return this.seats.reduce(
      (sum, seat) =>
        sum +
        Number(
          seat.price ?? 0
        ),
      0
    );

  }


  get parkingTotal(): number {

    return Number(
      this.parking?.fee ?? 0
    );

  }


  get total(): number {

    return (
      this.seatTotal +
      this.parkingTotal
    );

  }



  /* =========================
     BACK
     ========================= */

  goBack(): void {

    if (this.loading) {
      return;
    }

    history.back();

  }



  /* =========================
     CREATE BOOKING
     ========================= */

  createBooking(): void {

    this.error = '';


    const customerId =
      getCurrentCustomerId();


    if (!customerId) {

      this.error =
        'Customer session was not found. Please login again.';

      return;

    }


    if (!this.eventId) {

      this.error =
        'Event information is missing.';

      return;

    }


    if (!this.seats.length) {

      this.error =
        'Please select at least one seat.';

      return;

    }


    const request:
      CreateBookingRequest = {

        customerId,

        eventId:
          this.eventId,

        seatIds:
          this.seats.map(
            seat =>
              seat.seatId
          ),

        parkingSlotId:
          this.parking
            ?.parkingSlotId
          ?? null

      };


    const confirmed =
      confirm(
        `Confirm this booking for Rs. ${this.total.toFixed(2)}?`
      );


    if (!confirmed) {
      return;
    }


    this.loading = true;


    this.bookingService
      .createBooking(request)
      .subscribe({

        next: (
          response: any
        ) => {

          this.loading = false;


          console.log(
            'BOOKING CREATE RESPONSE:',
            response
          );


          const bookingId =
            typeof response === 'number'

              ? response

              : Number(

                  response?.id ??

                  response?.bookingId ??

                  response?.booking?.id ??

                  response?.data?.id

                );


          if (
            !bookingId ||
            Number.isNaN(
              bookingId
            )
          ) {

            console.error(
              'Booking created but booking ID was not found:',
              response
            );


            this.error =
              'Booking was created successfully, but the booking ID was not returned in the expected format.';

            return;

          }


          this.router.navigate([
            '/booking/success',
            bookingId
          ]);

        },


        error: err => {

          this.loading = false;


          console.error(
            'Booking creation failed:',
            err
          );


          if (
            err?.status === 409
          ) {

            this.error =
              'One of your selected seats or parking spaces is no longer available. Please return and choose another option.';

            return;

          }


          this.error =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to create booking. Please try again.';

        }

      });

  }

}