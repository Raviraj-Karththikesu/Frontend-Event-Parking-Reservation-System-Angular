import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../../../../core/constants/api-endpoints';
import { ApiService } from '../../../../core/services/api.service';
import { ParkingSlot } from '../../models/parking-slot';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private readonly api = inject(ApiService);

  getParkingSlotsByEvent(
    eventId: number
  ): Observable<ParkingSlot[]> {
    return this.api.get<ParkingSlot[]>(
      API_ENDPOINTS.parkingSlots.byEvent(eventId)
    );
  }
}
