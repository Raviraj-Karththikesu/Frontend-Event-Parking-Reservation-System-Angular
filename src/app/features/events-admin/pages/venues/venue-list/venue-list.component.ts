import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Venue } from '../../../models/venue.model';
import { VenueService } from '../../../services/venue.service';

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './venue-list.component.html',
  styleUrl: './venue-list.component.scss'
})
export class VenueListComponent implements OnInit {

  private readonly venueService = inject(VenueService);
  private readonly router = inject(Router);

  venues: Venue[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadVenues();
  }

  loadVenues(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.venueService.getAll().subscribe({
      next: (venues) => {
        this.venues = venues;
        this.isLoading = false;
      },

      error: () => {
        this.errorMessage =
          'Unable to load venues. Please try again.';

        this.isLoading = false;
      }
    });
  }

  addVenue(): void {
    this.router.navigate([
      '/admin/venues/new'
    ]);
  }

  editVenue(id: number): void {
    this.router.navigate([
      '/admin/venues',
      id,
      'edit'
    ]);
  }

  deleteVenue(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this venue?'
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';

    this.venueService.delete(id).subscribe({
      next: () => {
        this.venues = this.venues.filter(
          venue => venue.id !== id
        );
      },

      error: () => {
        this.errorMessage =
          'Unable to delete venue. It may be linked to an upcoming event.';
      }
    });
  }
}
