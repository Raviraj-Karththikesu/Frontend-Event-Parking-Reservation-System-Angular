import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  DashboardService
} from '../../services/dashboard.service';

import {
  AdminDashboard
} from '../../models/dashboard.models';


@Component({
  selector: 'app-admin-dashboard',

  standalone: true,

  imports: [
    CommonModule
  ],

  template: `
    <div class="admin-page">

      <div class="admin-container">


        <!-- =========================
             PAGE HEADER
             ========================= -->
        <header class="admin-header">

          <div class="header-copy">

            <span class="eyebrow">
              EVENTPARK ADMIN
            </span>

            <h1>
              Dashboard Overview
            </h1>

            <p>
              Monitor the current performance of events,
              reservations, customers and platform revenue.
            </p>

          </div>


          <div class="header-actions">

            <div
              class="updated-info"
              *ngIf="lastUpdated">

              <span class="updated-label">
                Last updated
              </span>

              <strong>
                {{
                  lastUpdated
                    | date:'mediumTime'
                }}
              </strong>

            </div>


            <button
              type="button"
              class="refresh-button"
              [disabled]="loading"
              (click)="loadDashboard()">

              <span
                class="refresh-icon"
                [class.refresh-icon--loading]="loading">

                ↻

              </span>

              {{
                loading
                  ? 'Refreshing'
                  : 'Refresh'
              }}

            </button>

          </div>

        </header>



        <!-- =========================
             LOADING
             ========================= -->
        <div
          class="state-card"
          *ngIf="loading && !dashboard">

          <div class="spinner"></div>

          <div>

            <h2>
              Loading dashboard
            </h2>

            <p>
              Retrieving the latest platform statistics.
            </p>

          </div>

        </div>



        <!-- =========================
             ERROR
             ========================= -->
        <div
          class="error-card"
          *ngIf="
            !loading &&
            error
          ">

          <div class="error-icon">
            !
          </div>

          <div class="error-content">

            <strong>
              Unable to load dashboard
            </strong>

            <p>
              {{ error }}
            </p>

          </div>

          <button
            type="button"
            (click)="loadDashboard()">

            Try Again

          </button>

        </div>



        <!-- =========================
             DASHBOARD CONTENT
             ========================= -->
        <ng-container
          *ngIf="
            dashboard &&
            !error
          ">


          <!-- =========================
               INTRO STRIP
               ========================= -->
          <section class="overview-strip">

            <div>

              <span class="overview-label">
                PLATFORM OVERVIEW
              </span>

              <h2>
                Current system activity
              </h2>

              <p>
                Live summary from the EventPark
                reservation platform.
              </p>

            </div>


            <div class="system-status">

              <span class="status-dot"></span>

              System Active

            </div>

          </section>



          <!-- =========================
               PRIMARY METRICS
               ========================= -->
          <section class="metrics-grid">


            <!-- TOTAL EVENTS -->
            <article class="metric-card">

              <div class="metric-header">

                <div
                  class="
                    metric-icon
                    metric-icon--blue
                  ">

                  EV

                </div>

                <span class="metric-category">
                  EVENTS
                </span>

              </div>


              <div class="metric-value">

                {{
                  dashboard.totalEvents
                }}

              </div>


              <h3>
                Total Events
              </h3>

              <p>
                Events currently registered
                on the platform.
              </p>

            </article>



            <!-- TOTAL BOOKINGS -->
            <article class="metric-card">

              <div class="metric-header">

                <div
                  class="
                    metric-icon
                    metric-icon--violet
                  ">

                  BK

                </div>

                <span class="metric-category">
                  BOOKINGS
                </span>

              </div>


              <div class="metric-value">

                {{
                  dashboard.totalBookings
                }}

              </div>


              <h3>
                Total Bookings
              </h3>

              <p>
                Reservations created by
                customers across events.
              </p>

            </article>



            <!-- AVAILABLE SEATS -->
            <article class="metric-card">

              <div class="metric-header">

                <div
                  class="
                    metric-icon
                    metric-icon--green
                  ">

                  ST

                </div>

                <span class="metric-category">
                  SEATS
                </span>

              </div>


              <div class="metric-value">

                {{
                  dashboard.availableSeats
                }}

              </div>


              <h3>
                Available Seats
              </h3>

              <p>
                Seats currently ready
                for reservation.
              </p>

            </article>



            <!-- PARKING -->
            <article class="metric-card">

              <div class="metric-header">

                <div
                  class="
                    metric-icon
                    metric-icon--orange
                  ">

                  PK

                </div>

                <span class="metric-category">
                  PARKING
                </span>

              </div>


              <div class="metric-value">

                {{
                  dashboard.occupiedParkingSlots
                }}

              </div>


              <h3>
                Occupied Parking
              </h3>

              <p>
                Parking spaces currently
                assigned to bookings.
              </p>

            </article>



            <!-- CUSTOMERS -->
            <article class="metric-card">

              <div class="metric-header">

                <div
                  class="
                    metric-icon
                    metric-icon--cyan
                  ">

                  CU

                </div>

                <span class="metric-category">
                  CUSTOMERS
                </span>

              </div>


              <div class="metric-value">

                {{
                  dashboard.totalCustomers
                }}

              </div>


              <h3>
                Total Customers
              </h3>

              <p>
                Registered customer accounts
                using EventPark.
              </p>

            </article>



            <!-- REVENUE -->
            <article
              class="
                metric-card
                revenue-card
              ">

              <div class="metric-header">

                <div
                  class="
                    metric-icon
                    metric-icon--revenue
                  ">

                  Rs

                </div>

                <span class="revenue-badge">
                  REVENUE
                </span>

              </div>


              <div
                class="
                  metric-value
                  revenue-value
                ">

                Rs.
                {{
                  dashboard.totalRevenue
                    | number:'1.2-2'
                }}

              </div>


              <h3>
                Total Revenue
              </h3>

              <p>
                Revenue received through
                completed payment transactions.
              </p>

            </article>

          </section>



          <!-- =========================
               INFORMATION FOOTER
               ========================= -->
          <section class="dashboard-note">

            <div class="note-icon">
              i
            </div>


            <div>

              <strong>
                Dashboard information
              </strong>

              <p>
                These statistics are calculated from
                the latest event, booking, seat,
                parking, customer and payment records.
              </p>

            </div>

          </section>


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

    .admin-page {
      min-height: 100vh;

      padding:
        46px
        24px
        70px;

      background:
        #f5f7fb;

      color: #0f172a;
    }


    .admin-container {
      width: 100%;
      max-width: 1180px;

      margin: 0 auto;
    }



    /* =========================
       HEADER
       ========================= */

    .admin-header {
      display: flex;

      align-items: flex-end;
      justify-content: space-between;

      gap: 30px;

      margin-bottom: 34px;
    }


    .header-copy {
      max-width: 650px;
    }


    .eyebrow {
      display: inline-block;

      margin-bottom: 9px;

      color: #2563eb;

      font-size: 11px;
      font-weight: 800;

      letter-spacing: 0.16em;
    }


    .admin-header h1 {
      margin: 0;

      color: #0f172a;

      font-size: 36px;
      font-weight: 800;

      line-height: 1.1;

      letter-spacing: -0.03em;
    }


    .admin-header p {
      margin:
        10px
        0
        0;

      color: #64748b;

      font-size: 14px;

      line-height: 1.6;
    }



    /* =========================
       HEADER ACTIONS
       ========================= */

    .header-actions {
      display: flex;

      align-items: center;

      gap: 14px;
    }


    .updated-info {
      padding-right: 14px;

      border-right:
        1px solid
        #e2e8f0;

      text-align: right;
    }


    .updated-label {
      display: block;

      margin-bottom: 3px;

      color: #94a3b8;

      font-size: 10px;
      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: 0.05em;
    }


    .updated-info strong {
      color: #475569;

      font-size: 12px;
      font-weight: 700;
    }


    .refresh-button {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      gap: 8px;

      min-height: 42px;

      padding:
        0
        15px;

      border:
        1px solid
        #cbd5e1;

      border-radius: 9px;

      background: #ffffff;

      color: #334155;

      font-size: 12px;
      font-weight: 700;

      cursor: pointer;

      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;
    }


    .refresh-button:hover:not(:disabled) {
      border-color: #94a3b8;

      box-shadow:
        0 4px 12px
        rgba(
          15,
          23,
          42,
          0.06
        );

      transform:
        translateY(-1px);
    }


    .refresh-button:disabled {
      opacity: 0.65;

      cursor: not-allowed;
    }


    .refresh-icon {
      display: inline-block;

      font-size: 17px;
    }


    .refresh-icon--loading {
      animation:
        rotate
        0.8s
        linear
        infinite;
    }


    @keyframes rotate {

      to {
        transform:
          rotate(360deg);
      }

    }



    /* =========================
       OVERVIEW STRIP
       ========================= */

    .overview-strip {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 24px;

      margin-bottom: 20px;

      padding:
        22px
        24px;

      border:
        1px solid
        #dbe4f0;

      border-radius: 14px;

      background: #ffffff;

      box-shadow:
        0 3px 10px
        rgba(
          15,
          23,
          42,
          0.035
        );
    }


    .overview-label {
      display: block;

      margin-bottom: 5px;

      color: #64748b;

      font-size: 10px;
      font-weight: 800;

      letter-spacing: 0.12em;
    }


    .overview-strip h2 {
      margin: 0;

      color: #0f172a;

      font-size: 19px;
      font-weight: 750;
    }


    .overview-strip p {
      margin:
        5px
        0
        0;

      color: #94a3b8;

      font-size: 12px;
    }


    .system-status {
      display: inline-flex;

      align-items: center;

      gap: 8px;

      flex-shrink: 0;

      padding:
        8px
        11px;

      border:
        1px solid
        #bbf7d0;

      border-radius: 999px;

      background: #f0fdf4;

      color: #047857;

      font-size: 10px;
      font-weight: 800;

      text-transform: uppercase;
    }


    .status-dot {
      width: 7px;
      height: 7px;

      border-radius: 50%;

      background: #22c55e;

      box-shadow:
        0 0 0 3px
        #dcfce7;
    }



    /* =========================
       METRICS GRID
       ========================= */

    .metrics-grid {
      display: grid;

      grid-template-columns:
        repeat(
          3,
          minmax(0, 1fr)
        );

      gap: 18px;
    }



    /* =========================
       METRIC CARD
       ========================= */

    .metric-card {
      position: relative;

      min-height: 230px;

      padding: 23px;

      overflow: hidden;

      border:
        1px solid
        #dde5ef;

      border-radius: 15px;

      background: #ffffff;

      box-shadow:
        0 4px 14px
        rgba(
          15,
          23,
          42,
          0.04
        );

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        border-color 0.2s ease;
    }


    .metric-card:hover {
      border-color: #cbd5e1;

      transform:
        translateY(-3px);

      box-shadow:
        0 12px 25px
        rgba(
          15,
          23,
          42,
          0.08
        );
    }



    /* =========================
       CARD HEADER
       ========================= */

    .metric-header {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 14px;
    }


    .metric-icon {
      display: grid;

      place-items: center;

      width: 44px;
      height: 44px;

      border-radius: 11px;

      font-size: 10px;
      font-weight: 850;

      letter-spacing: 0.04em;
    }


    .metric-icon--blue {
      background: #eff6ff;

      color: #2563eb;
    }


    .metric-icon--violet {
      background: #f5f3ff;

      color: #7c3aed;
    }


    .metric-icon--green {
      background: #ecfdf5;

      color: #059669;
    }


    .metric-icon--orange {
      background: #fff7ed;

      color: #ea580c;
    }


    .metric-icon--cyan {
      background: #ecfeff;

      color: #0891b2;
    }


    .metric-icon--revenue {
      background: #dcfce7;

      color: #15803d;
    }


    .metric-category {
      color: #94a3b8;

      font-size: 9px;
      font-weight: 850;

      letter-spacing: 0.12em;
    }



    /* =========================
       METRIC CONTENT
       ========================= */

    .metric-value {
      margin-top: 27px;

      color: #0f172a;

      font-size: 39px;
      font-weight: 850;

      line-height: 1;

      letter-spacing: -0.04em;
    }


    .metric-card h3 {
      margin:
        13px
        0
        0;

      color: #1e293b;

      font-size: 14px;
      font-weight: 750;
    }


    .metric-card p {
      max-width: 250px;

      margin:
        8px
        0
        0;

      color: #64748b;

      font-size: 11px;

      line-height: 1.55;
    }



    /* =========================
       REVENUE CARD
       ========================= */

    .revenue-card {
      border-color: #bbf7d0;

      background:
        linear-gradient(
          145deg,
          #ffffff 0%,
          #f6fff9 100%
        );
    }


    .revenue-card::after {
      content: '';

      position: absolute;

      right: -60px;
      bottom: -60px;

      width: 150px;
      height: 150px;

      border-radius: 50%;

      background:
        rgba(
          34,
          197,
          94,
          0.06
        );
    }


    .revenue-badge {
      padding:
        5px
        8px;

      border-radius: 999px;

      background: #ecfdf5;

      color: #15803d;

      font-size: 9px;
      font-weight: 850;

      letter-spacing: 0.09em;
    }


    .revenue-value {
      position: relative;

      z-index: 1;

      color: #166534;

      font-size: 30px;
    }



    /* =========================
       INFO NOTE
       ========================= */

    .dashboard-note {
      display: flex;

      align-items: flex-start;

      gap: 12px;

      margin-top: 22px;

      padding:
        16px
        18px;

      border:
        1px solid
        #dbeafe;

      border-radius: 12px;

      background: #f8fbff;
    }


    .note-icon {
      display: grid;

      place-items: center;

      width: 29px;
      height: 29px;

      flex-shrink: 0;

      border-radius: 50%;

      background: #dbeafe;

      color: #1d4ed8;

      font-size: 12px;
      font-weight: 800;
    }


    .dashboard-note strong {
      display: block;

      color: #1e3a8a;

      font-size: 11px;
    }


    .dashboard-note p {
      margin:
        4px
        0
        0;

      color: #64748b;

      font-size: 10px;

      line-height: 1.5;
    }



    /* =========================
       LOADING
       ========================= */

    .state-card {
      display: flex;

      align-items: center;

      gap: 16px;

      padding: 28px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 14px;

      background: #ffffff;
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
        rotate
        0.8s
        linear
        infinite;
    }


    .state-card h2 {
      margin:
        0
        0
        4px;

      color: #0f172a;

      font-size: 15px;
    }


    .state-card p {
      margin: 0;

      color: #64748b;

      font-size: 12px;
    }



    /* =========================
       ERROR
       ========================= */

    .error-card {
      display: grid;

      grid-template-columns:
        auto
        minmax(0, 1fr)
        auto;

      align-items: center;

      gap: 14px;

      padding: 18px;

      border:
        1px solid
        #fecaca;

      border-radius: 12px;

      background: #fffafa;
    }


    .error-icon {
      display: grid;

      place-items: center;

      width: 36px;
      height: 36px;

      border-radius: 50%;

      background: #fee2e2;

      color: #b91c1c;

      font-weight: 800;
    }


    .error-content strong {
      display: block;

      color: #991b1b;

      font-size: 12px;
    }


    .error-content p {
      margin:
        4px
        0
        0;

      color: #b91c1c;

      font-size: 11px;
    }


    .error-card button {
      padding:
        8px
        12px;

      border: none;

      border-radius: 8px;

      background: #dc2626;

      color: #ffffff;

      font-size: 11px;
      font-weight: 700;

      cursor: pointer;
    }



    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 960px) {

      .metrics-grid {
        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );
      }

    }


    @media (max-width: 680px) {

      .admin-page {
        padding:
          30px
          14px
          50px;
      }


      .admin-header {
        align-items: flex-start;

        flex-direction: column;
      }


      .admin-header h1 {
        font-size: 29px;
      }


      .header-actions {
        width: 100%;

        justify-content: space-between;
      }


      .updated-info {
        text-align: left;
      }


      .overview-strip {
        align-items: flex-start;

        flex-direction: column;
      }


      .metrics-grid {
        grid-template-columns:
          1fr;
      }


      .metric-card {
        min-height: 205px;
      }


      .error-card {
        grid-template-columns:
          auto
          minmax(0, 1fr);
      }


      .error-card button {
        grid-column: 2;

        justify-self: flex-start;
      }

    }


    @media (max-width: 430px) {

      .header-actions {
        align-items: stretch;

        flex-direction: column;
      }


      .updated-info {
        padding:
          0
          0
          10px;

        border-right: none;

        border-bottom:
          1px solid
          #e2e8f0;
      }


      .refresh-button {
        width: 100%;
      }

    }

  `]
})


export class AdminDashboardComponent
  implements OnInit {

  dashboard?:
    AdminDashboard;

  loading = true;

  error = '';

  lastUpdated?: Date;


  constructor(
    private dashboardService:
      DashboardService
  ) {}


  ngOnInit(): void {

    this.loadDashboard();

  }


  loadDashboard(): void {

    this.loading = true;

    this.error = '';


    this.dashboardService
      .getAdminDashboard()
      .subscribe({

        next: result => {

          this.dashboard =
            result;

          this.lastUpdated =
            new Date();

          this.loading =
            false;

        },


        error: err => {

          this.loading =
            false;


          console.error(
            'Unable to load admin dashboard:',
            err
          );


          this.error =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to load admin dashboard.';

        }

      });

  }

}