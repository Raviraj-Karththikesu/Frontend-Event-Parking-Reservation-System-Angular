import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { NotificationResponse }
  from '../models/notification.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCustomerNotifications(
    customerId: number
  ): Observable<NotificationResponse[]> {

    return this.http.get<NotificationResponse[]>(
      `${this.apiUrl}/notifications/customer/${customerId}`
    );
  }

  markAsRead(
    notificationId: number
  ): Observable<void> {

    return this.http.put<void>(
      `${this.apiUrl}/notifications/${notificationId}/read`,
      {}
    );
  }
}