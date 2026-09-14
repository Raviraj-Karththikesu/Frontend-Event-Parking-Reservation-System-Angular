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

  imports: [
    CommonModule
  ],

  template: `
    <div class="notifications-page">

      <div class="container">


        <!-- =========================
             HEADER
             ========================= -->
        <header class="page-header">

          <div class="header-copy">

            <p class="eyebrow">
              ACCOUNT ACTIVITY
            </p>

            <h1>
              Notifications
            </h1>

            <p class="subtitle">
              Stay informed about your bookings,
              payments and reservation activity.
            </p>

          </div>


          <div class="header-actions">

            <span
              class="unread-count"
              *ngIf="unreadCount > 0">

              {{ unreadCount }}

              {{
                unreadCount === 1
                  ? 'unread notification'
                  : 'unread notifications'
              }}

            </span>


            <button
              type="button"
              class="refresh-button"
              [disabled]="loading"
              (click)="load()">

              <span
                class="refresh-symbol"
                aria-hidden="true">

                ↻

              </span>

              {{
                loading
                  ? 'Refreshing...'
                  : 'Refresh'
              }}

            </button>

          </div>

        </header>



        <!-- =========================
             LOADING STATE
             ========================= -->
        <div
          class="state-card"
          *ngIf="loading">

          <div
            class="spinner"
            aria-hidden="true">
          </div>

          <div>

            <h2>
              Loading notifications
            </h2>

            <p>
              Please wait while we retrieve
              your latest activity.
            </p>

          </div>

        </div>



        <!-- =========================
             ERROR STATE
             ========================= -->
        <div
          class="error-card"
          *ngIf="
            !loading &&
            error
          ">

          <div class="error-symbol">
            !
          </div>


          <div class="error-content">

            <h2>
              Unable to load notifications
            </h2>

            <p>
              {{ error }}
            </p>

          </div>


          <button
            type="button"
            class="retry-button"
            (click)="load()">

            Try Again

          </button>

        </div>



        <!-- =========================
             NOTIFICATION LIST
             ========================= -->
        <section
          class="notification-list"
          *ngIf="
            !loading &&
            !error &&
            notifications.length > 0
          ">

          <article
            class="notification-card"
            *ngFor="let item of notifications"
            [class.notification-card--unread]="!item.isRead">


            <!-- Left unread indicator -->
            <div
              class="unread-indicator"
              [class.unread-indicator--active]="!item.isRead">
            </div>



            <!-- Notification type icon -->
            <div
              class="notification-icon"
              [class.notification-icon--payment]="
                isPaymentNotification(item)
              "
              [class.notification-icon--booking]="
                isBookingNotification(item)
              ">

              {{
                getNotificationCode(item)
              }}

            </div>



            <!-- Main content -->
            <div class="notification-content">

              <div class="title-row">

                <h2>
                  {{
                    item.title ||
                    'Account Notification'
                  }}
                </h2>


                <span
                  class="status-badge"
                  [class.status-badge--new]="!item.isRead">

                  {{
                    item.isRead
                      ? 'Read'
                      : 'New'
                  }}

                </span>

              </div>


              <p class="message">
                {{ item.message }}
              </p>


              <div class="metadata">

                <span class="date">

                  {{
                    item.createdAt
                      | date:'medium'
                  }}

                </span>


                <span
  class="type-badge"
  *ngIf="getNotificationTypeLabel(item)">

  {{ getNotificationTypeLabel(item) }}

</span>

              </div>

            </div>



            <!-- Action -->
            <div class="notification-actions">

              <button
                type="button"
                class="mark-read-button"
                *ngIf="!item.isRead"
                (click)="markRead(item)">

                Mark as Read

              </button>


              <span
                class="read-status"
                *ngIf="item.isRead">

                ✓ Read

              </span>

            </div>


          </article>

        </section>



        <!-- =========================
             EMPTY STATE
             ========================= -->
        <div
          class="empty-state"
          *ngIf="
            !loading &&
            !error &&
            notifications.length === 0
          ">

          <div class="empty-symbol">
            ✓
          </div>

          <h2>
            You're all caught up
          </h2>

          <p>
            There are no notifications at the moment.
            Booking, payment and reservation updates
            will appear here.
          </p>

        </div>


      </div>

    </div>
  `,


  styles: [`

    :host {
      display: block;
    }


    * {
      box-sizing: border-box;
    }


    /* =========================
       PAGE
       ========================= */

    .notifications-page {
      min-height: 100vh;

      padding:
        48px
        20px
        72px;

      background:
        linear-gradient(
          180deg,
          #f8fafc 0%,
          #f1f5f9 100%
        );

      color: #0f172a;
    }


    .container {
      width: 100%;
      max-width: 1050px;

      margin: 0 auto;
    }



    /* =========================
       HEADER
       ========================= */

    .page-header {
      display: flex;

      justify-content: space-between;
      align-items: flex-end;

      gap: 24px;

      margin-bottom: 32px;
    }


    .header-copy {
      max-width: 650px;
    }


    .eyebrow {
      margin: 0 0 8px;

      color: #2563eb;

      font-size: 12px;
      font-weight: 800;

      letter-spacing: 0.15em;

      text-transform: uppercase;
    }


    .page-header h1 {
      margin: 0;

      color: #0f172a;

      font-size: 36px;
      font-weight: 800;

      letter-spacing: -0.025em;
    }


    .subtitle {
      margin: 10px 0 0;

      color: #64748b;

      font-size: 15px;

      line-height: 1.6;
    }


    .header-actions {
      display: flex;

      align-items: center;

      gap: 12px;

      flex-shrink: 0;
    }


    .unread-count {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      padding: 8px 12px;

      border:
        1px solid
        #bfdbfe;

      border-radius: 999px;

      background: #eff6ff;

      color: #1d4ed8;

      font-size: 12px;
      font-weight: 700;
    }


    .refresh-button {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      gap: 7px;

      min-height: 40px;

      padding:
        9px
        14px;

      border:
        1px solid
        #cbd5e1;

      border-radius: 9px;

      background: #ffffff;

      color: #334155;

      font-size: 13px;
      font-weight: 700;

      cursor: pointer;

      transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease;
    }


    .refresh-button:hover:not(:disabled) {
      border-color: #94a3b8;

      background: #f8fafc;

      transform:
        translateY(-1px);
    }


    .refresh-button:disabled {
      opacity: 0.6;

      cursor: not-allowed;
    }


    .refresh-symbol {
      font-size: 18px;
      line-height: 1;
    }



    /* =========================
       NOTIFICATION LIST
       ========================= */

    .notification-list {
      display: flex;

      flex-direction: column;

      gap: 14px;
    }


    .notification-card {
      position: relative;

      display: grid;

      grid-template-columns:
        auto
        minmax(0, 1fr)
        auto;

      align-items: center;

      gap: 18px;

      padding:
        22px
        22px
        22px
        26px;

      overflow: hidden;

      border:
        1px solid
        #e2e8f0;

      border-radius: 14px;

      background: #ffffff;

      color: #0f172a;

      box-shadow:
        0 4px 14px
        rgba(
          15,
          23,
          42,
          0.04
        );

      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;
    }


    .notification-card:hover {
      border-color: #cbd5e1;

      box-shadow:
        0 10px 26px
        rgba(
          15,
          23,
          42,
          0.08
        );

      transform:
        translateY(-2px);
    }


    .notification-card--unread {
      border-color: #bfdbfe;

      background:
        linear-gradient(
          90deg,
          #f8fbff 0%,
          #ffffff 38%
        );
    }



    /* =========================
       UNREAD INDICATOR
       ========================= */

    .unread-indicator {
      position: absolute;

      top: 0;
      left: 0;

      width: 4px;
      height: 100%;

      background: transparent;
    }


    .unread-indicator--active {
      background: #2563eb;
    }



    /* =========================
       ICON
       ========================= */

    .notification-icon {
      display: grid;

      place-items: center;

      width: 48px;
      height: 48px;

      flex-shrink: 0;

      border:
        1px solid
        #e2e8f0;

      border-radius: 12px;

      background: #f8fafc;

      color: #475569;

      font-size: 11px;
      font-weight: 800;

      letter-spacing: 0.04em;
    }


    .notification-icon--booking {
      border-color: #bfdbfe;

      background: #eff6ff;

      color: #1d4ed8;
    }


    .notification-icon--payment {
      border-color: #a7f3d0;

      background: #ecfdf5;

      color: #047857;
    }



    /* =========================
       CONTENT
       ========================= */

    .notification-content {
      min-width: 0;
    }


    .title-row {
      display: flex;

      align-items: center;

      gap: 10px;

      flex-wrap: wrap;
    }


    .title-row h2 {
      margin: 0;

      color: #0f172a;

      font-size: 16px;
      font-weight: 750;
    }


    .status-badge {
      padding:
        4px
        8px;

      border-radius: 999px;

      background: #f1f5f9;

      color: #64748b;

      font-size: 10px;
      font-weight: 800;

      letter-spacing: 0.05em;

      text-transform: uppercase;
    }


    .status-badge--new {
      background: #dbeafe;

      color: #1d4ed8;
    }


    .message {
      margin:
        8px
        0
        0;

      color: #475569;

      font-size: 14px;

      line-height: 1.65;
    }


    .metadata {
      display: flex;

      align-items: center;

      gap: 10px;

      flex-wrap: wrap;

      margin-top: 13px;
    }


    .date {
      color: #94a3b8;

      font-size: 12px;
      font-weight: 600;
    }


    .type-badge {
      padding:
        4px
        7px;

      border-radius: 6px;

      background: #f1f5f9;

      color: #64748b;

      font-size: 11px;
      font-weight: 700;
    }



    /* =========================
       ACTIONS
       ========================= */

    .notification-actions {
      display: flex;

      align-items: center;
      justify-content: flex-end;

      min-width: 120px;
    }


    .mark-read-button {
      padding:
        9px
        13px;

      border:
        1px solid
        #cbd5e1;

      border-radius: 8px;

      background: #ffffff;

      color: #334155;

      font-size: 12px;
      font-weight: 700;

      cursor: pointer;

      transition:
        background 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease,
        transform 0.2s ease;
    }


    .mark-read-button:hover {
      border-color: #2563eb;

      background: #eff6ff;

      color: #1d4ed8;

      transform:
        translateY(-1px);
    }


    .read-status {
      color: #059669;

      font-size: 12px;
      font-weight: 700;
    }



    /* =========================
       LOADING
       ========================= */

    .state-card {
      display: flex;

      align-items: center;

      gap: 16px;

      padding: 26px;

      border:
        1px solid
        #e2e8f0;

      border-radius: 14px;

      background: #ffffff;

      color: #0f172a;

      box-shadow:
        0 5px 18px
        rgba(
          15,
          23,
          42,
          0.05
        );
    }


    .state-card h2 {
      margin:
        0
        0
        5px;

      color: #0f172a;

      font-size: 16px;
    }


    .state-card p {
      margin: 0;

      color: #64748b;

      font-size: 13px;
    }


    .spinner {
      width: 32px;
      height: 32px;

      border:
        3px solid
        #dbeafe;

      border-top-color: #2563eb;

      border-radius: 50%;

      animation:
        spin
        0.8s
        linear
        infinite;
    }


    @keyframes spin {

      to {
        transform:
          rotate(360deg);
      }

    }



    /* =========================
       ERROR
       ========================= */

    .error-card {
      display: grid;

      grid-template-columns:
        auto
        minmax(0, 1fr)
        auto;

      align-items: center;

      gap: 16px;

      padding: 20px;

      border:
        1px solid
        #fecaca;

      border-radius: 14px;

      background: #fffafa;

      color: #0f172a;
    }


    .error-symbol {
      display: grid;

      place-items: center;

      width: 38px;
      height: 38px;

      border-radius: 50%;

      background: #fee2e2;

      color: #b91c1c;

      font-weight: 800;
    }


    .error-content h2 {
      margin:
        0
        0
        4px;

      color: #991b1b;

      font-size: 15px;
    }


    .error-content p {
      margin: 0;

      color: #7f1d1d;

      font-size: 13px;
    }


    .retry-button {
      padding:
        9px
        13px;

      border: none;

      border-radius: 8px;

      background: #dc2626;

      color: #ffffff;

      font-weight: 700;

      cursor: pointer;
    }


    .retry-button:hover {
      background: #b91c1c;
    }



    /* =========================
       EMPTY STATE
       ========================= */

    .empty-state {
      padding:
        62px
        24px;

      text-align: center;

      border:
        1px solid
        #e2e8f0;

      border-radius: 14px;

      background: #ffffff;

      color: #0f172a;

      box-shadow:
        0 5px 18px
        rgba(
          15,
          23,
          42,
          0.05
        );
    }


    .empty-symbol {
      display: grid;

      place-items: center;

      width: 58px;
      height: 58px;

      margin:
        0
        auto
        18px;

      border-radius: 50%;

      background: #ecfdf5;

      color: #059669;

      font-size: 24px;
      font-weight: 800;
    }


    .empty-state h2 {
      margin: 0;

      color: #0f172a;

      font-size: 21px;
      font-weight: 750;
    }


    .empty-state p {
      max-width: 500px;

      margin:
        10px
        auto
        0;

      color: #64748b;

      font-size: 14px;

      line-height: 1.65;
    }



    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 760px) {

      .notifications-page {
        padding:
          32px
          14px
          50px;
      }


      .page-header {
        align-items: flex-start;

        flex-direction: column;
      }


      .header-actions {
        width: 100%;

        justify-content: space-between;
      }


      .page-header h1 {
        font-size: 29px;
      }


      .notification-card {
        grid-template-columns:
          auto
          minmax(0, 1fr);

        align-items: flex-start;
      }


      .notification-actions {
        grid-column: 2;

        justify-content: flex-start;

        min-width: 0;
      }


      .error-card {
        grid-template-columns:
          auto
          minmax(0, 1fr);
      }


      .retry-button {
        grid-column: 2;

        justify-self: flex-start;
      }

    }



    @media (max-width: 480px) {

      .notification-card {
        gap: 13px;

        padding: 18px;
      }


      .notification-icon {
        width: 42px;
        height: 42px;
      }


      .header-actions {
        align-items: stretch;

        flex-direction: column;
      }


      .unread-count {
        text-align: center;
      }


      .refresh-button {
        width: 100%;
      }


      .notification-actions {
        width: 100%;
      }


      .mark-read-button {
        width: 100%;
      }

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



  /* =========================
     UNREAD COUNT
     ========================= */

  get unreadCount(): number {

    return this.notifications
      .filter(
        notification =>
          !notification.isRead
      )
      .length;

  }



  /* =========================
     LOAD NOTIFICATIONS
     ========================= */

  load(): void {

    const customerId =
      getCurrentCustomerId();


    this.error = '';

    this.loading = true;


    if (!customerId) {

      this.loading = false;

      this.error =
        'Customer session not found.';

      return;

    }


    this.notificationService
      .getCustomerNotifications(
        customerId
      )
      .subscribe({

        next: result => {

          this.notifications =
            [...result].sort(

              (a, b) =>

                new Date(
                  b.createdAt
                ).getTime()

                -

                new Date(
                  a.createdAt
                ).getTime()

            );


          this.loading = false;

        },


        error: err => {

          this.loading = false;


          this.error =
            err?.error?.message ??
            err?.error?.title ??
            'Unable to load notifications.';

        }

      });

  }



  /* =========================
     MARK AS READ
     ========================= */

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
      .markAsRead(
        notificationId
      )
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



  /* =========================
     NOTIFICATION TYPE HELPERS
     ========================= */

  isPaymentNotification(
    item: NotificationResponse
  ): boolean {

    const text =
      `${
        item.type ?? ''
      } ${
        item.title ?? ''
      }`
        .toLowerCase();


    return text.includes(
      'payment'
    );

  }



  isBookingNotification(
    item: NotificationResponse
  ): boolean {

    const text =
      `${
        item.type ?? ''
      } ${
        item.title ?? ''
      }`
        .toLowerCase();


    return text.includes(
      'booking'
    );

  }



  getNotificationCode(
    item: NotificationResponse
  ): string {

    if (
      this.isPaymentNotification(
        item
      )
    ) {

      return 'PAY';

    }


    if (
      this.isBookingNotification(
        item
      )
    ) {

      return 'BKG';

    }


    return 'INFO';

  }

  getNotificationTypeLabel(
  item: NotificationResponse
): string {

  const value = item.type;

  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  const text =
    String(value).trim();

  if (
    text === '' ||
    text === '0'
  ) {
    return '';
  }

  const normalized =
    text.toLowerCase();

  if (
    normalized.includes('payment')
  ) {
    return 'Payment';
  }

  if (
    normalized.includes('booking')
  ) {
    return 'Booking';
  }

  return text;
}

  

}