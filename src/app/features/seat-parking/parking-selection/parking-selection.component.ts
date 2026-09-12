import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { ParkingSlot } from '../models/parking-slot';
import { BookingSelectionStateService } from '../seat-selection/services/booking-selection-state.service';
import { SeatService } from '../seat-selection/services/seat.service';
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
  private readonly router = inject(Router);
  private readonly parkingService = inject(ParkingService);
  private readonly seatService = inject(SeatService);
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

  continueToCheckout(): void {
    if (this.eventId === null) {
      this.errorMessage = 'Event information is missing.';
      return;
    }

    const selection =
      this.bookingSelectionState.selection();

    if (selection.seatIds.length === 0) {
      this.errorMessage =
        'Please select at least one seat before checkout.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.seatService
      .getSeatsByEvent(this.eventId)
      .subscribe({
        next: seats => {
          const selectedSeats = seats
            .filter(seat =>
              selection.seatIds.includes(seat.id)
            )
            .map(seat => ({
              seatId: seat.id,
              seatNumber: seat.seatNumber,
              price: seat.price
            }));

          if (selectedSeats.length === 0) {
            this.errorMessage =
              'Selected seat information could not be loaded.';
            this.isLoading = false;
            return;
          }

          const selectedParking =
            this.selectedParkingSlot
              ? {
                  parkingSlotId:
                    this.selectedParkingSlot.id,
                  slotNumber:
                    this.selectedParkingSlot.slotNumber,
                  zone:
                    this.selectedParkingSlot.zone ?? null,
                  fee:
                    this.selectedParkingSlot.fee
                }
              : null;

          this.isLoading = false;

          this.router.navigate(
            ['/booking/checkout'],
            {
              state: {
                eventId: this.eventId,
                seats: selectedSeats,
                parking: selectedParking
              }
            }
          );
        },
        error: error => {
          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to prepare checkout.'
          );
          this.isLoading = false;
        }
      });
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
