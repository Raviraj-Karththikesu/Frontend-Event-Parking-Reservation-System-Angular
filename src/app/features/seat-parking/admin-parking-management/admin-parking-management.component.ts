import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { GenerateParkingLayoutRequest } from '../models/generate-parking-layout-request';
import { ParkingSlot } from '../models/parking-slot';
import { UpdateParkingSlotRequest } from '../models/update-parking-slot-request';
import { ParkingService } from '../parking-selection/services/parking.service';

@Component({
  selector: 'app-admin-parking-management',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin-parking-management.component.html',
  styleUrl: './admin-parking-management.component.scss'
})
export class AdminParkingManagementComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly parkingService = inject(ParkingService);
  private readonly formBuilder = inject(FormBuilder);

  eventId: number | null = null;

  parkingSlots: ParkingSlot[] = [];

  isLoading = false;

  errorMessage = '';

  successMessage = '';

  editingParkingSlotId: number | null = null;

  readonly generateForm = this.formBuilder.group({
    totalSlots: [
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(500)
      ]
    ],
    zone: ['A'],
    fee: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ]
  });

  readonly editForm = this.formBuilder.group({
    slotNumber: [
      '',
      [
        Validators.required
      ]
    ],
    zone: [''],
    fee: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ]
  });

  ngOnInit(): void {
    const routeEventId =
      Number(this.route.snapshot.paramMap.get('eventId'));

    if (!Number.isInteger(routeEventId) || routeEventId <= 0) {
      this.errorMessage = 'A valid event ID is required.';
      return;
    }

    this.eventId = routeEventId;

    this.loadParkingSlots();
  }

  loadParkingSlots(): void {
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
          this.isLoading = false;
        },
        error: error => {
          this.parkingSlots = [];
          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to load parking slots.'
          );
          this.isLoading = false;
        }
      });
  }

  generateParkingLayout(): void {
    if (
      this.eventId === null ||
      this.generateForm.invalid
    ) {
      this.generateForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.generateForm.getRawValue();

    const request: GenerateParkingLayoutRequest = {
      totalSlots: formValue.totalSlots ?? 1,
      zone: formValue.zone || null,
      fee: formValue.fee ?? 0
    };

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.parkingService
      .generateParkingLayout(
        this.eventId,
        request
      )
      .subscribe({
        next: parkingSlots => {
          this.parkingSlots = parkingSlots;
          this.successMessage =
            'Parking layout generated successfully.';
          this.isLoading = false;
        },
        error: error => {
          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to generate parking layout.'
          );
          this.isLoading = false;
        }
      });
  }

  startEdit(slot: ParkingSlot): void {
    this.editingParkingSlotId = slot.id;

    this.editForm.setValue({
      slotNumber: slot.slotNumber,
      zone: slot.zone ?? '',
      fee: slot.fee
    });

    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.editingParkingSlotId = null;

    this.editForm.reset({
      slotNumber: '',
      zone: '',
      fee: 0
    });
  }

  saveParkingSlot(): void {
    if (
      this.eventId === null ||
      this.editingParkingSlotId === null ||
      this.editForm.invalid
    ) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.editForm.getRawValue();

    const request: UpdateParkingSlotRequest = {
      slotNumber: formValue.slotNumber ?? '',
      zone: formValue.zone || null,
      fee: formValue.fee ?? 0
    };

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.parkingService
      .updateParkingSlot(
        this.eventId,
        this.editingParkingSlotId,
        request
      )
      .subscribe({
        next: updatedSlot => {
          this.parkingSlots =
            this.parkingSlots.map(slot =>
              slot.id === updatedSlot.id
                ? updatedSlot
                : slot
            );

          this.successMessage =
            'Parking slot updated successfully.';

          this.isLoading = false;
          this.cancelEdit();
        },
        error: error => {
          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to update parking slot.'
          );
          this.isLoading = false;
        }
      });
  }

  deleteParkingSlot(slot: ParkingSlot): void {
    if (
      this.eventId === null ||
      !confirm(
        `Delete parking slot ${slot.slotNumber}?`
      )
    ) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.parkingService
      .deleteParkingSlot(
        this.eventId,
        slot.id
      )
      .subscribe({
        next: () => {
          this.parkingSlots =
            this.parkingSlots.filter(
              currentSlot => currentSlot.id !== slot.id
            );

          this.successMessage =
            'Parking slot deleted successfully.';

          this.isLoading = false;
        },
        error: error => {
          this.errorMessage = getApiErrorMessage(
            error,
            'Unable to delete parking slot.'
          );
          this.isLoading = false;
        }
      });
  }
}
