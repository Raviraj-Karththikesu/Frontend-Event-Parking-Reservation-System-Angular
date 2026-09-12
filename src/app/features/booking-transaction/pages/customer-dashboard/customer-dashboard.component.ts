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
      max-width:1100px;
      margin:auto;
      padding:35px 16px;
    }

    .dashboard {
      display:grid;
      grid-template-columns:
        repeat(auto-fit,minmax(210px,1fr));
      gap:18px;
    }

    .stat {
      padding:25px;
      border-radius:14px;
      background:white;
      box-shadow:0 5px 20px rgba(0,0,0,.08);
    }

    .stat span,
    .stat strong {
      display:block;
    }

    .stat strong {
      margin-top:12px;
      font-size:30px;
    }

    .links {
      display:flex;
      gap:20px;
      margin-top:30px;
    }

    .error {
      color:#b00020;
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