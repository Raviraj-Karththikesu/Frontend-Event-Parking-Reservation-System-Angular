import { CommonModule } from '@angular/common';

import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Category } from '../../../models/category.model';

import {
  EventFilter,
  EventItem
} from '../../../models/event.model';

import { Venue } from '../../../models/venue.model';

import { CategoryService } from '../../../services/category.service';
import { EventService } from '../../../services/event.service';
import { VenueService } from '../../../services/venue.service';


@Component({
  selector: 'app-event-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './event-list.component.html',

  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {

  private readonly eventService =
    inject(EventService);

  private readonly venueService =
    inject(VenueService);

  private readonly categoryService =
    inject(CategoryService);

  private readonly router =
    inject(Router);


  events: EventItem[] = [];

  venues: Venue[] = [];

  categories: Category[] = [];


  filter: EventFilter = {
    search: '',
    date: '',
    venueId: undefined,
    eventCategoryId: undefined
  };


  isLoading = false;

  errorMessage = '';


  ngOnInit(): void {

    this.loadFilterOptions();

    this.loadEvents();

  }


  loadEvents(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.eventService
      .getAll(this.filter)
      .subscribe({

        next: (events) => {

          this.events = events;

          this.isLoading = false;

        },


        error: (error) => {

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


  private loadFilterOptions(): void {

    this.venueService
      .getAll()
      .subscribe({

        next: (venues) => {

          this.venues = venues;

        },


        error: (error) => {

          console.error(
            'Unable to load venues:',
            error
          );

        }

      });


    this.categoryService
      .getAll()
      .subscribe({

        next: (categories) => {

          this.categories = categories;

        },


        error: (error) => {

          console.error(
            'Unable to load categories:',
            error
          );

        }

      });

  }


  applyFilters(): void {

    this.loadEvents();

  }


  clearFilters(): void {

    this.filter = {
      search: '',
      date: '',
      venueId: undefined,
      eventCategoryId: undefined
    };


    this.loadEvents();

  }


  openEvent(id: number): void {

    void this.router.navigate([
      '/events',
      id
    ]);

  }


  scrollToEvents(): void {

    const section =
      document.getElementById(
        'event-list'
      );


    section?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }


  scrollToFilters(): void {

    const section =
      document.getElementById(
        'event-filters'
      );


    section?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });


    setTimeout(() => {

      const searchInput =
        document.getElementById(
          'search'
        ) as HTMLInputElement | null;


      searchInput?.focus();

    }, 450);

  }


  getEventImage(event: EventItem): string {

    const eventWithImage =
      event as EventItem & {
        imageUrl?: string;
      };


    if (eventWithImage.imageUrl) {

      return eventWithImage.imageUrl;

    }


    const category =
      (
        event.categoryName ??
        ''
      )
        .toString()
        .trim()
        .toLowerCase();


    if (
      category.includes('music') ||
      category.includes('concert')
    ) {

      return '/images/events/music-event.png';

    }


    if (
      category.includes('conference') ||
      category.includes('business')
    ) {

      return '/images/events/conference-event.jpg';

    }


    if (
      category.includes('party') ||
      category.includes('festival')
    ) {

      return '/images/events/party-event.png';

    }


    return '/images/events/default-event.png';

  }


  useFallbackImage(event: Event): void {

    const image =
      event.target as HTMLImageElement;


    if (
      !image.src.includes(
        'default-event.png'
      )
    ) {

      image.src =
        '/images/events/default-event.png';

    }

  }

}