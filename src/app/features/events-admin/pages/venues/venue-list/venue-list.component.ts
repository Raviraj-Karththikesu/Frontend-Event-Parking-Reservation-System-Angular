import {
  CommonModule
} from '@angular/common';

import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  Venue
} from '../../../models/venue.model';

import {
  VenueService
} from '../../../services/venue.service';


@Component({
  selector: 'app-venue-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './venue-list.component.html',

  styleUrl:
    './venue-list.component.scss'
})
export class VenueListComponent
  implements OnInit {

  private readonly venueService =
    inject(VenueService);

  private readonly router =
    inject(Router);


  venues: Venue[] = [];


  searchTerm = '';


  isLoading = false;

  errorMessage = '';

  successMessage = '';


  ngOnInit(): void {

    this.loadVenues();

  }


  get filteredVenues(): Venue[] {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    if (!term) {

      return this.venues;

    }


    return this.venues.filter(
      venue => {

        const searchableText =
          [
            venue.id,
            venue.name,
            venue.address,
            venue.capacity
          ]
            .join(' ')
            .toLowerCase();


        return searchableText.includes(
          term
        );

      }
    );

  }


  get totalCapacity(): number {

    return this.venues.reduce(
      (
        total,
        venue
      ) => {

        return (
          total +
          Number(
            venue.capacity ?? 0
          )
        );

      },
      0
    );

  }


  get averageCapacity(): number {

    if (
      this.venues.length === 0
    ) {

      return 0;

    }


    return (
      this.totalCapacity /
      this.venues.length
    );

  }


  get largestVenue(): Venue | null {

    if (
      this.venues.length === 0
    ) {

      return null;

    }


    return this.venues.reduce(
      (
        largest,
        current
      ) => {

        return (
          Number(current.capacity) >
          Number(largest.capacity)
            ? current
            : largest
        );

      }
    );

  }


  loadVenues(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.venueService
      .getAll()
      .subscribe({

        next: venues => {

          this.venues =
            Array.isArray(venues)
              ? venues
              : [];


          this.isLoading = false;

        },


        error: error => {

          console.error(
            'Unable to load venues:',
            error
          );


          this.errorMessage =
            'Unable to load venues. Please try again.';


          this.isLoading = false;

        }

      });

  }


  clearSearch(): void {

    this.searchTerm = '';

  }


  getVenueInitial(
    venue: Venue
  ): string {

    const name =
      venue.name?.trim();


    if (!name) {

      return 'V';

    }


    return name
      .charAt(0)
      .toUpperCase();

  }


  getVenueSizeLabel(
    venue: Venue
  ): string {

    const capacity =
      Number(
        venue.capacity ?? 0
      );


    if (
      capacity >= 1500
    ) {

      return 'Extra Large';

    }


    if (
      capacity >= 750
    ) {

      return 'Large';

    }


    if (
      capacity >= 300
    ) {

      return 'Medium';

    }


    return 'Small';

  }


  getVenueSizeClass(
    venue: Venue
  ): string {

    const capacity =
      Number(
        venue.capacity ?? 0
      );


    if (
      capacity >= 1500
    ) {

      return 'size-extra-large';

    }


    if (
      capacity >= 750
    ) {

      return 'size-large';

    }


    if (
      capacity >= 300
    ) {

      return 'size-medium';

    }


    return 'size-small';

  }


  addVenue(): void {

    void this.router.navigate([
      '/admin/venues/new'
    ]);

  }


  editVenue(
    id: number
  ): void {

    void this.router.navigate([
      '/admin/venues',
      id,
      'edit'
    ]);

  }


  deleteVenue(
    venue: Venue
  ): void {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${venue.name}"?`
      );


    if (!confirmed) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.venueService
      .delete(venue.id)
      .subscribe({

        next: () => {

          this.venues =
            this.venues.filter(
              item =>
                item.id !== venue.id
            );


          this.successMessage =
            'Venue deleted successfully.';

        },


        error: error => {

          console.error(
            'Unable to delete venue:',
            error
          );


          this.errorMessage =
            'Unable to delete venue. It may be linked to an upcoming event.';

        }

      });

  }

}