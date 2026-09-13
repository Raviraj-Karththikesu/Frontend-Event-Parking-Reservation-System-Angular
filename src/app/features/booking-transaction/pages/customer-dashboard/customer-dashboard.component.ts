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
    <div class="page">

      <h1>Customer Dashboard</h1>

      <p *ngIf="loading">
        Loading dashboard...
      </p>

      <p class="error" *ngIf="error">
        {{ error }}
      </p>

      <div
        class="dashboard"
        *ngIf="dashboard">

        <div class="stat">
          <span>Upcoming Bookings</span>
          <strong>
            {{ dashboard.upcomingBookings.length }}
          </strong>
        </div>

        <div class="stat">
          <span>Reserved Parking</span>
          <strong>
            {{ dashboard.reservedParkingCount }}
          </strong>
        </div>

        <div class="stat">
          <span>Recent Payments</span>
          <strong>
            {{ dashboard.recentPayments.length }}
          </strong>
        </div>

        <div class="stat">
          <span>Unread Notifications</span>
          <strong>
            {{ dashboard.unreadNotifications.length }}
          </strong>
        </div>

      </div>

      <div class="links">

        <a routerLink="/bookings">
          My Bookings
        </a>

        <a routerLink="/notifications">
          Notifications
        </a>

      </div>

    </div>
  `,
styles: [`
  .page {
    min-height: 100vh;
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 20px;

    color: #ffffff;
  }

  h1 {
    margin: 0 0 30px;

    color: #ffffff;

    font-size: 30px;
    font-weight: 700;
  }

  .dashboard {
    display: grid;

    grid-template-columns:
      repeat(
        auto-fit,
        minmax(220px, 1fr)
      );

    gap: 20px;
  }

  .stat {
    min-height: 130px;

    padding: 26px;

    background: #ffffff;
    color: #111827;

    border-radius: 16px;

    box-shadow:
      0 8px 25px
      rgba(0, 0, 0, 0.12);

    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .stat:hover {
    transform: translateY(-3px);

    box-shadow:
      0 12px 30px
      rgba(0, 0, 0, 0.16);
  }

  .stat span {
    display: block;

    color: #4b5563;

    font-size: 16px;
    font-weight: 600;
  }

  .stat strong {
    display: block;

    margin-top: 16px;

    color: #111827;

    font-size: 34px;
    font-weight: 800;
  }

  .links {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;

    margin-top: 32px;
  }

  .links a {
    display: inline-block;

    padding: 12px 18px;

    border-radius: 9px;

    background: #2563eb;
    color: #ffffff;

    text-decoration: none;

    font-size: 15px;
    font-weight: 700;

    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }

  .links a:hover {
    background: #1d4ed8;

    transform: translateY(-1px);
  }

  .links a:last-child {
    background: #059669;
  }

  .links a:last-child:hover {
    background: #047857;
  }

  .error {
    padding: 14px 16px;

    background: #fee2e2;
    color: #b91c1c;

    border: 1px solid #fecaca;
    border-radius: 10px;

    font-weight: 600;
  }

  @media (max-width: 600px) {
    .page {
      padding: 28px 16px;
    }

    h1 {
      font-size: 25px;
    }

    .dashboard {
      grid-template-columns: 1fr;
    }

    .links {
      flex-direction: column;
    }

    .links a {
      width: 100%;

      text-align: center;
    }
  }
`]
})
export class CustomerDashboardComponent
  implements OnInit {

  dashboard?: CustomerDashboard;

  loading = true;

  error = '';

  constructor(
    private dashboardService:
      DashboardService
  ) {}

  ngOnInit(): void {

    const customerId =
      getCurrentCustomerId();

    if (!customerId) {

      this.loading = false;

      this.error =
        'Customer session not found.';

      return;
    }

    this.dashboardService
      .getCustomerDashboard(customerId)
      .subscribe({

        next: result => {

          this.dashboard = result;

          this.loading = false;
        },

        error: err => {

          this.loading = false;

          this.error =
            err?.error?.message ??
            'Unable to load dashboard.';
        }
      });
  }
}