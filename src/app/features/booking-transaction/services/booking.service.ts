import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  BookingHoldStatus,
  BookingResponse,
  CreateBookingRequest
} from '../models/booking.models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createBooking(
    request: CreateBookingRequest
  ): Observable<BookingResponse> {

    return this.http.post<BookingResponse>(
      `${this.apiUrl}/bookings`,
      request
    );
  }

  getCustomerBookings(
    customerId: number
  ): Observable<BookingResponse[]> {

    return this.http.get<BookingResponse[]>(
      `${this.apiUrl}/bookings/customer/${customerId}`
    );
  }

  getBooking(
    bookingId: number
  ): Observable<BookingResponse> {

    return this.http.get<BookingResponse>(
      `${this.apiUrl}/bookings/${bookingId}`
    );
  }

  getHoldStatus(
    bookingId: number
  ): Observable<BookingHoldStatus> {

    return this.http.get<BookingHoldStatus>(
      `${this.apiUrl}/bookings/${bookingId}/hold-status`
    );
  }

  cancelBooking(
    bookingId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/bookings/${bookingId}`
    );
  }
}