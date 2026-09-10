export interface EventItem {
  id: number;
  name: string;
  description?: string | null;

  venueId: number;
  venueName: string;

  eventCategoryId: number;
  categoryName: string;

  startDateTime: string;
  endDateTime: string;

  ticketPrice: number;
  parkingFee: number;
  capacity: number;

  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateEventRequest {
  name: string;
  description?: string | null;

  venueId: number;
  eventCategoryId: number;

  startDateTime: string;
  endDateTime: string;

  ticketPrice: number;
  parkingFee: number;
  capacity: number;
}

export interface UpdateEventRequest {
  name: string;
  description?: string | null;

  venueId: number;
  eventCategoryId: number;

  startDateTime: string;
  endDateTime: string;

  ticketPrice: number;
  parkingFee: number;
  capacity: number;
}

export interface EventFilter {
  search?: string;
  date?: string;
  venueId?: number;
  eventCategoryId?: number;
}
