import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../../../../core/constants/api-endpoints';
import { ApiService } from '../../../../core/services/api.service';
import { Seat } from '../../models/seat';

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
}
