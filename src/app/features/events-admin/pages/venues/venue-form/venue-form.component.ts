import {
  CommonModule
} from '@angular/common';

import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormsModule,
  NgForm
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  CreateVenueRequest,
  UpdateVenueRequest
} from '../../../models/venue.model';

import {
  VenueService
} from '../../../services/venue.service';


@Component({
  selector: 'app-venue-form',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './venue-form.component.html',

  styleUrl:
    './venue-form.component.scss'
})
export class VenueFormComponent
  implements OnInit {

  private readonly venueService =
    inject(VenueService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);


  venue:
    CreateVenueRequest = {

      name: '',
      address: '',
      capacity: 1

    };


  venueId:
    number | null = null;


  isEditMode = false;

  isLoading = false;

  isSubmitting = false;


  successMessage = '';

  errorMessage = '';


  ngOnInit(): void {

    const idParam =
      this.route
        .snapshot
        .paramMap
        .get('id');


    if (!idParam) {

      return;

    }


    const id =
      Number(idParam);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      this.errorMessage =
        'Invalid venue ID.';

      return;

    }


    this.venueId = id;

    this.isEditMode = true;


    this.loadVenue(id);

  }


  get venueInitial(): string {

    const name =
      this.venue.name
        ?.trim();


    if (!name) {

      return 'V';

    }


    return name
      .charAt(0)
      .toUpperCase();

  }


  get capacityLabel(): string {

    const capacity =
      Number(
        this.venue.capacity ?? 0
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


  get capacityClass(): string {

    const capacity =
      Number(
        this.venue.capacity ?? 0
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


  goBack(): void {

    void this.router.navigate([
      '/admin/venues'
    ]);

  }


  private loadVenue(
    id: number
  ): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.venueService
      .getById(id)
      .subscribe({

        next: venue => {

          this.venue = {

            name:
              venue.name,

            address:
              venue.address,

            capacity:
              venue.capacity

          };


          this.isLoading = false;

        },


        error: () => {

          this.errorMessage =
            'Unable to load venue details. Please try again.';


          this.isLoading = false;

        }

      });

  }


  submit(
    form: NgForm
  ): void {

    if (
      form.invalid
    ) {

      form.control
        .markAllAsTouched();

      return;

    }


    this.successMessage = '';

    this.errorMessage = '';

    this.isSubmitting = true;


    if (
      this.isEditMode &&
      this.venueId !== null
    ) {

      this.updateVenue();

      return;

    }


    this.createVenue(form);

  }


  private createVenue(
    form: NgForm
  ): void {

    const request:
      CreateVenueRequest = {

        name:
          this.venue.name.trim(),

        address:
          this.venue.address.trim(),

        capacity:
          Number(
            this.venue.capacity
          )

      };


    this.venueService
      .create(request)
      .subscribe({

        next: () => {

          this.successMessage =
            'Venue created successfully.';


          this.isSubmitting = false;


          form.resetForm({

            name: '',
            address: '',
            capacity: 1

          });


          this.venue = {

            name: '',
            address: '',
            capacity: 1

          };

        },


        error: () => {

          this.errorMessage =
            'Unable to create venue. Please try again.';


          this.isSubmitting = false;

        }

      });

  }


  private updateVenue(): void {

    if (
      this.venueId === null
    ) {

      return;

    }


    const request:
      UpdateVenueRequest = {

        name:
          this.venue.name.trim(),

        address:
          this.venue.address.trim(),

        capacity:
          Number(
            this.venue.capacity
          )

      };


    this.venueService
      .update(
        this.venueId,
        request
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Venue updated successfully.';


          this.isSubmitting = false;

        },


        error: () => {

          this.errorMessage =
            'Unable to update venue. Please try again.';


          this.isSubmitting = false;

        }

      });

  }

}