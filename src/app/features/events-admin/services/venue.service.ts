import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

import {
  CreateVenueRequest,
  UpdateVenueRequest,
  Venue
} from '../models/venue.model';

interface VenueApiResponse {
  id: number;
  name: string;
  address: string;
  totalCapacity: number;
}

interface CreateVenueApiRequest {
  name: string;
  address: string;
  totalCapacity: number;
}

interface UpdateVenueApiRequest {
  name: string;
  address: string;
  totalCapacity: number;
}

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  private readonly api = inject(ApiService);
  private readonly endpoint = 'Venues';

  getAll(): Observable<Venue[]> {
    return this.api
      .get<VenueApiResponse[]>(this.endpoint)
      .pipe(
        map((venues) =>
          venues.map((venue) =>
            this.mapVenueResponse(venue)
          )
        )
      );
  }

  getById(id: number): Observable<Venue> {
    return this.api
      .get<VenueApiResponse>(
        `${this.endpoint}/${id}`
      )
      .pipe(
        map((venue) =>
          this.mapVenueResponse(venue)
        )
      );
  }

  create(
    request: CreateVenueRequest
  ): Observable<Venue> {

    const apiRequest: CreateVenueApiRequest = {
      name: request.name,
      address: request.address,
      totalCapacity: request.capacity
    };

    return this.api
      .post<VenueApiResponse, CreateVenueApiRequest>(
        this.endpoint,
        apiRequest
      )
      .pipe(
        map((venue) =>
          this.mapVenueResponse(venue)
        )
      );
  }

  update(
    id: number,
    request: UpdateVenueRequest
  ): Observable<Venue> {

    const apiRequest: UpdateVenueApiRequest = {
      name: request.name,
      address: request.address,
      totalCapacity: request.capacity
    };

    return this.api
      .put<VenueApiResponse, UpdateVenueApiRequest>(
        `${this.endpoint}/${id}`,
        apiRequest
      )
      .pipe(
        map((venue) =>
          this.mapVenueResponse(venue)
        )
      );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(
      `${this.endpoint}/${id}`
    );
  }

  private mapVenueResponse(
    venue: VenueApiResponse
  ): Venue {
    return {
      id: venue.id,
      name: venue.name,
      address: venue.address,
      capacity: venue.totalCapacity
    };
  }
}