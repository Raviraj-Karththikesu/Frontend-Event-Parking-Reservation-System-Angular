import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
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

import {
  getCurrentCustomerId
} from '../../utils/auth-context.util';


type BookingFilter =
  | 'all'
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'expired';


@Component({
  selector: 'app-booking-history',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    BookingStatusPipe
  ],

  template: `
    <main class="bookings-page">

      <!-- =====================================
           PAGE HERO
           ===================================== -->
      <section class="page-hero">

        <div class="hero-copy">

          <span class="eyebrow">
            CUSTOMER RESERVATIONS
          </span>

          <h1>
            My Bookings
          </h1>

          <p>
            View and manage your EventPark reservations,
            payments and booking status in one place.
          </p>

        </div>


        <div class="hero-actions">

          <button
            type="button"
            class="refresh-button"
            [disabled]="loading"
            (click)="loadBookings()">

            <span
              class="refresh-symbol"
              [class.refreshing]="loading">
              ↻
            </span>

            Refresh

          </button>


          <a
            routerLink="/events"
            class="browse-button">

            Browse Events

            <span>→</span>

          </a>

        </div>

      </section>



      <!-- =====================================
           LOADING
           ===================================== -->
      <section
        class="loading-panel"
        *ngIf="loading">

        <div class="loading-spinner"></div>

        <div>

          <h2>
            Loading your bookings
          </h2>

          <p>
            Retrieving your latest reservation information.
          </p>

        </div>

      </section>



      <!-- =====================================
           ERROR
           ===================================== -->
      <section
        class="error-panel"
        *ngIf="!loading && error">

        <div class="error-icon">
          !
        </div>

        <div class="error-copy">

          <strong>
            Unable to load bookings
          </strong>

          <p>
            {{ error }}
          </p>

        </div>

        <button
          type="button"
          (click)="loadBookings()">

          Try Again

        </button>

      </section>



      <!-- =====================================
           CONTENT
           ===================================== -->
      <ng-container
        *ngIf="!loading && !error">


        <!-- =====================================
             SUMMARY
             ===================================== -->
        <section
          class="summary-grid"
          *ngIf="bookings.length > 0">


          <article class="summary-card">

            <div class="summary-icon summary-icon-blue">
              BK
            </div>

            <div>

              <span>
                Total Bookings
              </span>

              <strong>
                {{ bookings.length }}
              </strong>

            </div>

          </article>


          <article class="summary-card">

            <div class="summary-icon summary-icon-green">
              CF
            </div>

            <div>

              <span>
                Confirmed
              </span>

              <strong>
                {{ confirmedCount }}
              </strong>

            </div>

          </article>


          <article class="summary-card">

            <div class="summary-icon summary-icon-orange">
              PD
            </div>

            <div>

              <span>
                Pending
              </span>

              <strong>
                {{ pendingCount }}
              </strong>

            </div>

          </article>


          <article class="summary-card">

            <div class="summary-icon summary-icon-red">
              CN
            </div>

            <div>

              <span>
                Cancelled
              </span>

              <strong>
                {{ cancelledCount }}
              </strong>

            </div>

          </article>

        </section>



        <!-- =====================================
             BOOKING AREA
             ===================================== -->
        <section
          class="booking-section"
          *ngIf="bookings.length > 0">


          <!-- SECTION HEADER -->
          <div class="section-header">

            <div>

              <span class="section-label">
                RESERVATION HISTORY
              </span>

              <h2>
                Your bookings
              </h2>

              <p>
                Review current and previous EventPark reservations.
              </p>

            </div>


            <span class="result-count">

              {{ visibleBookings.length }}

              {{
                visibleBookings.length === 1
                  ? 'booking'
                  : 'bookings'
              }}

            </span>

          </div>



          <!-- =====================================
               STATUS FILTER
               ===================================== -->
          <div class="filter-bar">

            <button
              type="button"
              [class.active]="selectedFilter === 'all'"
              (click)="setFilter('all')">

              All

              <span>
                {{ bookings.length }}
              </span>

            </button>


            <button
              type="button"
              [class.active]="selectedFilter === 'confirmed'"
              (click)="setFilter('confirmed')">

              Confirmed

              <span>
                {{ confirmedCount }}
              </span>

            </button>


            <button
              type="button"
              [class.active]="selectedFilter === 'pending'"
              (click)="setFilter('pending')">

              Pending

              <span>
                {{ pendingCount }}
              </span>

            </button>


            <button
              type="button"
              [class.active]="selectedFilter === 'cancelled'"
              (click)="setFilter('cancelled')">

              Cancelled

              <span>
                {{ cancelledCount }}
              </span>

            </button>


            <button
              type="button"
              [class.active]="selectedFilter === 'expired'"
              (click)="setFilter('expired')">

              Expired

              <span>
                {{ expiredCount }}
              </span>

            </button>

          </div>



          <!-- CANCEL ERROR -->
          <div
            class="action-error"
            *ngIf="actionError">

            <span>
              !
            </span>

            <p>
              {{ actionError }}
            </p>

          </div>



          <!-- =====================================
               CARDS
               ===================================== -->
          <div
            class="booking-list"
            *ngIf="visibleBookings.length > 0">


            <article
              class="booking-card"
              *ngFor="let booking of visibleBookings">


              <!-- LEFT STATUS STRIP -->
              <div
                class="status-strip"
                [ngClass]="
                  getStatusStripClass(
                    booking.status
                  )
                ">
              </div>



              <!-- EVENT MARK -->
              <div class="event-mark">

                <span>
                  {{ getEventInitial(booking) }}
                </span>

              </div>



              <!-- MAIN INFO -->
              <div class="booking-main">

                <div class="booking-top-row">

                  <div>

                    <span class="booking-reference-label">
                      BOOKING REFERENCE
                    </span>

                    <h3>
                      {{ booking.bookingNumber }}
                    </h3>

                  </div>


                  <span
                    class="status-badge"
                    [ngClass]="
                      getStatusClass(
                        booking.status
                      )
                    ">

                    <span class="status-dot"></span>

                    {{
                      booking.status
                        | bookingStatus
                    }}

                  </span>

                </div>



                <div class="booking-event">

                  <span class="data-label">
                    EVENT
                  </span>

                  <strong>

                    {{
                      booking.eventName ||
                      ('Event #' + booking.eventId)
                    }}

                  </strong>

                </div>



                <div class="booking-meta">


                  <div
                    class="meta-block"
                    *ngIf="booking.createdAt">

                    <span>
                      BOOKED ON
                    </span>

                    <strong>
                      {{
                        booking.createdAt
                          | date:'mediumDate'
                      }}
                    </strong>

                  </div>


                  <div class="meta-block">

                    <span>
                      EVENT ID
                    </span>

                    <strong>
                      #{{ booking.eventId }}
                    </strong>

                  </div>


                  <div
                    class="meta-block"
                    *ngIf="
                      booking.totalAmount != null
                    ">

                    <span>
                      TOTAL
                    </span>

                    <strong class="amount">

                      Rs.
                      {{
                        booking.totalAmount
                          | number:'1.2-2'
                      }}

                    </strong>

                  </div>

                </div>

              </div>



              <!-- ACTIONS -->
              <div class="booking-actions">


                <!-- DETAILS -->
                <a
                  class="details-button"
                  *ngIf="
                    getBookingId(booking)
                      !== null
                  "
                  [routerLink]="[
                    '/bookings',
                    getBookingId(booking)
                  ]">

                  Details

                  <span>→</span>

                </a>



                <!-- PAYMENT -->
                <a
                  class="payment-button"
                  *ngIf="
                    normalizedStatus(booking)
                      === 'pending'
                    &&
                    getBookingId(booking)
                      !== null
                  "
                  [routerLink]="[
                    '/payment',
                    getBookingId(booking)
                  ]">

                  Pay Now

                </a>



                <!-- CANCEL -->
                <button
                  type="button"
                  class="cancel-button"
                  *ngIf="
                    normalizedStatus(booking)
                      === 'pending'
                    ||
                    normalizedStatus(booking)
                      === 'confirmed'
                  "
                  [disabled]="
                    cancellingBookingId
                      === getBookingId(booking)
                  "
                  (click)="cancel(booking)">

                  {{
                    cancellingBookingId
                      === getBookingId(booking)
                        ? 'Cancelling...'
                        : 'Cancel'
                  }}

                </button>

              </div>

            </article>

          </div>



          <!-- FILTER EMPTY -->
          <div
            class="filter-empty"
            *ngIf="visibleBookings.length === 0">

            <div class="filter-empty-icon">
              BK
            </div>

            <h3>
              No {{ selectedFilter }} bookings
            </h3>

            <p>
              There are no bookings matching this status.
            </p>

            <button
              type="button"
              (click)="setFilter('all')">

              View All Bookings

            </button>

          </div>

        </section>



        <!-- =====================================
             NO BOOKINGS
             ===================================== -->
        <section
          class="empty-state"
          *ngIf="bookings.length === 0">

          <div class="empty-illustration">

            <span>
              EP
            </span>

          </div>


          <span class="empty-label">
            YOUR BOOKINGS
          </span>


          <h2>
            No reservations yet
          </h2>


          <p>
            Discover an event you like and make your
            first EventPark reservation.
          </p>


          <a routerLink="/events">

            Explore Events

            <span>→</span>

          </a>

        </section>

      </ng-container>

    </main>
  `,


  styles: [`

    :host {
      display: block;
    }


    * {
      box-sizing: border-box;
    }


    /* ==========================================
       PAGE
       ========================================== */

    .bookings-page {
      min-height: 100vh;

      padding:
        46px
        24px
        70px;

      background:
        linear-gradient(
          180deg,
          #f8fafc 0%,
          #f1f5f9 100%
        );

      color: #0f172a;
    }



    /* ==========================================
       HERO
       ========================================== */

    .page-hero {
      display: flex;

      align-items: flex-end;
      justify-content: space-between;

      gap: 30px;

      width: 100%;
      max-width: 1180px;

      margin:
        0
        auto
        30px;
    }


    .hero-copy {
      max-width: 700px;
    }


    .eyebrow {
      display: block;

      margin-bottom: 9px;

      color: #0891b2;

      font-size: 10px;
      font-weight: 850;

      letter-spacing: 0.15em;
    }


    .page-hero h1 {
      margin: 0;

      color: #0f172a;

      font-size: 38px;
      font-weight: 850;

      letter-spacing: -0.035em;
    }


    .page-hero p {
      max-width: 650px;

      margin:
        10px
        0
        0;

      color: #64748b;

      font-size: 13px;

      line-height: 1.65;
    }


    .hero-actions {
      display: flex;

      gap: 10px;

      flex-wrap: wrap;
    }


    .refresh-button,
    .browse-button {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      gap: 8px;

      min-height: 42px;

      padding:
        0
        15px;

      border-radius: 9px;

      font-size: 11px;
      font-weight: 750;

      cursor: pointer;

      text-decoration: none;

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }


    .refresh-button {
      border:
        1px solid
        #cbd5e1;

      background: #ffffff;

      color: #334155;
    }


    .browse-button {
      border:
        1px solid
        #2563eb;

      background:
        linear-gradient(
          135deg,
          #06b6d4,
          #2563eb
        );

      color: #ffffff;

      box-shadow:
        0 8px 20px
        rgba(
          37,
          99,
          235,
          0.18
        );
    }


    .refresh-button:hover:not(:disabled),
    .browse-button:hover {
      transform:
        translateY(-1px);
    }


    .refresh-button:disabled {
      opacity: 0.55;

      cursor: not-allowed;
    }


    .refresh-symbol {
      font-size: 16px;
    }


    .refreshing {
      animation:
        spin
        0.8s
        linear
        infinite;
    }



    /* ==========================================
       SUMMARY
       ========================================== */

    .summary-grid {
      display: grid;

      grid-template-columns:
        repeat(
          4,
          minmax(0, 1fr)
        );

      gap: 14px;

      width: 100%;
      max-width: 1180px;

      margin:
        0
        auto
        30px;
    }


    .summary-card {
      display: flex;

      align-items: center;

      gap: 12px;

      min-height: 88px;

      padding: 17px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 13px;

      background: #ffffff;

      box-shadow:
        0 4px 15px
        rgba(
          15,
          23,
          42,
          0.04
        );
    }


    .summary-icon {
      display: grid;

      place-items: center;

      width: 39px;
      height: 39px;

      flex-shrink: 0;

      border-radius: 10px;

      font-size: 9px;
      font-weight: 850;
    }


    .summary-icon-blue {
      background: #eff6ff;
      color: #2563eb;
    }


    .summary-icon-green {
      background: #ecfdf5;
      color: #059669;
    }


    .summary-icon-orange {
      background: #fff7ed;
      color: #ea580c;
    }


    .summary-icon-red {
      background: #fef2f2;
      color: #dc2626;
    }


    .summary-card span {
      display: block;

      color: #64748b;

      font-size: 9px;
      font-weight: 700;

      text-transform: uppercase;
    }


    .summary-card strong {
      display: block;

      margin-top: 4px;

      color: #0f172a;

      font-size: 22px;
      font-weight: 850;
    }



    /* ==========================================
       BOOKING SECTION
       ========================================== */

    .booking-section {
      width: 100%;
      max-width: 1180px;

      margin: 0 auto;
    }


    .section-header {
      display: flex;

      align-items: flex-end;
      justify-content: space-between;

      gap: 20px;

      margin-bottom: 17px;
    }


    .section-label {
      color: #0891b2;

      font-size: 9px;
      font-weight: 850;

      letter-spacing: 0.13em;
    }


    .section-header h2 {
      margin:
        6px
        0
        4px;

      color: #0f172a;

      font-size: 23px;
      font-weight: 820;
    }


    .section-header p {
      margin: 0;

      color: #64748b;

      font-size: 10px;
    }


    .result-count {
      padding:
        6px
        10px;

      border:
        1px solid
        #dbeafe;

      border-radius: 999px;

      background: #eff6ff;

      color: #1d4ed8;

      font-size: 9px;
      font-weight: 800;
    }



    /* ==========================================
       FILTERS
       ========================================== */

    .filter-bar {
      display: flex;

      align-items: center;

      gap: 7px;

      margin-bottom: 17px;

      padding:
        6px;

      overflow-x: auto;

      border:
        1px solid
        #e2e8f0;

      border-radius: 11px;

      background: #ffffff;
    }


    .filter-bar button {
      display: inline-flex;

      align-items: center;

      gap: 6px;

      flex-shrink: 0;

      min-height: 34px;

      padding:
        0
        12px;

      border: none;

      border-radius: 7px;

      background: transparent;

      color: #64748b;

      font-size: 9px;
      font-weight: 750;

      cursor: pointer;
    }


    .filter-bar button span {
      display: grid;

      place-items: center;

      min-width: 19px;
      height: 19px;

      padding:
        0
        5px;

      border-radius: 999px;

      background: #f1f5f9;

      font-size: 8px;
    }


    .filter-bar button.active {
      background: #0f172a;

      color: #ffffff;
    }


    .filter-bar button.active span {
      background:
        rgba(
          255,
          255,
          255,
          0.13
        );

      color: #ffffff;
    }



    /* ==========================================
       LIST
       ========================================== */

    .booking-list {
      display: grid;

      gap: 13px;
    }


    .booking-card {
      position: relative;

      display: grid;

      grid-template-columns:
        48px
        minmax(0, 1fr)
        auto;

      align-items: center;

      gap: 17px;

      min-height: 160px;

      padding:
        19px
        20px
        19px
        25px;

      overflow: hidden;

      border:
        1px solid
        #e2e8f0;

      border-radius: 14px;

      background: #ffffff;

      box-shadow:
        0 5px 18px
        rgba(
          15,
          23,
          42,
          0.045
        );

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }


    .booking-card:hover {
      transform:
        translateY(-2px);

      box-shadow:
        0 12px 28px
        rgba(
          15,
          23,
          42,
          0.08
        );
    }


    .status-strip {
      position: absolute;

      top: 0;
      bottom: 0;
      left: 0;

      width: 4px;
    }


    .strip-confirmed {
      background: #10b981;
    }


    .strip-pending {
      background: #f59e0b;
    }


    .strip-cancelled {
      background: #ef4444;
    }


    .strip-expired {
      background: #94a3b8;
    }


    .strip-default {
      background: #3b82f6;
    }


    .event-mark {
      display: grid;

      place-items: center;

      width: 48px;
      height: 48px;

      border-radius: 12px;

      background:
        linear-gradient(
          135deg,
          #ecfeff,
          #eff6ff
        );

      color: #0369a1;

      font-size: 18px;
      font-weight: 850;
    }



    /* ==========================================
       BOOKING CONTENT
       ========================================== */

    .booking-main {
      min-width: 0;
    }


    .booking-top-row {
      display: flex;

      align-items: flex-start;
      justify-content: space-between;

      gap: 14px;
    }


    .booking-reference-label,
    .data-label {
      display: block;

      color: #94a3b8;

      font-size: 8px;
      font-weight: 800;

      letter-spacing: 0.08em;
    }


    .booking-card h3 {
      margin:
        4px
        0
        0;

      color: #0f172a;

      font-size: 16px;
      font-weight: 820;
    }


    .booking-event {
      margin-top: 13px;
    }


    .booking-event strong {
      display: block;

      margin-top: 3px;

      overflow: hidden;

      color: #334155;

      font-size: 12px;

      text-overflow: ellipsis;

      white-space: nowrap;
    }


    .booking-meta {
      display: flex;

      gap: 25px;

      flex-wrap: wrap;

      margin-top: 14px;
    }


    .meta-block span {
      display: block;

      margin-bottom: 3px;

      color: #94a3b8;

      font-size: 7px;
      font-weight: 800;

      letter-spacing: 0.07em;
    }


    .meta-block strong {
      color: #475569;

      font-size: 9px;
    }


    .meta-block .amount {
      color: #0f172a;

      font-size: 11px;
    }



    /* ==========================================
       STATUS BADGE
       ========================================== */

    .status-badge {
      display: inline-flex;

      align-items: center;

      gap: 6px;

      flex-shrink: 0;

      padding:
        6px
        9px;

      border-radius: 999px;

      font-size: 8px;
      font-weight: 800;
    }


    .status-dot {
      width: 6px;
      height: 6px;

      border-radius: 50%;

      background: currentColor;
    }


    .status-confirmed {
      background: #ecfdf5;
      color: #047857;
    }


    .status-pending {
      background: #fff7ed;
      color: #c2410c;
    }


    .status-cancelled {
      background: #fef2f2;
      color: #b91c1c;
    }


    .status-expired {
      background: #f1f5f9;
      color: #64748b;
    }


    .status-default {
      background: #eff6ff;
      color: #1d4ed8;
    }



    /* ==========================================
       ACTIONS
       ========================================== */

    .booking-actions {
      display: grid;

      gap: 7px;

      min-width: 110px;
    }


    .booking-actions a,
    .booking-actions button {
      display: flex;

      align-items: center;
      justify-content: center;

      gap: 7px;

      min-height: 36px;

      padding:
        0
        12px;

      border-radius: 8px;

      font-size: 9px;
      font-weight: 800;

      text-decoration: none;

      cursor: pointer;

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }


    .details-button {
      border:
        1px solid
        #cbd5e1;

      background: #ffffff;

      color: #334155;
    }


    .payment-button {
      border:
        1px solid
        #059669;

      background: #059669;

      color: #ffffff;
    }


    .cancel-button {
      border:
        1px solid
        #fecaca;

      background: #fff7f7;

      color: #b91c1c;
    }


    .booking-actions a:hover,
    .booking-actions button:hover:not(:disabled) {
      transform:
        translateY(-1px);
    }


    .booking-actions button:disabled {
      opacity: 0.55;

      cursor: not-allowed;
    }



    /* ==========================================
       ERROR / EMPTY
       ========================================== */

    .action-error,
    .error-panel {
      display: flex;

      align-items: center;

      gap: 11px;

      border:
        1px solid
        #fecaca;

      border-radius: 11px;

      background: #fff7f7;
    }


    .action-error {
      margin-bottom: 15px;

      padding:
        11px
        13px;
    }


    .action-error span,
    .error-icon {
      display: grid;

      place-items: center;

      flex-shrink: 0;

      border-radius: 50%;

      background: #fee2e2;

      color: #b91c1c;

      font-weight: 850;
    }


    .action-error span {
      width: 23px;
      height: 23px;

      font-size: 9px;
    }


    .action-error p {
      margin: 0;

      color: #b91c1c;

      font-size: 9px;
    }


    .filter-empty,
    .empty-state {
      text-align: center;

      border:
        1px dashed
        #cbd5e1;

      border-radius: 15px;

      background: #ffffff;
    }


    .filter-empty {
      padding:
        42px
        20px;
    }


    .filter-empty-icon,
    .empty-illustration {
      display: grid;

      place-items: center;

      margin:
        0
        auto
        13px;

      background: #eff6ff;

      color: #2563eb;

      font-weight: 850;
    }


    .filter-empty-icon {
      width: 43px;
      height: 43px;

      border-radius: 11px;

      font-size: 9px;
    }


    .filter-empty h3 {
      margin: 0;

      color: #0f172a;

      font-size: 15px;
    }


    .filter-empty p {
      margin:
        6px
        0
        15px;

      color: #64748b;

      font-size: 9px;
    }


    .filter-empty button {
      padding:
        9px
        13px;

      border: none;

      border-radius: 8px;

      background: #0f172a;

      color: #ffffff;

      font-size: 9px;
      font-weight: 750;

      cursor: pointer;
    }


    .empty-state {
      width: 100%;
      max-width: 1180px;

      margin: 0 auto;

      padding:
        65px
        25px;
    }


    .empty-illustration {
      width: 60px;
      height: 60px;

      border-radius: 16px;

      font-size: 13px;
    }


    .empty-label {
      color: #0891b2;

      font-size: 9px;
      font-weight: 850;

      letter-spacing: 0.12em;
    }


    .empty-state h2 {
      margin:
        9px
        0
        7px;

      color: #0f172a;

      font-size: 24px;
    }


    .empty-state p {
      max-width: 450px;

      margin:
        0
        auto
        20px;

      color: #64748b;

      font-size: 11px;

      line-height: 1.6;
    }


    .empty-state a {
      display: inline-flex;

      align-items: center;

      gap: 8px;

      padding:
        11px
        16px;

      border-radius: 9px;

      background:
        linear-gradient(
          135deg,
          #06b6d4,
          #2563eb
        );

      color: #ffffff;

      font-size: 10px;
      font-weight: 800;

      text-decoration: none;
    }



    /* ==========================================
       LOADING
       ========================================== */

    .loading-panel,
    .error-panel {
      width: 100%;
      max-width: 1180px;

      margin: 0 auto;

      padding: 23px;

      background: #ffffff;
    }


    .loading-panel {
      display: flex;

      align-items: center;

      gap: 14px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 13px;
    }


    .loading-spinner {
      width: 31px;
      height: 31px;

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


    .loading-panel h2 {
      margin:
        0
        0
        3px;

      font-size: 13px;
    }


    .loading-panel p {
      margin: 0;

      color: #64748b;

      font-size: 9px;
    }


    .error-panel {
      display: grid;

      grid-template-columns:
        auto
        minmax(0, 1fr)
        auto;
    }


    .error-icon {
      width: 32px;
      height: 32px;
    }


    .error-copy strong {
      color: #991b1b;

      font-size: 10px;
    }


    .error-copy p {
      margin:
        3px
        0
        0;

      color: #b91c1c;

      font-size: 9px;
    }


    .error-panel button {
      padding:
        8px
        11px;

      border: none;

      border-radius: 7px;

      background: #dc2626;

      color: #ffffff;

      font-size: 9px;
      font-weight: 750;

      cursor: pointer;
    }



    /* ==========================================
       TABLET
       ========================================== */

    @media (max-width: 900px) {

      .summary-grid {
        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );
      }


      .booking-card {
        grid-template-columns:
          48px
          minmax(0, 1fr);
      }


      .booking-actions {
        grid-column:
          1 / -1;

        display: flex;

        padding-left: 65px;
      }


      .booking-actions a,
      .booking-actions button {
        flex: 1;
      }

    }



    /* ==========================================
       MOBILE
       ========================================== */

    @media (max-width: 620px) {

      .bookings-page {
        padding:
          30px
          14px
          50px;
      }


      .page-hero {
        align-items: flex-start;

        flex-direction: column;
      }


      .page-hero h1 {
        font-size: 30px;
      }


      .hero-actions {
        width: 100%;
      }


      .hero-actions > * {
        flex: 1;
      }


      .summary-grid {
        grid-template-columns: 1fr 1fr;
      }


      .summary-card {
        min-height: 76px;

        padding: 13px;
      }


      .summary-card strong {
        font-size: 19px;
      }


      .section-header {
        align-items: flex-start;

        flex-direction: column;
      }


      .booking-card {
        grid-template-columns: 42px minmax(0, 1fr);

        align-items: flex-start;

        padding:
          18px
          15px
          18px
          20px;
      }


      .event-mark {
        width: 42px;
        height: 42px;

        font-size: 15px;
      }


      .booking-top-row {
        flex-direction: column;
      }


      .booking-event strong {
        white-space: normal;
      }


      .booking-meta {
        gap: 14px;
      }


      .booking-actions {
        padding-left: 0;

        flex-wrap: wrap;
      }


      .booking-actions a,
      .booking-actions button {
        min-width: 90px;
      }


      .error-panel {
        grid-template-columns:
          auto
          minmax(0, 1fr);
      }


      .error-panel button {
        grid-column: 2;

        justify-self: flex-start;
      }

    }


    @media (max-width: 430px) {

      .summary-grid {
        grid-template-columns: 1fr;
      }


      .hero-actions {
        flex-direction: column;
      }


      .booking-actions {
        flex-direction: column;
      }

    }

  `]
})
export class BookingHistoryComponent
  implements OnInit {

  bookings: BookingResponse[] = [];

  loading = true;

  error = '';

  actionError = '';

  selectedFilter:
    BookingFilter = 'all';

  cancellingBookingId:
    number | null = null;


  constructor(
    private bookingService:
      BookingService
  ) {}


  ngOnInit(): void {

    this.loadBookings();

  }


  get confirmedCount(): number {

    return this.bookings.filter(
      booking =>
        this.normalizedStatus(booking)
          === 'confirmed'
    ).length;

  }


  get pendingCount(): number {

    return this.bookings.filter(
      booking =>
        this.normalizedStatus(booking)
          === 'pending'
    ).length;

  }


  get cancelledCount(): number {

    return this.bookings.filter(
      booking =>
        this.normalizedStatus(booking)
          === 'cancelled'
    ).length;

  }


  get expiredCount(): number {

    return this.bookings.filter(
      booking =>
        this.normalizedStatus(booking)
          === 'expired'
    ).length;

  }


  get visibleBookings():
    BookingResponse[] {

    if (
      this.selectedFilter === 'all'
    ) {

      return this.bookings;

    }


    return this.bookings.filter(
      booking =>
        this.normalizedStatus(booking)
          === this.selectedFilter
    );

  }


  setFilter(
    filter: BookingFilter
  ): void {

    this.selectedFilter =
      filter;

    this.actionError = '';

  }


  normalizedStatus(
    booking: BookingResponse
  ): string {

    return String(
      booking.status ?? ''
    )
      .trim()
      .toLowerCase();

  }


  getStatusClass(
    status?: string | null
  ): string {

    switch (
      String(status ?? '')
        .trim()
        .toLowerCase()
    ) {

      case 'confirmed':
        return 'status-confirmed';

      case 'pending':
        return 'status-pending';

      case 'cancelled':
        return 'status-cancelled';

      case 'expired':
        return 'status-expired';

      default:
        return 'status-default';

    }

  }


  getStatusStripClass(
    status?: string | null
  ): string {

    switch (
      String(status ?? '')
        .trim()
        .toLowerCase()
    ) {

      case 'confirmed':
        return 'strip-confirmed';

      case 'pending':
        return 'strip-pending';

      case 'cancelled':
        return 'strip-cancelled';

      case 'expired':
        return 'strip-expired';

      default:
        return 'strip-default';

    }

  }


  getEventInitial(
    booking: BookingResponse
  ): string {

    const name =
      booking.eventName?.trim();


    if (name) {

      return name
        .charAt(0)
        .toUpperCase();

    }


    return 'E';

  }


  getBookingId(
    booking: BookingResponse
  ): number | null {

    const id =
      booking.id ??
      booking.bookingId;


    if (
      id === undefined ||
      id === null
    ) {

      return null;

    }


    const numericId =
      Number(id);


    if (
      Number.isNaN(numericId) ||
      numericId <= 0
    ) {

      return null;

    }


    return numericId;

  }


  loadBookings(): void {

    this.error = '';

    this.actionError = '';


    const customerId =
      getCurrentCustomerId();


    if (!customerId) {

      this.loading = false;

      this.error =
        'Customer session not found.';

      return;

    }


    this.loading = true;


    this.bookingService
      .getCustomerBookings(
        customerId
      )
      .subscribe({

        next: result => {

          this.bookings =
            Array.isArray(result)
              ? result
              : [];


          this.loading = false;

        },


        error: err => {

          this.loading = false;


          this.error =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to load bookings.';

        }

      });

  }


  cancel(
    booking: BookingResponse
  ): void {

    this.actionError = '';


    const bookingId =
      this.getBookingId(booking);


    if (!bookingId) {

      this.actionError =
        'Booking ID was not found.';

      return;

    }


    const confirmed =
      confirm(
        `Cancel booking ${booking.bookingNumber}?`
      );


    if (!confirmed) {

      return;

    }


    this.cancellingBookingId =
      bookingId;


    this.bookingService
      .cancelBooking(
        bookingId
      )
      .subscribe({

        next: () => {

          this.cancellingBookingId =
            null;


          this.loadBookings();

        },


        error: err => {

          this.cancellingBookingId =
            null;


          this.actionError =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to cancel booking.';

        }

      });

  }

}