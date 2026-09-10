import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CreateEventRequest,
  UpdateEventRequest
} from '../../../models/event.model';
import { Venue } from '../../../models/venue.model';
import { Category } from '../../../models/category.model';

import { EventService } from '../../../services/event.service';
import { VenueService } from '../../../services/venue.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-admin-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-event-form.component.html',
  styleUrl: './admin-event-form.component.scss'
})
export class AdminEventFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly eventService = inject(EventService);
  private readonly venueService = inject(VenueService);
  private readonly categoryService = inject(CategoryService);

  venues: Venue[] = [];
  categories: Category[] = [];

  eventId: number | null = null;
  isEditMode = false;

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  readonly eventForm = this.fb.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      description: [
        '',
        [
          Validators.maxLength(1000)
        ]
      ],

      venueId: [
        null as number | null,
        [
          Validators.required
        ]
      ],

      eventCategoryId: [
        null as number | null,
        [
          Validators.required
        ]
      ],

      startDateTime: [
        '',
        [
          Validators.required,
          this.futureDateValidator
        ]
      ],

      endDateTime: [
        '',
        [
          Validators.required
        ]
      ],

      ticketPrice: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      parkingFee: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      capacity: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ]
    },
    {
      validators: this.endAfterStartValidator
    }
  );

  ngOnInit(): void {
    this.loadDropdownData();

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (id > 0) {
      this.eventId = id;
      this.isEditMode = true;
      this.loadEvent(id);
    }
  }

  private loadDropdownData(): void {
    this.venueService.getAll().subscribe({
      next: (venues) => {
        this.venues = venues;
      },

      error: () => {
        this.errorMessage =
          'Unable to load venues.';
      }
    });

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },

      error: () => {
        this.errorMessage =
          'Unable to load categories.';
      }
    });
  }

  private loadEvent(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getById(id).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          name: event.name,
          description: event.description ?? '',
          venueId: event.venueId,
          eventCategoryId: event.eventCategoryId,
          startDateTime:
            this.toDateTimeLocal(event.startDateTime),
          endDateTime:
            this.toDateTimeLocal(event.endDateTime),
          ticketPrice: event.ticketPrice,
          parkingFee: event.parkingFee,
          capacity: event.capacity
        });

        this.isLoading = false;
      },

      error: () => {
        this.errorMessage =
          'Unable to load event details.';

        this.isLoading = false;
      }
    });
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const value = this.eventForm.getRawValue();

    const request: CreateEventRequest = {
      name: value.name!.trim(),
      description:
        value.description?.trim() || null,
      venueId: Number(value.venueId),
      eventCategoryId:
        Number(value.eventCategoryId),
      startDateTime:
        new Date(value.startDateTime!).toISOString(),
      endDateTime:
        new Date(value.endDateTime!).toISOString(),
      ticketPrice:
        Number(value.ticketPrice),
      parkingFee:
        Number(value.parkingFee),
      capacity:
        Number(value.capacity)
    };

    this.isSaving = true;

    if (
      this.isEditMode &&
      this.eventId !== null
    ) {
      this.updateEvent(
        this.eventId,
        request
      );

      return;
    }

    this.createEvent(request);
  }

  private createEvent(
    request: CreateEventRequest
  ): void {
    this.eventService.create(request).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage =
          'Event created successfully.';

        this.router.navigate([
          '/admin/events'
        ]);
      },

      error: () => {
        this.isSaving = false;
        this.errorMessage =
          'Unable to create event. Please check the entered details.';
      }
    });
  }

  private updateEvent(
    id: number,
    request: UpdateEventRequest
  ): void {
    this.eventService.update(
      id,
      request
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage =
          'Event updated successfully.';

        this.router.navigate([
          '/admin/events'
        ]);
      },

      error: () => {
        this.isSaving = false;
        this.errorMessage =
          'Unable to update event. Please check the entered details.';
      }
    });
  }

  cancel(): void {
    this.router.navigate([
      '/admin/events'
    ]);
  }

  private toDateTimeLocal(
    value: string
  ): string {
    const date = new Date(value);

    const offset =
      date.getTimezoneOffset() * 60000;

    return new Date(
      date.getTime() - offset
    )
      .toISOString()
      .slice(0, 16);
  }

  private futureDateValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selectedDate =
      new Date(control.value);

    return selectedDate.getTime() >
      Date.now()
      ? null
      : { futureDate: true };
  }

  private endAfterStartValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const start =
      control.get('startDateTime')?.value;

    const end =
      control.get('endDateTime')?.value;

    if (!start || !end) {
      return null;
    }

    return new Date(end).getTime() >
      new Date(start).getTime()
      ? null
      : { endBeforeStart: true };
  }
}
