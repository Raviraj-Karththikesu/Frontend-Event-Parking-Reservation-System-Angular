import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

import {
  CreateEventRequest,
  EventFilter,
  EventItem,
  UpdateEventRequest
} from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly api = inject(ApiService);
  private readonly endpoint = 'api/Events';

  getAll(filter?: EventFilter): Observable<EventItem[]> {
    const params: Record<string, string | number | boolean> = {};

    if (filter?.search) {
      params['Search'] = filter.search;
    }

    if (filter?.date) {
      params['Date'] = filter.date;
    }

    if (filter?.venueId) {
      params['VenueId'] = filter.venueId;
    }

    if (filter?.eventCategoryId) {
      params['EventCategoryId'] =
        filter.eventCategoryId;
    }

    return this.api.get<EventItem[]>(
      this.endpoint,
      params
    );
  }

  getById(id: number): Observable<EventItem> {
    return this.api.get<EventItem>(
      `${this.endpoint}/${id}`
    );
  }

  create(
    request: CreateEventRequest
  ): Observable<EventItem> {
    return this.api.post<
      EventItem,
      CreateEventRequest
    >(
      this.endpoint,
      request
    );
  }

  update(
    id: number,
    request: UpdateEventRequest
  ): Observable<EventItem> {
    return this.api.put<
      EventItem,
      UpdateEventRequest
    >(
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
