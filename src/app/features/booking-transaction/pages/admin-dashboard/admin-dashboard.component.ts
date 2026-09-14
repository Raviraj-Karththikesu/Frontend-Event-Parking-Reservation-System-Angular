import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

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
    CommonModule,
    RouterLink
  ],

  template: `
    <main class="dashboard-page">

      <div class="dashboard-container">

        <!-- =========================================
             HEADER
             ========================================= -->
        <header class="page-header">

          <div class="heading-copy">

            <span class="eyebrow">
              EVENTPARK ADMIN
            </span>

            <h1>
              Dashboard Overview
            </h1>

            <p>
              Monitor events, reservations, customers,
              seating, parking and platform revenue.
            </p>

          </div>


          <div class="header-actions">

            @if (lastUpdated) {

              <div class="last-updated">

                <span>
                  LAST UPDATED
                </span>

                <strong>
                  {{ lastUpdated | date:'mediumTime' }}
                </strong>

              </div>

            }


            <button
              type="button"
              class="refresh-button"
              [disabled]="loading"
              (click)="loadDashboard()">

              <span
                class="refresh-icon"
                [class.spinning]="loading">
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



        <!-- =========================================
             LOADING
             ========================================= -->
        @if (loading && !dashboard) {

          <section class="state-card">

            <div class="spinner"></div>

            <div>

              <h2>
                Loading dashboard
              </h2>

              <p>
                Retrieving the latest platform information.
              </p>

            </div>

          </section>

        }



        <!-- =========================================
             ERROR
             ========================================= -->
        @if (!loading && error) {

          <section class="error-card">

            <div class="error-icon">
              !
            </div>

            <div class="error-copy">

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

          </section>

        }



        <!-- =========================================
             DASHBOARD
             ========================================= -->
        @if (dashboard && !error) {

          <!-- HERO / PLATFORM PULSE -->
          <section class="platform-hero">

            <div class="hero-copy">

              <div class="system-pill">

                <span class="system-dot"></span>

                SYSTEM ACTIVE

              </div>

              <span class="hero-label">
                PLATFORM PERFORMANCE
              </span>

              <h2>
                EventPark is operating normally
              </h2>

              <p>
                Live administrative overview based on the
                latest reservation and payment records.
              </p>

            </div>


            <div class="hero-revenue">

              <span>
                TOTAL PLATFORM REVENUE
              </span>

              <strong>
                LKR
                {{
                  dashboard.totalRevenue
                    | number:'1.2-2'
                }}
              </strong>

              <small>
                Completed payment transactions
              </small>

            </div>

          </section>



          <!-- =========================================
               PRIMARY METRICS
               ========================================= -->
          <section class="metrics-grid">

            <!-- EVENTS -->
            <article class="metric-card">

              <div class="metric-top">

                <div class="metric-icon blue">
                  EV
                </div>

                <span class="metric-type">
                  EVENTS
                </span>

              </div>

              <strong class="metric-value">
                {{ dashboard.totalEvents | number }}
              </strong>

              <h3>
                Total Events
              </h3>

              <p>
                Events currently registered
                on EventPark.
              </p>

              <a
                routerLink="/admin/events"
                class="card-link">

                Manage Events
                <span>→</span>

              </a>

            </article>


            <!-- BOOKINGS -->
            <article class="metric-card">

              <div class="metric-top">

                <div class="metric-icon violet">
                  BK
                </div>

                <span class="metric-type">
                  BOOKINGS
                </span>

              </div>

              <strong class="metric-value">
                {{ dashboard.totalBookings | number }}
              </strong>

              <h3>
                Total Bookings
              </h3>

              <p>
                Reservations created by
                customers across events.
              </p>

              <div class="metric-note">
                {{ bookingsPerEvent | number:'1.1-1' }}
                bookings / event
              </div>

            </article>


            <!-- SEATS -->
            <article class="metric-card">

              <div class="metric-top">

                <div class="metric-icon green">
                  ST
                </div>

                <span class="metric-type">
                  SEATS
                </span>

              </div>

              <strong class="metric-value">
                {{ dashboard.availableSeats | number }}
              </strong>

              <h3>
                Available Seats
              </h3>

              <p>
                Seats currently available
                for customer reservations.
              </p>

              <div class="metric-note positive">
                Ready for booking
              </div>

            </article>


            <!-- PARKING -->
            <article class="metric-card">

              <div class="metric-top">

                <div class="metric-icon orange">
                  PK
                </div>

                <span class="metric-type">
                  PARKING
                </span>

              </div>

              <strong class="metric-value">
                {{
                  dashboard.occupiedParkingSlots
                    | number
                }}
              </strong>

              <h3>
                Occupied Parking
              </h3>

              <p>
                Parking spaces currently
                assigned to reservations.
              </p>

              <div class="metric-note">
                Active allocations
              </div>

            </article>


            <!-- CUSTOMERS -->
            <article class="metric-card">

              <div class="metric-top">

                <div class="metric-icon cyan">
                  CU
                </div>

                <span class="metric-type">
                  CUSTOMERS
                </span>

              </div>

              <strong class="metric-value">
                {{ dashboard.totalCustomers | number }}
              </strong>

              <h3>
                Total Customers
              </h3>

              <p>
                Registered customer accounts
                using the EventPark platform.
              </p>

              <a
                routerLink="/admin/customers"
                class="card-link">

                Manage Customers
                <span>→</span>

              </a>

            </article>


            <!-- REVENUE -->
            <article class="metric-card revenue-card">

              <div class="revenue-pattern"></div>

              <div class="metric-top">

                <div class="metric-icon revenue-icon">
                  Rs
                </div>

                <span class="revenue-badge">
                  REVENUE
                </span>

              </div>

              <strong class="revenue-value">
                LKR
                {{
                  dashboard.totalRevenue
                    | number:'1.2-2'
                }}
              </strong>

              <h3>
                Total Revenue
              </h3>

              <p>
                Revenue collected through
                completed payment transactions.
              </p>

              <div class="metric-note revenue-note">

                LKR
                {{
                  averageRevenuePerBooking
                    | number:'1.2-2'
                }}
                avg / booking

              </div>

            </article>

          </section>



          <!-- =========================================
               LOWER CONTENT
               ========================================= -->
          <section class="lower-grid">


            <!-- OPERATIONAL INSIGHTS -->
            <article class="panel-card">

              <div class="panel-heading">

                <div>

                  <span class="section-label">
                    OPERATIONAL INSIGHTS
                  </span>

                  <h2>
                    Platform Snapshot
                  </h2>

                  <p>
                    Helpful ratios calculated from
                    current dashboard totals.
                  </p>

                </div>

                <span class="live-badge">
                  LIVE DATA
                </span>

              </div>


              <div class="insight-list">

                <div class="insight-row">

                  <div class="insight-icon blue">
                    BE
                  </div>

                  <div class="insight-copy">

                    <strong>
                      Bookings per Event
                    </strong>

                    <span>
                      Average reservations created
                      for each event.
                    </span>

                  </div>

                  <b>
                    {{
                      bookingsPerEvent
                        | number:'1.1-1'
                    }}
                  </b>

                </div>


                <div class="insight-row">

                  <div class="insight-icon violet">
                    BC
                  </div>

                  <div class="insight-copy">

                    <strong>
                      Bookings per Customer
                    </strong>

                    <span>
                      Average reservation activity
                      per registered customer.
                    </span>

                  </div>

                  <b>
                    {{
                      bookingsPerCustomer
                        | number:'1.1-1'
                    }}
                  </b>

                </div>


                <div class="insight-row">

                  <div class="insight-icon green">
                    RB
                  </div>

                  <div class="insight-copy">

                    <strong>
                      Revenue per Booking
                    </strong>

                    <span>
                      Average platform revenue
                      compared with bookings.
                    </span>

                  </div>

                  <b class="revenue-text">
                    LKR
                    {{
                      averageRevenuePerBooking
                        | number:'1.2-2'
                    }}
                  </b>

                </div>

              </div>

            </article>



            <!-- QUICK ACTIONS -->
            <aside class="panel-card">

              <div class="panel-heading">

                <div>

                  <span class="section-label">
                    QUICK ACTIONS
                  </span>

                  <h2>
                    Administration
                  </h2>

                  <p>
                    Jump directly to common
                    management areas.
                  </p>

                </div>

              </div>


              <nav class="quick-actions">

                <a routerLink="/admin/events">

                  <div class="action-icon blue">
                    EV
                  </div>

                  <div>

                    <strong>
                      Manage Events
                    </strong>

                    <span>
                      Events, seats and parking
                    </span>

                  </div>

                  <b>
                    →
                  </b>

                </a>


                <a routerLink="/admin/venues">

                  <div class="action-icon cyan">
                    VN
                  </div>

                  <div>

                    <strong>
                      Manage Venues
                    </strong>

                    <span>
                      Locations and capacities
                    </span>

                  </div>

                  <b>
                    →
                  </b>

                </a>


                <a routerLink="/admin/categories">

                  <div class="action-icon violet">
                    CT
                  </div>

                  <div>

                    <strong>
                      Manage Categories
                    </strong>

                    <span>
                      Event classifications
                    </span>

                  </div>

                  <b>
                    →
                  </b>

                </a>


                <a routerLink="/admin/customers">

                  <div class="action-icon green">
                    CU
                  </div>

                  <div>

                    <strong>
                      Manage Customers
                    </strong>

                    <span>
                      Customer account access
                    </span>

                  </div>

                  <b>
                    →
                  </b>

                </a>

              </nav>

            </aside>

          </section>



          <!-- =========================================
               FOOTER NOTE
               ========================================= -->
          <section class="dashboard-note">

            <div class="note-icon">
              i
            </div>

            <div>

              <strong>
                Dashboard information
              </strong>

              <p>
                Statistics are calculated from current
                event, booking, seat, parking, customer
                and completed payment records.
              </p>

            </div>

          </section>

        }

      </div>

    </main>
  `,

  styles: [`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }

    button,
    a {
      font: inherit;
    }

    .dashboard-page {
      min-height: 100vh;
      padding: 42px 24px 70px;
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
      max-width: 1240px;
      margin: 0 auto;
    }

    /* HEADER */

    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 30px;
      margin-bottom: 28px;
    }

    .heading-copy {
      max-width: 690px;
    }

    .eyebrow,
    .section-label {
      color: #2563eb;
      font-size: 9px;
      font-weight: 850;
      letter-spacing: .15em;
    }

    .heading-copy h1 {
      margin: 7px 0 8px;
      color: #0f172a;
      font-size: 38px;
      font-weight: 850;
      letter-spacing: -.04em;
      line-height: 1.1;
    }

    .heading-copy p {
      margin: 0;
      color: #64748b;
      font-size: 12px;
      line-height: 1.6;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 13px;
    }

    .last-updated {
      padding-right: 13px;
      border-right: 1px solid #e2e8f0;
      text-align: right;
    }

    .last-updated span {
      display: block;
      margin-bottom: 3px;
      color: #94a3b8;
      font-size: 7px;
      font-weight: 850;
      letter-spacing: .08em;
    }

    .last-updated strong {
      color: #334155;
      font-size: 9px;
    }

    .refresh-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      min-height: 40px;
      padding: 0 14px;
      border: 1px solid #cbd5e1;
      border-radius: 9px;
      background: #fff;
      color: #334155;
      font-size: 9px;
      font-weight: 800;
      cursor: pointer;
    }

    .refresh-button:hover:not(:disabled) {
      border-color: #94a3b8;
      box-shadow: 0 6px 16px rgba(15,23,42,.07);
    }

    .refresh-button:disabled {
      opacity: .55;
      cursor: not-allowed;
    }

    .refresh-icon {
      display: inline-block;
      font-size: 15px;
    }

    .spinning {
      animation: spin .8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* STATE */

    .state-card,
    .error-card {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 22px;
      border-radius: 14px;
      background: #fff;
    }

    .state-card {
      border: 1px solid #e2e8f0;
    }

    .spinner {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      border: 3px solid #dbeafe;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin .8s linear infinite;
    }

    .state-card h2 {
      margin: 0 0 4px;
      font-size: 13px;
    }

    .state-card p {
      margin: 0;
      color: #64748b;
      font-size: 9px;
    }

    .error-card {
      border: 1px solid #fecaca;
      color: #991b1b;
    }

    .error-icon {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      flex-shrink: 0;
      border-radius: 50%;
      background: #fee2e2;
      font-weight: 900;
    }

    .error-copy {
      flex: 1;
    }

    .error-copy strong {
      font-size: 10px;
    }

    .error-copy p {
      margin: 3px 0 0;
      font-size: 9px;
    }

    .error-card button {
      padding: 8px 11px;
      border: 0;
      border-radius: 7px;
      background: #dc2626;
      color: #fff;
      font-size: 8px;
      font-weight: 800;
      cursor: pointer;
    }

    /* HERO */

    .platform-hero {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 28px;
      margin-bottom: 18px;
      padding: 27px;
      overflow: hidden;
      border-radius: 17px;
      background:
        linear-gradient(
          125deg,
          #071a2c 0%,
          #0c4a6e 46%,
          #1d4ed8 100%
        );
      color: #fff;
      box-shadow: 0 14px 35px rgba(15,23,42,.12);
    }

    .platform-hero::after {
      content: '';
      position: absolute;
      right: -60px;
      top: -100px;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: rgba(255,255,255,.06);
    }

    .hero-copy,
    .hero-revenue {
      position: relative;
      z-index: 1;
    }

    .system-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 14px;
      padding: 6px 9px;
      border: 1px solid rgba(167,243,208,.25);
      border-radius: 999px;
      background: rgba(16,185,129,.13);
      color: #a7f3d0;
      font-size: 7px;
      font-weight: 850;
    }

    .system-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 0 3px rgba(52,211,153,.14);
    }

    .hero-label {
      display: block;
      color: #7dd3fc;
      font-size: 8px;
      font-weight: 850;
      letter-spacing: .11em;
    }

    .hero-copy h2 {
      margin: 6px 0 7px;
      font-size: 25px;
      letter-spacing: -.025em;
    }

    .hero-copy p {
      max-width: 580px;
      margin: 0;
      color: rgba(255,255,255,.67);
      font-size: 9px;
      line-height: 1.6;
    }

    .hero-revenue {
      min-width: 250px;
      padding: 18px;
      border: 1px solid rgba(255,255,255,.13);
      border-radius: 13px;
      background: rgba(2,8,23,.18);
      backdrop-filter: blur(8px);
    }

    .hero-revenue span,
    .hero-revenue small {
      display: block;
    }

    .hero-revenue span {
      color: rgba(255,255,255,.52);
      font-size: 7px;
      font-weight: 850;
      letter-spacing: .08em;
    }

    .hero-revenue strong {
      display: block;
      margin: 6px 0;
      font-size: 23px;
      letter-spacing: -.025em;
    }

    .hero-revenue small {
      color: rgba(255,255,255,.55);
      font-size: 8px;
    }

    /* METRICS */

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0,1fr));
      gap: 15px;
    }

    .metric-card {
      position: relative;
      min-height: 210px;
      padding: 20px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      border-radius: 15px;
      background: #fff;
      box-shadow: 0 5px 18px rgba(15,23,42,.045);
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .metric-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 26px rgba(15,23,42,.08);
    }

    .metric-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .metric-icon,
    .insight-icon,
    .action-icon {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      border-radius: 10px;
      font-weight: 850;
    }

    .metric-icon {
      width: 38px;
      height: 38px;
      font-size: 8px;
    }

    .blue {
      background: #eff6ff;
      color: #2563eb;
    }

    .violet {
      background: #f5f3ff;
      color: #7c3aed;
    }

    .green {
      background: #ecfdf5;
      color: #059669;
    }

    .orange {
      background: #fff7ed;
      color: #ea580c;
    }

    .cyan {
      background: #ecfeff;
      color: #0891b2;
    }

    .metric-type {
      color: #94a3b8;
      font-size: 7px;
      font-weight: 850;
      letter-spacing: .08em;
    }

    .metric-value {
      display: block;
      margin-top: 18px;
      color: #0f172a;
      font-size: 31px;
      font-weight: 900;
      letter-spacing: -.04em;
    }

    .metric-card h3 {
      margin: 5px 0;
      color: #0f172a;
      font-size: 11px;
    }

    .metric-card > p {
      min-height: 30px;
      margin: 0;
      color: #64748b;
      font-size: 8px;
      line-height: 1.5;
    }

    .metric-note,
    .card-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-top: 13px;
      font-size: 8px;
      font-weight: 750;
    }

    .metric-note {
      color: #64748b;
    }

    .positive {
      color: #059669;
    }

    .card-link {
      color: #2563eb;
      text-decoration: none;
    }

    .card-link:hover {
      text-decoration: underline;
    }

    /* REVENUE */

    .revenue-card {
      border-color: #bbf7d0;
      background: linear-gradient(145deg, #f0fdf4, #fff);
    }

    .revenue-pattern {
      position: absolute;
      right: -35px;
      bottom: -55px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: rgba(34,197,94,.06);
    }

    .revenue-icon {
      background: #dcfce7;
      color: #15803d;
    }

    .revenue-badge {
      padding: 5px 7px;
      border-radius: 999px;
      background: #dcfce7;
      color: #15803d;
      font-size: 7px;
      font-weight: 850;
    }

    .revenue-value {
      position: relative;
      display: block;
      z-index: 1;
      margin-top: 18px;
      color: #166534;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -.035em;
    }

    .revenue-note,
    .revenue-text {
      color: #15803d !important;
    }

    /* LOWER */

    .lower-grid {
      display: grid;
      grid-template-columns: 1.2fr .8fr;
      gap: 15px;
      margin-top: 15px;
    }

    .panel-card {
      padding: 20px;
      border: 1px solid #e2e8f0;
      border-radius: 15px;
      background: #fff;
      box-shadow: 0 5px 18px rgba(15,23,42,.04);
    }

    .panel-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eef2f7;
    }

    .panel-heading h2 {
      margin: 5px 0 3px;
      font-size: 15px;
    }

    .panel-heading p {
      margin: 0;
      color: #64748b;
      font-size: 8px;
    }

    .live-badge {
      padding: 5px 7px;
      border-radius: 999px;
      background: #ecfdf5;
      color: #047857;
      font-size: 7px;
      font-weight: 850;
    }

    /* INSIGHTS */

    .insight-list {
      display: grid;
    }

    .insight-row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 11px;
      padding: 14px 0;
      border-bottom: 1px solid #eef2f7;
    }

    .insight-row:last-child {
      border-bottom: 0;
    }

    .insight-icon,
    .action-icon {
      width: 34px;
      height: 34px;
      font-size: 7px;
    }

    .insight-copy strong,
    .insight-copy span {
      display: block;
    }

    .insight-copy strong {
      color: #334155;
      font-size: 9px;
    }

    .insight-copy span {
      margin-top: 3px;
      color: #94a3b8;
      font-size: 7px;
    }

    .insight-row > b {
      color: #0f172a;
      font-size: 11px;
    }

    /* QUICK ACTIONS */

    .quick-actions {
      display: grid;
    }

    .quick-actions a {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 10px;
      padding: 12px 0;
      border-bottom: 1px solid #eef2f7;
      color: inherit;
      text-decoration: none;
    }

    .quick-actions a:last-child {
      border-bottom: 0;
    }

    .quick-actions a:hover strong {
      color: #2563eb;
    }

    .quick-actions strong,
    .quick-actions span {
      display: block;
    }

    .quick-actions strong {
      color: #334155;
      font-size: 9px;
    }

    .quick-actions span {
      margin-top: 3px;
      color: #94a3b8;
      font-size: 7px;
    }

    .quick-actions b {
      color: #94a3b8;
    }

    /* NOTE */

    .dashboard-note {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-top: 15px;
      padding: 13px 15px;
      border: 1px solid #dbeafe;
      border-radius: 11px;
      background: #f8fbff;
    }

    .note-icon {
      display: grid;
      place-items: center;
      width: 25px;
      height: 25px;
      flex-shrink: 0;
      border-radius: 50%;
      background: #dbeafe;
      color: #2563eb;
      font-size: 8px;
      font-weight: 900;
    }

    .dashboard-note strong {
      display: block;
      color: #334155;
      font-size: 8px;
    }

    .dashboard-note p {
      margin: 3px 0 0;
      color: #64748b;
      font-size: 7px;
      line-height: 1.5;
    }

    /* RESPONSIVE */

    @media (max-width: 950px) {
      .metrics-grid {
        grid-template-columns: repeat(2,1fr);
      }

      .lower-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 700px) {
      .dashboard-page {
        padding: 30px 14px 50px;
      }

      .page-header,
      .platform-hero {
        align-items: flex-start;
        flex-direction: column;
      }

      .heading-copy h1 {
        font-size: 30px;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }

      .hero-revenue {
        width: 100%;
        min-width: 0;
      }
    }

    @media (max-width: 520px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .metric-card {
        min-height: auto;
      }

      .last-updated {
        display: none;
      }

      .refresh-button {
        width: 100%;
      }

      .header-actions {
        display: block;
      }
    }
  `]
})
export class AdminDashboardComponent
  implements OnInit {

  dashboard:
    AdminDashboard | null = null;


  loading = false;

  error = '';

  lastUpdated:
    Date | null = null;


  constructor(
    private readonly dashboardService:
      DashboardService
  ) {}


  ngOnInit(): void {

    this.loadDashboard();

  }


  get bookingsPerEvent(): number {

    if (
      !this.dashboard ||
      this.dashboard.totalEvents <= 0
    ) {
      return 0;
    }


    return (
      this.dashboard.totalBookings /
      this.dashboard.totalEvents
    );

  }


  get bookingsPerCustomer(): number {

    if (
      !this.dashboard ||
      this.dashboard.totalCustomers <= 0
    ) {
      return 0;
    }


    return (
      this.dashboard.totalBookings /
      this.dashboard.totalCustomers
    );

  }


  get averageRevenuePerBooking(): number {

    if (
      !this.dashboard ||
      this.dashboard.totalBookings <= 0
    ) {
      return 0;
    }


    return (
      this.dashboard.totalRevenue /
      this.dashboard.totalBookings
    );

  }


  loadDashboard(): void {

    this.loading = true;

    this.error = '';


    this.dashboardService
      .getAdminDashboard()
      .subscribe({

        next: data => {

          this.dashboard = data;

          this.lastUpdated =
            new Date();

          this.loading = false;

        },


        error: error => {

          console.error(
            'Admin dashboard load failed:',
            error
          );


          this.error =
            error?.error?.message ??
            error?.error?.title ??
            'Unable to load the dashboard. Please try again.';


          this.loading = false;

        }

      });

  }

}