import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../../../../core/constants/api-endpoints';
import { ApiService } from '../../../../core/services/api.service';
import { GenerateSeatMapRequest } from '../../models/generate-seat-map-request';
import { Seat } from '../../models/seat';
import { UpdateSeatRequest } from '../../models/update-seat-request';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  private readonly api = inject(ApiService);

  getSeatsByEvent(eventId: number): Observable<Seat[]> {
    return this.api.get<Seat[]>(
      API_ENDPOINTS.seats.byEvent(eventId)
    );
  }

  generateSeatMap(
    eventId: number,
    request: GenerateSeatMapRequest
  ): Observable<Seat[]> {
    return this.api.post<Seat[], GenerateSeatMapRequest>(
      API_ENDPOINTS.seats.byEvent(eventId),
      request
    );
  }

  updateSeat(
    eventId: number,
    seatId: number,
    request: UpdateSeatRequest
  ): Observable<Seat> {
    return this.api.put<Seat, UpdateSeatRequest>(
      API_ENDPOINTS.seats.byId(eventId, seatId),
      request
    );
  }

  deleteSeat(
    eventId: number,
    seatId: number
  ): Observable<void> {
    return this.api.delete<void>(
      API_ENDPOINTS.seats.byId(eventId, seatId)
    );
  }
}
