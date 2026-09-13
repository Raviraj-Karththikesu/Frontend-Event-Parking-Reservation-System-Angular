import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import { NotificationService }
  from '../../services/notification.service';

import { NotificationResponse }
  from '../../models/notification.models';

import { getCurrentCustomerId }
  from '../../utils/auth-context.util';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">

      <h1>Notifications</h1>

      <p *ngIf="loading">
        Loading...
      </p>

      <p class="error" *ngIf="error">
        {{ error }}
      </p>

      <div
        class="notification"
        *ngFor="let item of notifications"
        [class.unread]="!item.isRead">

        <div>

          <h3 *ngIf="item.title">
            {{ item.title }}
          </h3>

          <p>
            {{ item.message }}
          </p>

          <small>
            {{ item.createdAt | date:'medium' }}
          </small>

        </div>

        <button
          *ngIf="!item.isRead"
          (click)="markRead(item)">

          Mark as Read

        </button>

      </div>

      <p
        *ngIf="
          !loading
          && notifications.length === 0
        ">

        No notifications.

      </p>

    </div>
  `,
  styles: [`
    .page {
      max-width:900px;
      margin:auto;
      padding:35px 16px;
    }

    .notification {
      display:flex;
      justify-content:space-between;
      gap:20px;
      padding:20px;
      margin:12px 0;
      border:1px solid #ddd;
      border-radius:12px;
    }

    .unread {
      border-left:5px solid currentColor;
      font-weight:500;
    }

    .error {
      color:#b00020;
    }
  `]
})
export class NotificationsComponent
  implements OnInit {

  notifications:
    NotificationResponse[] = [];

  loading = true;

  error = '';

  constructor(
    private notificationService:
      NotificationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    const customerId =
      getCurrentCustomerId();

    if (!customerId) {

      this.loading = false;

      this.error =
        'Customer session not found.';

      return;
    }

    this.notificationService
      .getCustomerNotifications(customerId)
      .subscribe({

        next: result => {

          this.notifications =
            [...result].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

          this.loading = false;
        },

        error: err => {

          this.loading = false;

          this.error =
            err?.error?.message ??
            'Unable to load notifications.';
        }
      });
  }

  markRead(
  item: NotificationResponse
): void {

  const notificationId =
    item.id ??
    item.notificationId;

  if (!notificationId) {

    alert(
      'Notification ID was not found.'
    );

    return;
  }

  this.notificationService
    .markAsRead(notificationId)
    .subscribe({

      next: () => {

        item.isRead = true;
      },

      error: err => {

        console.error(
          'Mark notification as read failed:',
          err
        );

        alert(
          err?.error?.message ??
          err?.error?.title ??
          'Unable to update notification.'
        );
      }
    });
}
}