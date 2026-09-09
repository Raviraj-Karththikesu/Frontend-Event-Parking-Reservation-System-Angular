import { Component } from '@angular/core';
import { Seat } from '../../models/seat';
import { BookingSelectionStateService } from './services/booking-selection-state.service';
import { SeatLabelPipe } from './pipes/seat-label.pipe';
import { SeatStatusDirective } from './directives/seat-status.directive';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [
    SeatLabelPipe,
    SeatStatusDirective
  ],
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.scss'
})
export class SeatSelectionComponent {

  seats: Seat[] = [];

  selectedSeatIds: number[] = [];

  constructor(
    private readonly bookingSelectionState: BookingSelectionStateService
  ) {}

  isSeatSelected(seatId: number): boolean {
    return this.selectedSeatIds.includes(seatId);
  }

  canSelectSeat(seat: Seat): boolean {
    return seat.status.toLowerCase() === 'available';
  }

  toggleSeat(seat: Seat): void {

    if (!this.canSelectSeat(seat)) {
      return;
    }

    if (this.isSeatSelected(seat.id)) {
      this.selectedSeatIds =
        this.selectedSeatIds.filter(id => id !== seat.id);
    } else {
      this.selectedSeatIds = [
        ...this.selectedSeatIds,
        seat.id
      ];
    }

    this.updateSelectionState();
  }

  get ticketTotal(): number {
    return this.seats
      .filter(seat => this.selectedSeatIds.includes(seat.id))
      .reduce((total, seat) => total + seat.price, 0);
  }

  private updateSelectionState(): void {
    this.bookingSelectionState.setSeats(
      this.selectedSeatIds,
      this.ticketTotal
    );
  }
}
