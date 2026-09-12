import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin, map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  AdminDashboard,
  CustomerDashboard
} from '../models/dashboard.models';

import { BookingService } from './booking.service';
import { PaymentService } from './payment.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) {}

  getCustomerDashboard(
    customerId: number
  ): Observable<CustomerDashboard> {

    return forkJoin({
      bookings:
        this.bookingService.getCustomerBookings(customerId),

      payments:
        this.paymentService.getCustomerPayments(customerId),

      notifications:
        this.notificationService
          .getCustomerNotifications(customerId)
    }).pipe(
      map(result => {

        const upcomingBookings =
          result.bookings.filter(
            booking =>
              booking.status !== 'Cancelled' &&
              booking.status !== 'Expired'
          );

        const reservedParkingCount =
          result.bookings.filter(
            booking => !!booking.parking
          ).length;

        const recentPayments =
          [...result.payments]
            .sort(
              (a, b) =>
                new Date(b.paidAt ?? 0).getTime() -
                new Date(a.paidAt ?? 0).getTime()
            )
            .slice(0, 5);

        const unreadNotifications =
          result.notifications.filter(
            notification => !notification.isRead
          );

        return {
          upcomingBookings,
          recentPayments,
          unreadNotifications,
          reservedParkingCount
        };
      })
    );
  }

  getAdminDashboard():
    Observable<AdminDashboard> {

    return this.http.get<AdminDashboard>(
      `${this.apiUrl}/dashboard/admin`
    );
  }
}