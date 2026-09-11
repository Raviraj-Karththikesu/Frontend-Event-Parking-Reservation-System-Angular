import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Category } from '../../../models/category.model';
import { EventFilter, EventItem } from '../../../models/event.model';
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

  private readonly eventService = inject(EventService);
  private readonly venueService = inject(VenueService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

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

    this.eventService.getAll(this.filter).subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false;
      },

      error: () => {
        this.errorMessage =
          'Unable to load events. Please try again.';

        this.isLoading = false;
      }
    });
  }

  private loadFilterOptions(): void {
    this.venueService.getAll().subscribe({
      next: (venues) => {
        this.venues = venues;
      }
    });

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
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
    this.router.navigate([
      '/events',
      id
    ]);
  }
}
