import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import { DashboardService }
  from '../../services/dashboard.service';

import { AdminDashboard }
  from '../../models/dashboard.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">

      <h1>Admin Dashboard</h1>

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
          <span>Total Events</span>
          <strong>
            {{ dashboard.totalEvents }}
          </strong>
        </div>

        <div class="stat">
          <span>Total Bookings</span>
          <strong>
            {{ dashboard.totalBookings }}
          </strong>
        </div>

        <div class="stat">
          <span>Available Seats</span>
          <strong>
            {{ dashboard.availableSeats }}
          </strong>
        </div>

        <div class="stat">
          <span>Occupied Parking</span>
          <strong>
            {{ dashboard.occupiedParkingSlots }}
          </strong>
        </div>

        <div class="stat">
          <span>Total Customers</span>
          <strong>
            {{ dashboard.totalCustomers }}
          </strong>
        </div>

        <div class="stat">
          <span>Total Revenue</span>
          <strong>
            Rs.
            {{
              dashboard.totalRevenue
              | number:'1.2-2'
            }}
          </strong>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .page {
      max-width:1200px;
      margin:auto;
      padding:35px 16px;
    }

    .dashboard {
      display:grid;
      grid-template-columns:
        repeat(auto-fit,minmax(220px,1fr));
      gap:20px;
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
      font-size:28px;
      margin-top:12px;
    }

    .error {
      color:#b00020;
    }
  `]
})
export class AdminDashboardComponent
  implements OnInit {

  dashboard?: AdminDashboard;

  loading = true;

  error = '';

  constructor(
    private dashboardService:
      DashboardService
  ) {}

  ngOnInit(): void {

    this.dashboardService
      .getAdminDashboard()
      .subscribe({

        next: result => {

          this.dashboard = result;

          this.loading = false;
        },

        error: err => {

          this.loading = false;

          this.error =
            err?.error?.message ??
            'Unable to load admin dashboard.';
        }
      });
  }
}