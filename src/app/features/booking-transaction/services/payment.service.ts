import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  PaymentHistoryItem,
  PaymentInfo,
  PaymentResponse,
  ReceiptResponse
} from '../models/payment.models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBookingPayment(
    bookingId: number
  ): Observable<PaymentInfo> {

    return this.http.get<PaymentInfo>(
      `${this.apiUrl}/bookings/${bookingId}/payment`
    );
  }

  payBooking(
    bookingId: number
  ): Observable<PaymentResponse> {

    return this.http.post<PaymentResponse>(
      `${this.apiUrl}/bookings/${bookingId}/payment`,
      {}
    );
  }

  getCustomerPayments(
    customerId: number
  ): Observable<PaymentHistoryItem[]> {

    return this.http.get<PaymentHistoryItem[]>(
      `${this.apiUrl}/payments/customer/${customerId}`
    );
  }

  getReceipt(
    paymentId: number
  ): Observable<ReceiptResponse> {

    return this.http.get<ReceiptResponse>(
      `${this.apiUrl}/payments/${paymentId}/receipt`
    );
  }
}