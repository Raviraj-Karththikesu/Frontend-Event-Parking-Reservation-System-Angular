import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../../../../core/constants/api-endpoints';
import { ApiService } from '../../../../core/services/api.service';
import { GenerateParkingLayoutRequest } from '../../models/generate-parking-layout-request';
import { ParkingSlot } from '../../models/parking-slot';
import { UpdateParkingSlotRequest } from '../../models/update-parking-slot-request';

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

  generateParkingLayout(
    eventId: number,
    request: GenerateParkingLayoutRequest
  ): Observable<ParkingSlot[]> {
    return this.api.post<ParkingSlot[]>(
      API_ENDPOINTS.parkingSlots.byEvent(eventId),
      request
    );
  }

  updateParkingSlot(
    eventId: number,
    parkingSlotId: number,
    request: UpdateParkingSlotRequest
  ): Observable<ParkingSlot> {
    return this.api.put<ParkingSlot>(
      `${API_ENDPOINTS.parkingSlots.byEvent(eventId)}/${parkingSlotId}`,
      request
    );
  }

  deleteParkingSlot(
    eventId: number,
    parkingSlotId: number
  ): Observable<void> {
    return this.api.delete<void>(
      `${API_ENDPOINTS.parkingSlots.byEvent(eventId)}/${parkingSlotId}`
    );
  }
}
