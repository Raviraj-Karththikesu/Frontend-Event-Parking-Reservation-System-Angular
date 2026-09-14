import { Injectable, signal } from '@angular/core';
import { BookingSelection } from '../../models/booking-selection';

const INITIAL_SELECTION: BookingSelection = {
  eventId: null,
  seatIds: [],
  parkingSlotId: null,
  ticketTotal: 0,
  parkingFee: 0,
  grandTotal: 0
};

@Injectable({
  providedIn: 'root'
})
export class BookingSelectionStateService {

  private readonly selectionState =
    signal<BookingSelection>({ ...INITIAL_SELECTION });

  readonly selection = this.selectionState.asReadonly();

  setEvent(eventId: number): void {
    this.selectionState.update(state => ({
      ...state,
      eventId
    }));
  }

  setSeats(seatIds: number[], ticketTotal: number): void {
    this.selectionState.update(state => ({
      ...state,
      seatIds: [...seatIds],
      ticketTotal,
      grandTotal: ticketTotal + state.parkingFee
    }));
  }

  setParking(parkingSlotId: number | null, parkingFee: number): void {
    this.selectionState.update(state => ({
      ...state,
      parkingSlotId,
      parkingFee,
      grandTotal: state.ticketTotal + parkingFee
    }));
  }

  clearParking(): void {
    this.setParking(null, 0);
  }

  clearSelection(): void {
    this.selectionState.set({
      ...INITIAL_SELECTION,
      seatIds: []
    });
  }
}
