import { Routes } from '@angular/router';

import {
  roleGuard
} from '../core/guards/role.guard';

import {
  APP_ROLES
} from '../core/constants/app-roles';

export const eventRoutes: Routes = [

  // Public Event Catalogue
  {
    path: 'events',
    loadComponent: () =>
      import(
        '../features/events-admin/pages/events/event-list/event-list.component'
      ).then(
        component => component.EventListComponent
      ),
    title: 'Events | Event Parking'
  },

  // Public Event Details
  {
    path: 'events/:id',
    loadComponent: () =>
      import(
        '../features/events-admin/pages/events/event-detail/event-detail.component'
      ).then(
        component => component.EventDetailComponent
      ),
    title: 'Event Details | Event Parking'
  },

  // Admin Event List
  {
    path: 'admin/events',
    canActivate: [roleGuard],
    data: {
      roles: [APP_ROLES.admin]
    },
    loadComponent: () =>
      import(
        '../features/events-admin/pages/events/admin-event-list/admin-event-list.component'
      ).then(
        component => component.AdminEventListComponent
      ),
    title: 'Manage Events | Event Parking'
  },

  // Admin Create Event
  {
    path: 'admin/events/new',
    canActivate: [roleGuard],
    data: {
      roles: [APP_ROLES.admin]
    },
    loadComponent: () =>
      import(
        '../features/events-admin/pages/events/admin-event-form/admin-event-form.component'
      ).then(
        component => component.AdminEventFormComponent
      ),
    title: 'Create Event | Event Parking'
  },

  // Admin Edit Event
  {
    path: 'admin/events/:id/edit',
    canActivate: [roleGuard],
    data: {
      roles: [APP_ROLES.admin]
    },
    loadComponent: () =>
      import(
        '../features/events-admin/pages/events/admin-event-form/admin-event-form.component'
      ).then(
        component => component.AdminEventFormComponent
      ),
    title: 'Edit Event | Event Parking'
  }
];
