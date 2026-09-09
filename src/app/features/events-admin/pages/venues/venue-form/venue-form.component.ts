import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { CreateVenueRequest } from '../../../models/venue.model';
import { VenueService } from '../../../services/venue.service';

@Component({
  selector: 'app-venue-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './venue-form.component.html',
  styleUrl: './venue-form.component.scss'
})
export class VenueFormComponent {

  private readonly venueService = inject(VenueService);

  venue: CreateVenueRequest = {
    name: '',
    address: '',
    capacity: 1
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  submit(form: NgForm): void {

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.venueService.create(this.venue).subscribe({
      next: () => {
        this.successMessage = 'Venue created successfully.';
        this.isSubmitting = false;

        form.resetForm({
          name: '',
          address: '',
          capacity: 1
        });
      },

      error: () => {
        this.errorMessage =
          'Unable to create venue. Please try again.';

        this.isSubmitting = false;
      }
    });
  }
}
