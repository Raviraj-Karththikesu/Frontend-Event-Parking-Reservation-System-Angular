import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EventItem } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-admin-event-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './admin-event-list.component.html',
  styleUrl: './admin-event-list.component.scss'
})
export class AdminEventListComponent implements OnInit {

  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);

  events: EventItem[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getAll().subscribe({
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

  addEvent(): void {
    this.router.navigate([
      '/admin/events/new'
    ]);
  }

  editEvent(id: number): void {
    this.router.navigate([
      '/admin/events',
      id,
      'edit'
    ]);
  }

  deleteEvent(event: EventItem): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.eventService.delete(event.id).subscribe({
      next: () => {
        this.events = this.events.filter(
          item => item.id !== event.id
        );

        this.successMessage =
          'Event deleted successfully.';
      },

      error: () => {
        this.errorMessage =
          'Unable to delete this event. It may have active bookings.';
      }
    });
  }
}
