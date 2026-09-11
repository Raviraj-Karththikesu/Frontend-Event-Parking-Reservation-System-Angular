import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import {
  CreateVenueRequest,
  UpdateVenueRequest,
  Venue
} from '../models/venue.model';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'Venues';

  getAll(): Observable<Venue[]> {
    return this.api.get<Venue[]>(this.endpoint);
  }

  getById(id: number): Observable<Venue> {
    return this.api.get<Venue>(`${this.endpoint}/${id}`);
  }

  create(request: CreateVenueRequest): Observable<Venue> {
    return this.api.post<Venue, CreateVenueRequest>(
      this.endpoint,
      request
    );
  }

  update(
    id: number,
    request: UpdateVenueRequest
  ): Observable<Venue> {
    return this.api.put<Venue, UpdateVenueRequest>(
      `${this.endpoint}/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(
      `${this.endpoint}/${id}`
    );
  }
}
