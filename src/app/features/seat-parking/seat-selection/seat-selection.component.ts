import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { Seat } from '../models/seat';
import { SelectionSummaryComponent } from './components/selection-summary/selection-summary.component';
import { SeatStatusDirective } from './directives/seat-status.directive';
import { SeatLabelPipe } from './pipes/seat-label.pipe';
import { BookingSelectionStateService } from './services/booking-selection-state.service';
import { SeatService } from './services/seat.service';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [
    SeatLabelPipe,
    SeatStatusDirective,
    SelectionSummaryComponent
  ],
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.scss'
})
export class SeatSelectionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seatService = inject(SeatService);
  private readonly bookingSelectionState =
    inject(BookingSelectionStateService);

  seats: Seat[] = [];

  isLoading = false;

  errorMessage = '';

  selectedSeatIds: number[] = [];

  eventId: number | null = null;

  ngOnInit(): void {
    const routeEventId =
      Number(this.route.snapshot.paramMap.get('eventId'));

    if (!Number.isInteger(routeEventId) || routeEventId <= 0) {
      this.errorMessage = 'A valid event ID is required.';
      return;
    }

    this.eventId = routeEventId;

    const savedSelection =
      this.bookingSelectionState.selection();

    if (
      savedSelection.eventId !== null &&
      savedSelection.eventId !== routeEventId
    ) {
      this.bookingSelectionState.clearSelection();
    }

    this.bookingSelectionState.setEvent(routeEventId);

    const currentSelection =
      this.bookingSelectionState.selection();

    this.selectedSeatIds = [
      ...currentSelection.seatIds
    ];

    this.loadSeats();
  }

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
        this.selectedSeatIds.filter(
          id => id !== seat.id
        );
    } else {
      this.selectedSeatIds = [
        ...this.selectedSeatIds,
        seat.id
      ];
    }

    this.updateSelectionState();
  }

  removeInvalidSelections(): void {
    const availableSeatIds = this.seats
      .filter(seat => this.canSelectSeat(seat))
      .map(seat => seat.id);

    this.selectedSeatIds =
      this.selectedSeatIds.filter(
        seatId => availableSeatIds.includes(seatId)
      );

    this.updateSelectionState();
  }

  goToParking(): void {
    if (
      this.eventId === null ||
      this.selectedSeatIds.length === 0
    ) {
      return;
    }

    this.router.navigate([
      '/events',
      this.eventId,
      'parking'
    ]);
  }

  get ticketTotal(): number {
    return this.seats
      .filter(
        seat => this.selectedSeatIds.includes(seat.id)
      )
      .reduce(
        (total, seat) => total + seat.price,
        0
      );
  }

  private loadSeats(): void {
    if (this.eventId === null) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.seatService
      .getSeatsByEvent(this.eventId)
      .subscribe({
        next: seats => {
          this.seats = seats;
          this.removeInvalidSelections();
          this.isLoading = false;
        },
        error: error => {
          this.seats = [];
          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to load seats for this event.'
          );
          this.isLoading = false;
        }
      });
  }

  private updateSelectionState(): void {
    this.bookingSelectionState.setSeats(
      this.selectedSeatIds,
      this.ticketTotal
    );
  }
}
