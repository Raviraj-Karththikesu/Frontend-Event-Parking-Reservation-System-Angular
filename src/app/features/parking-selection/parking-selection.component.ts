import { Component, OnInit } from '@angular/core';
import { ParkingSlot } from '../../models/parking-slot';
import { BookingSelectionStateService } from '../seat-selection/services/booking-selection-state.service';
import { SlotCodePipe } from './pipes/slot-code.pipe';

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

  parkingSlots: ParkingSlot[] = [];

  isLoading = false;

  errorMessage = '';

  selectedParkingSlotId: number | null = null;

  constructor(
    private readonly bookingSelectionState: BookingSelectionStateService
  ) {}

  ngOnInit(): void {
    const savedSelection =
      this.bookingSelectionState.selection();

    this.selectedParkingSlotId =
      savedSelection.parkingSlotId;
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
}
