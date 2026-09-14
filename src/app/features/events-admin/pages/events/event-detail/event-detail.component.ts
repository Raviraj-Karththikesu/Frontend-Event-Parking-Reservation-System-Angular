import { CommonModule } from '@angular/common';

import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  EventItem
} from '../../../models/event.model';

import {
  EventService
} from '../../../services/event.service';


@Component({
  selector: 'app-event-detail',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './event-detail.component.html',

  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly eventService =
    inject(EventService);


  event: EventItem | null = null;

  isLoading = false;

  errorMessage = '';


  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );


    if (
      !id ||
      id <= 0
    ) {

      this.errorMessage =
        'Invalid event ID.';

      return;

    }


    this.loadEvent(id);

  }


  loadEvent(id: number): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.eventService
      .getById(id)
      .subscribe({

        next: (event) => {

          this.event = event;

          this.isLoading = false;

        },


        error: (error) => {

          console.error(
            'Unable to load event details:',
            error
          );


          this.event = null;


          this.errorMessage =
            'Unable to load event details. Please try again.';


          this.isLoading = false;

        }

      });

  }


  retry(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );


    if (
      id &&
      id > 0
    ) {

      this.loadEvent(id);

    }

  }


  backToEvents(): void {

    void this.router.navigate([
      '/events'
    ]);

  }


  bookEvent(): void {

    if (!this.event) {
      return;
    }


    void this.router.navigate([
      '/events',
      this.event.id,
      'seats'
    ]);

  }


  getEventImage(): string {

    if (!this.event) {

      return '/images/events/default-event.png';

    }


    const eventWithImage =
      this.event as EventItem & {
        imageUrl?: string;
      };


    if (eventWithImage.imageUrl) {

      return eventWithImage.imageUrl;

    }


    const category =
      (
        this.event.categoryName ??
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

}