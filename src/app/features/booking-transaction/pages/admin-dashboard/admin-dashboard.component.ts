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
    min-height: 100vh;
    max-width: 1200px;

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
        minmax(240px, 1fr)
      );

    gap: 22px;
  }

  .stat {
    min-height: 140px;

    padding: 28px;

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

    margin-top: 18px;

    color: #111827;

    font-size: 34px;
    font-weight: 800;
  }

  .error {
    margin-bottom: 20px;
    padding: 14px 16px;

    background: #fee2e2;
    color: #b91c1c;

    border: 1px solid #fecaca;
    border-radius: 10px;

    font-weight: 600;
  }

  @media (max-width: 768px) {
    .page {
      padding: 28px 16px;
    }

    h1 {
      font-size: 25px;
    }

    .dashboard {
      grid-template-columns: 1fr;
    }

    .stat {
      min-height: 120px;
    }

    .stat strong {
      font-size: 30px;
    }
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