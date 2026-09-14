import { Routes } from '@angular/router';

import {
  roleGuard
} from '../core/guards/role.guard';

import {
  APP_ROLES
} from '../core/constants/app-roles';

export const eventRoutes: Routes = [

  // =========================
  // PUBLIC EVENTS
  // =========================

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

  // =========================
  // ADMIN EVENTS
  // =========================

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
  },

  // =========================
  // ADMIN CATEGORIES
  // =========================

  // Admin Category List
  {
    path: 'admin/categories',
    canActivate: [roleGuard],
    data: {
      roles: [APP_ROLES.admin]
    },
    loadComponent: () =>
      import(
        '../features/events-admin/pages/categories/category-list/category-list.component'
      ).then(
        component => component.CategoryListComponent
      ),
    title: 'Manage Categories | Event Parking'
  },

  // Admin Create Category
  {
    path: 'admin/categories/new',
    canActivate: [roleGuard],
    data: {
      roles: [APP_ROLES.admin]
    },
    loadComponent: () =>
      import(
        '../features/events-admin/pages/categories/category-form/category-form.component'
      ).then(
        component => component.CategoryFormComponent
      ),
    title: 'Create Category | Event Parking'
  },

  // Admin Edit Category
  {
    path: 'admin/categories/:id/edit',
    canActivate: [roleGuard],
    data: {
      roles: [APP_ROLES.admin]
    },
    loadComponent: () =>
      import(
        '../features/events-admin/pages/categories/category-form/category-form.component'
      ).then(
        component => component.CategoryFormComponent
      ),
    title: 'Edit Category | Event Parking'
  },

  // =========================
  // ADMIN VENUES
  // =========================

  // Admin Venue List
  {
    path: 'admin/venues',
    canActivate: [roleGuard],
    data: {
      roles: [APP_ROLES.admin]
    },
    loadComponent: () =>
      import(
        '../features/events-admin/pages/venues/venue-list/venue-list.component'
      ).then(
        component => component.VenueListComponent
      ),
    title: 'Manage Venues | Event Parking'
  },

  // Admin Create Venue
  {
    path: 'admin/venues/new',
    canActivate: [roleGuard],
    data: {
      roles: [APP_ROLES.admin]
    },
    loadComponent: () =>
      import(
        '../features/events-admin/pages/venues/venue-form/venue-form.component'
      ).then(
        component => component.VenueFormComponent
      ),
    title: 'Create Venue | Event Parking'
  },

  // Admin Edit Venue
  {
    path: 'admin/venues/:id/edit',
    canActivate: [roleGuard],
    data: {
      roles: [APP_ROLES.admin]
    },
    loadComponent: () =>
      import(
        '../features/events-admin/pages/venues/venue-form/venue-form.component'
      ).then(
        component => component.VenueFormComponent
      ),
    title: 'Edit Venue | Event Parking'
  }

];
