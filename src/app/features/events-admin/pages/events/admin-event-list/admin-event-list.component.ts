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
  Router,
  RouterLink
} from '@angular/router';

import {
  EventItem
} from '../../../models/event.model';

import {
  EventService
} from '../../../services/event.service';


@Component({
  selector: 'app-admin-event-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl:
    './admin-event-list.component.html',

  styleUrl:
    './admin-event-list.component.scss'
})
export class AdminEventListComponent
  implements OnInit {

  private readonly eventService =
    inject(EventService);

  private readonly router =
    inject(Router);


  events: EventItem[] = [];


  searchTerm = '';


  isLoading = false;

  errorMessage = '';

  successMessage = '';


  ngOnInit(): void {

    this.loadEvents();

  }


  get filteredEvents(): EventItem[] {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    if (!term) {

      return this.events;

    }


    return this.events.filter(
      event => {

        const searchableText =
          [
            event.name,
            event.venueName,
            event.categoryName,
            event.id
          ]
            .join(' ')
            .toLowerCase();


        return searchableText.includes(
          term
        );

      }
    );

  }


  get upcomingCount(): number {

    const now =
      Date.now();


    return this.events.filter(
      event => {

        const start =
          new Date(
            event.startDateTime
          ).getTime();


        return (
          !Number.isNaN(start) &&
          start >= now
        );

      }
    ).length;

  }


  get totalCapacity(): number {

    return this.events.reduce(
      (
        total,
        event
      ) => {

        return (
          total +
          Number(
            event.capacity ?? 0
          )
        );

      },
      0
    );

  }


  get averageTicketPrice(): number {

    if (
      this.events.length === 0
    ) {

      return 0;

    }


    const total =
      this.events.reduce(
        (
          sum,
          event
        ) => {

          return (
            sum +
            Number(
              event.ticketPrice ?? 0
            )
          );

        },
        0
      );


    return (
      total /
      this.events.length
    );

  }


  loadEvents(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.eventService
      .getAll()
      .subscribe({

        next: events => {

          this.events =
            Array.isArray(events)
              ? events
              : [];


          this.isLoading = false;

        },


        error: error => {

          console.error(
            'Unable to load events:',
            error
          );


          this.errorMessage =
            'Unable to load events. Please try again.';


          this.isLoading = false;

        }

      });

  }


  clearSearch(): void {

    this.searchTerm = '';

  }


  isUpcoming(
    event: EventItem
  ): boolean {

    const start =
      new Date(
        event.startDateTime
      ).getTime();


    return (
      !Number.isNaN(start) &&
      start >= Date.now()
    );

  }


  getEventInitial(
    event: EventItem
  ): string {

    const name =
      event.name
        ?.trim();


    if (!name) {

      return 'E';

    }


    return name
      .charAt(0)
      .toUpperCase();

  }


  addEvent(): void {

    void this.router.navigate([
      '/admin/events/new'
    ]);

  }


  editEvent(
    id: number
  ): void {

    void this.router.navigate([
      '/admin/events',
      id,
      'edit'
    ]);

  }


  deleteEvent(
    event: EventItem
  ): void {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${event.name}"?`
      );


    if (!confirmed) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.eventService
      .delete(event.id)
      .subscribe({

        next: () => {

          this.events =
            this.events.filter(
              item =>
                item.id !== event.id
            );


          this.successMessage =
            'Event deleted successfully.';

        },


        error: error => {

          console.error(
            'Unable to delete event:',
            error
          );


          this.errorMessage =
            'Unable to delete this event. It may have active bookings.';

        }

      });

  }

}