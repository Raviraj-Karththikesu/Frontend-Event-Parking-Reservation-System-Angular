import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { ParkingSlot } from '../models/parking-slot';
import { BookingSelectionStateService } from '../seat-selection/services/booking-selection-state.service';
import { SlotCodePipe } from './pipes/slot-code.pipe';
import { ParkingService } from './services/parking.service';

@Component({
  selector: 'app-parking-selection',
  standalone: true,
  imports: [
    SlotCodePipe
  ],
  templateUrl: './parking-selection.component.html',
  styleUrl: './parking-selection.component.scss'
})
export class ParkingSelectionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly parkingService = inject(ParkingService);
  private readonly bookingSelectionState =
    inject(BookingSelectionStateService);

  parkingSlots: ParkingSlot[] = [];

  isLoading = false;

  errorMessage = '';

  selectedParkingSlotId: number | null = null;

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

    this.selectedParkingSlotId =
      currentSelection.parkingSlotId;

    this.loadParkingSlots();
  }

  isSlotSelected(slotId: number): boolean {
    return this.selectedParkingSlotId === slotId;
  }

  canSelectSlot(slot: ParkingSlot): boolean {
    return slot.status.toLowerCase() === 'available';
  }

  selectSlot(slot: ParkingSlot): void {
    if (!this.canSelectSlot(slot)) {
      return;
    }

    if (this.isSlotSelected(slot.id)) {
      this.selectedParkingSlotId = null;
      this.bookingSelectionState.clearParking();
      return;
    }

    this.selectedParkingSlotId = slot.id;

    this.bookingSelectionState.setParking(
      slot.id,
      slot.fee
    );
  }

  removeInvalidSelection(): void {
    if (this.selectedParkingSlotId === null) {
      return;
    }

    const selectedSlot =
      this.parkingSlots.find(
        slot => slot.id === this.selectedParkingSlotId
      );

    if (!selectedSlot || !this.canSelectSlot(selectedSlot)) {
      this.selectedParkingSlotId = null;
      this.bookingSelectionState.clearParking();
    }
  }

  get selectedParkingSlot(): ParkingSlot | null {
    return (
      this.parkingSlots.find(
        slot => slot.id === this.selectedParkingSlotId
      ) ?? null
    );
  }

  get parkingFee(): number {
    return this.selectedParkingSlot?.fee ?? 0;
  }

  private loadParkingSlots(): void {
    if (this.eventId === null) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.parkingService
      .getParkingSlotsByEvent(this.eventId)
      .subscribe({
        next: parkingSlots => {
          this.parkingSlots = parkingSlots;
          this.removeInvalidSelection();
          this.isLoading = false;
        },
        error: error => {
          this.parkingSlots = [];

          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to load parking slots for this event.'
          );

          this.isLoading = false;
        }
      });
  }
}
