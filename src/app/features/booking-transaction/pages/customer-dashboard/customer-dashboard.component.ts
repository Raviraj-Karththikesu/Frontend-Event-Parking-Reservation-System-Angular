import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import { RouterLink }
  from '@angular/router';

import { DashboardService }
  from '../../services/dashboard.service';

import { CustomerDashboard }
  from '../../models/dashboard.models';

import { getCurrentCustomerId }
  from '../../utils/auth-context.util';


@Component({
  selector: 'app-customer-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  template: `
    <div class="dashboard-page">

      <div class="dashboard-container">


        <!-- =========================
             PAGE HEADER
             ========================= -->
        <header class="page-header">

          <div>

            <p class="eyebrow">
              CUSTOMER PORTAL
            </p>

            <h1>
              Dashboard
            </h1>

            <p class="subtitle">
              Review your bookings, parking,
              payments and account activity.
            </p>

          </div>


          <button
            type="button"
            class="refresh-button"
            [disabled]="loading"
            (click)="loadDashboard()">

            <span class="refresh-icon">
              ↻
            </span>

            {{
              loading
                ? 'Refreshing...'
                : 'Refresh'
            }}

          </button>

        </header>



        <!-- =========================
             LOADING
             ========================= -->
        <div
          class="state-card"
          *ngIf="loading">

          <div class="spinner"></div>

          <div>

            <h2>
              Loading your dashboard
            </h2>

            <p>
              Retrieving your latest booking
              and account information.
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

            <h2>
              Dashboard unavailable
            </h2>

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
            !loading &&
            !error &&
            dashboard
          ">


          <!-- Summary heading -->
          <section class="section-heading">

            <div>

              <h2>
                Account Overview
              </h2>

              <p>
                A quick summary of your current
                EventPark activity.
              </p>

            </div>

          </section>



          <!-- =========================
               SUMMARY CARDS
               ========================= -->
          <section class="stats-grid">


            <!-- Upcoming Bookings -->
            <article class="stat-card">

              <div class="stat-header">

                <div
                  class="
                    stat-icon
                    stat-icon--blue
                  ">

                  BK

                </div>

                <span class="stat-label">
                  Upcoming Bookings
                </span>

              </div>


              <strong class="stat-value">

                {{
                  dashboard
                    .upcomingBookings
                    .length
                }}

              </strong>


              <p class="stat-description">
                Active upcoming event reservations.
              </p>


              <a
                routerLink="/bookings"
                class="stat-link">

                View bookings

                <span>
                  →
                </span>

              </a>

            </article>



            <!-- Reserved Parking -->
            <article class="stat-card">

              <div class="stat-header">

                <div
                  class="
                    stat-icon
                    stat-icon--purple
                  ">

                  PK

                </div>

                <span class="stat-label">
                  Reserved Parking
                </span>

              </div>


              <strong class="stat-value">

                {{
                  dashboard
                    .reservedParkingCount
                }}

              </strong>


              <p class="stat-description">
                Parking reservations linked
                to your bookings.
              </p>


              <a
                routerLink="/bookings"
                class="stat-link">

                View reservations

                <span>
                  →
                </span>

              </a>

            </article>



            <!-- Recent Payments -->
            <article class="stat-card">

              <div class="stat-header">

                <div
                  class="
                    stat-icon
                    stat-icon--green
                  ">

                  PY

                </div>

                <span class="stat-label">
                  Recent Payments
                </span>

              </div>


              <strong class="stat-value">

                {{
                  dashboard
                    .recentPayments
                    .length
                }}

              </strong>


              <p class="stat-description">
                Recently completed payment
                transactions.
              </p>


              <a
                routerLink="/bookings"
                class="stat-link">

                View booking history

                <span>
                  →
                </span>

              </a>

            </article>



            <!-- Notifications -->
            <article
              class="stat-card"
              [class.stat-card--attention]="
                dashboard
                  .unreadNotifications
                  .length > 0
              ">

              <div class="stat-header">

                <div
                  class="
                    stat-icon
                    stat-icon--orange
                  ">

                  NT

                </div>

                <span class="stat-label">
                  Unread Notifications
                </span>

              </div>


              <div class="notification-value-row">

                <strong class="stat-value">

                  {{
                    dashboard
                      .unreadNotifications
                      .length
                  }}

                </strong>


                <span
                  class="new-badge"
                  *ngIf="
                    dashboard
                      .unreadNotifications
                      .length > 0
                  ">

                  New

                </span>

              </div>


              <p class="stat-description">
                Updates that still require
                your attention.
              </p>


              <a
                routerLink="/notifications"
                class="stat-link">

                Open notifications

                <span>
                  →
                </span>

              </a>

            </article>

          </section>



          <!-- =========================
               QUICK ACTIONS
               ========================= -->
          <section class="quick-actions-section">

            <div class="section-heading">

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Access the most frequently
                  used customer features.
                </p>

              </div>

            </div>


            <div class="quick-actions">


              <a
                routerLink="/events"
                class="action-card">

                <div
                  class="
                    action-icon
                    action-icon--blue
                  ">

                  EV

                </div>

                <div>

                  <h3>
                    Browse Events
                  </h3>

                  <p>
                    Discover available events
                    and start a new booking.
                  </p>

                </div>

                <span class="action-arrow">
                  →
                </span>

              </a>



              <a
                routerLink="/bookings"
                class="action-card">

                <div
                  class="
                    action-icon
                    action-icon--purple
                  ">

                  BK

                </div>

                <div>

                  <h3>
                    My Bookings
                  </h3>

                  <p>
                    Review booking status,
                    payment and reservation details.
                  </p>

                </div>

                <span class="action-arrow">
                  →
                </span>

              </a>



              <a
                routerLink="/notifications"
                class="action-card">

                <div
                  class="
                    action-icon
                    action-icon--green
                  ">

                  NT

                </div>

                <div>

                  <h3>
                    Notifications
                  </h3>

                  <p>
                    View booking, payment
                    and account updates.
                  </p>

                </div>

                <span class="action-arrow">
                  →
                </span>

              </a>



              <a
                routerLink="/profile"
                class="action-card">

                <div
                  class="
                    action-icon
                    action-icon--slate
                  ">

                  AC

                </div>

                <div>

                  <h3>
                    My Account
                  </h3>

                  <p>
                    Review your customer
                    profile information.
                  </p>

                </div>

                <span class="action-arrow">
                  →
                </span>

              </a>

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

    .dashboard-page {
      min-height: 100vh;

      padding:
        48px
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


    .dashboard-container {
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

      margin-bottom: 38px;
    }


    .eyebrow {
      margin: 0 0 8px;

      color: #2563eb;

      font-size: 12px;
      font-weight: 800;

      letter-spacing: 0.16em;

      text-transform: uppercase;
    }


    .page-header h1 {
      margin: 0;

      color: #0f172a;

      font-size: 38px;
      font-weight: 800;

      letter-spacing: -0.03em;
    }


    .subtitle {
      max-width: 620px;

      margin: 10px 0 0;

      color: #64748b;

      font-size: 15px;

      line-height: 1.65;
    }



    /* =========================
       REFRESH BUTTON
       ========================= */

    .refresh-button {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      gap: 7px;

      min-height: 42px;

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


    .refresh-button:hover:not(:disabled) {
      border-color: #94a3b8;

      background: #f8fafc;

      transform:
        translateY(-1px);
    }


    .refresh-button:disabled {
      opacity: 0.6;

      cursor: not-allowed;
    }


    .refresh-icon {
      font-size: 18px;
    }



    /* =========================
       SECTION HEADINGS
       ========================= */

    .section-heading {
      display: flex;

      align-items: center;
      justify-content: space-between;

      margin-bottom: 18px;
    }


    .section-heading h2 {
      margin: 0;

      color: #0f172a;

      font-size: 20px;
      font-weight: 750;
    }


    .section-heading p {
      margin: 6px 0 0;

      color: #64748b;

      font-size: 13px;
    }



    /* =========================
       STAT GRID
       ========================= */

    .stats-grid {
      display: grid;

      grid-template-columns:
        repeat(
          4,
          minmax(0, 1fr)
        );

      gap: 18px;
    }


    .stat-card {
      position: relative;

      min-height: 220px;

      padding: 22px;

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

      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;
    }


    .stat-card:hover {
      border-color: #cbd5e1;

      box-shadow:
        0 12px 28px
        rgba(
          15,
          23,
          42,
          0.08
        );

      transform:
        translateY(-3px);
    }


    .stat-card--attention {
      border-color: #fed7aa;
    }


    .stat-header {
      display: flex;

      align-items: center;

      gap: 11px;
    }


    .stat-icon {
      display: grid;

      place-items: center;

      width: 42px;
      height: 42px;

      flex-shrink: 0;

      border-radius: 11px;

      font-size: 10px;
      font-weight: 800;

      letter-spacing: 0.05em;
    }


    .stat-icon--blue {
      background: #eff6ff;
      color: #1d4ed8;
    }


    .stat-icon--purple {
      background: #f5f3ff;
      color: #6d28d9;
    }


    .stat-icon--green {
      background: #ecfdf5;
      color: #047857;
    }


    .stat-icon--orange {
      background: #fff7ed;
      color: #c2410c;
    }


    .stat-label {
      color: #475569;

      font-size: 13px;
      font-weight: 700;
    }


    .stat-value {
      display: block;

      margin-top: 22px;

      color: #0f172a;

      font-size: 36px;
      font-weight: 800;

      letter-spacing: -0.03em;
    }


    .notification-value-row {
      display: flex;

      align-items: center;

      gap: 9px;
    }


    .new-badge {
      margin-top: 22px;

      padding:
        4px
        8px;

      border-radius: 999px;

      background: #fff7ed;

      color: #c2410c;

      font-size: 10px;
      font-weight: 800;

      text-transform: uppercase;
    }


    .stat-description {
      min-height: 42px;

      margin:
        8px
        0
        16px;

      color: #64748b;

      font-size: 12px;

      line-height: 1.55;
    }


    .stat-link {
      display: inline-flex;

      align-items: center;

      gap: 6px;

      color: #2563eb;

      text-decoration: none;

      font-size: 12px;
      font-weight: 700;
    }


    .stat-link:hover {
      color: #1d4ed8;
    }



    /* =========================
       QUICK ACTIONS
       ========================= */

    .quick-actions-section {
      margin-top: 44px;
    }


    .quick-actions {
      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 16px;
    }


    .action-card {
      display: grid;

      grid-template-columns:
        auto
        minmax(0, 1fr)
        auto;

      align-items: center;

      gap: 16px;

      padding: 20px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 14px;

      background: #ffffff;

      text-decoration: none;

      box-shadow:
        0 4px 14px
        rgba(
          15,
          23,
          42,
          0.035
        );

      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;
    }


    .action-card:hover {
      border-color: #bfdbfe;

      box-shadow:
        0 10px 22px
        rgba(
          15,
          23,
          42,
          0.07
        );

      transform:
        translateY(-2px);
    }


    .action-icon {
      display: grid;

      place-items: center;

      width: 46px;
      height: 46px;

      border-radius: 12px;

      font-size: 10px;
      font-weight: 800;
    }


    .action-icon--blue {
      background: #eff6ff;
      color: #1d4ed8;
    }


    .action-icon--purple {
      background: #f5f3ff;
      color: #6d28d9;
    }


    .action-icon--green {
      background: #ecfdf5;
      color: #047857;
    }


    .action-icon--slate {
      background: #f1f5f9;
      color: #475569;
    }


    .action-card h3 {
      margin: 0;

      color: #0f172a;

      font-size: 14px;
      font-weight: 750;
    }


    .action-card p {
      margin:
        5px
        0
        0;

      color: #64748b;

      font-size: 12px;

      line-height: 1.5;
    }


    .action-arrow {
      color: #94a3b8;

      font-size: 20px;

      transition:
        transform 0.2s ease,
        color 0.2s ease;
    }


    .action-card:hover
    .action-arrow {
      color: #2563eb;

      transform:
        translateX(3px);
    }



    /* =========================
       LOADING
       ========================= */

    .state-card {
      display: flex;

      align-items: center;

      gap: 16px;

      padding: 26px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 14px;

      background: #ffffff;
    }


    .state-card h2 {
      margin:
        0
        0
        5px;

      color: #0f172a;

      font-size: 16px;
    }


    .state-card p {
      margin: 0;

      color: #64748b;

      font-size: 13px;
    }


    .spinner {
      width: 32px;
      height: 32px;

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

      gap: 16px;

      padding: 20px;

      border:
        1px solid
        #fecaca;

      border-radius: 14px;

      background: #fffafa;
    }


    .error-icon {
      display: grid;

      place-items: center;

      width: 38px;
      height: 38px;

      border-radius: 50%;

      background: #fee2e2;

      color: #b91c1c;

      font-weight: 800;
    }


    .error-content h2 {
      margin:
        0
        0
        4px;

      color: #991b1b;

      font-size: 15px;
    }


    .error-content p {
      margin: 0;

      color: #7f1d1d;

      font-size: 13px;
    }


    .error-card button {
      padding:
        9px
        13px;

      border: none;

      border-radius: 8px;

      background: #dc2626;

      color: #ffffff;

      font-weight: 700;

      cursor: pointer;
    }


    .error-card button:hover {
      background: #b91c1c;
    }



    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 1000px) {

      .stats-grid {
        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );
      }

    }


    @media (max-width: 720px) {

      .dashboard-page {
        padding:
          32px
          14px
          50px;
      }


      .page-header {
        align-items: flex-start;

        flex-direction: column;
      }


      .refresh-button {
        width: 100%;
      }


      .quick-actions {
        grid-template-columns:
          1fr;
      }

    }


    @media (max-width: 520px) {

      .page-header h1 {
        font-size: 30px;
      }


      .stats-grid {
        grid-template-columns:
          1fr;
      }


      .stat-card {
        min-height: 200px;
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

  `]
})


export class CustomerDashboardComponent
  implements OnInit {

  dashboard?:
    CustomerDashboard;

  loading = true;

  error = '';


  constructor(
    private dashboardService:
      DashboardService
  ) {}


  ngOnInit(): void {

    this.loadDashboard();

  }



  loadDashboard(): void {

    const customerId =
      getCurrentCustomerId();


    this.error = '';

    this.loading = true;


    if (!customerId) {

      this.loading = false;

      this.error =
        'Customer session not found.';

      return;

    }


    this.dashboardService
      .getCustomerDashboard(
        customerId
      )
      .subscribe({

        next: result => {

          this.dashboard =
            result;

          this.loading =
            false;

        },


        error: err => {

          this.loading =
            false;


          this.error =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to load dashboard.';

        }

      });

  }

}