import { Component } from '@angular/core';
import { BookingSelectionStateService } from '../../services/booking-selection-state.service';

@Component({
  selector: 'app-selection-summary',
  standalone: true,
  imports: [],
  templateUrl: './selection-summary.component.html',
  styleUrl: './selection-summary.component.scss'
})
export class SelectionSummaryComponent {

  readonly selection;

  constructor(
    private readonly bookingSelectionState: BookingSelectionStateService
  ) {
    this.selection = this.bookingSelectionState.selection;
  }

  get seatCount(): number {
    return this.selection().seatIds.length;
  }
}
