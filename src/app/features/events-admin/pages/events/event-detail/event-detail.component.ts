import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EventItem } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';

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

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);

  event: EventItem | null = null;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id || id <= 0) {
      this.errorMessage = 'Invalid event ID.';
      return;
    }

    this.loadEvent(id);
  }

  loadEvent(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },

      error: () => {
        this.event = null;
        this.errorMessage =
          'Unable to load event details. Please try again.';

        this.isLoading = false;
      }
    });
  }

  retry(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (id > 0) {
      this.loadEvent(id);
    }
  }

  backToEvents(): void {
    this.router.navigate(['/events']);
  }
}
