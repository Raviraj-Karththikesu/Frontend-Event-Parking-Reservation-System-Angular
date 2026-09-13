import {
  DatePipe
} from '@angular/common';
import {
  HttpErrorResponse
} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import {
  finalize
} from 'rxjs';

import {
  AdminCustomerDetail,
  AdminCustomerListItem
} from '../../models/admin-customer.model';
import {
  AdminCustomerService
} from '../../services/admin-customer.service';

@Component({
  selector: 'app-admin-customer-management',
  imports: [
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl:
    './admin-customer-management.component.html',
  styleUrl:
    './admin-customer-management.component.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AdminCustomerManagementComponent
  implements OnInit {
  private readonly customerService =
    inject(AdminCustomerService);

  readonly searchControl =
    new FormControl('', {
      nonNullable: true
    });

  readonly customers =
    signal<AdminCustomerListItem[]>([]);

  readonly selectedCustomer =
    signal<AdminCustomerDetail | null>(null);

  readonly pendingCustomer =
    signal<AdminCustomerListItem | null>(null);

  readonly isLoading = signal(false);
  readonly isDetailsLoading = signal(false);
  readonly isUpdatingStatus = signal(false);
  readonly isDetailsOpen = signal(false);

  readonly errorMessage = signal('');
  readonly detailsErrorMessage = signal('');
  readonly actionErrorMessage = signal('');
  readonly successMessage = signal('');

  readonly totalCustomers = computed(
    () => this.customers().length
  );

  readonly activeCustomers = computed(
    () =>
      this.customers().filter(customer =>
        this.isActive(customer)
      ).length
  );

  readonly deactivatedCustomers = computed(
    () =>
      this.customers().filter(customer =>
        !this.isActive(customer)
      ).length
  );

  readonly verifiedCustomers = computed(
    () =>
      this.customers().filter(
        customer => customer.emailVerified
      ).length
  );

  readonly confirmationTitle = computed(() => {
    const customer = this.pendingCustomer();

    if (!customer) {
      return '';
    }

    return this.isActive(customer)
      ? 'Deactivate customer?'
      : 'Reactivate customer?';
  });

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    this.customerService
      .getCustomers(
        this.searchControl.value
      )
      .pipe(
        finalize(() =>
          this.isLoading.set(false)
        )
      )
      .subscribe({
        next: customers => {
          const customerAccounts =
            customers.filter(
              customer =>
                customer.role.toLowerCase() ===
                'customer'
            );

          this.customers.set(
            customerAccounts
          );
        },
        error: (
          error: HttpErrorResponse
        ) => {
          this.customers.set([]);

          this.errorMessage.set(
            this.getErrorMessage(
              error,
              'Unable to load customers.'
            )
          );
        }
      });
  }

  submitSearch(): void {
    this.loadCustomers();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.loadCustomers();
  }

  viewCustomer(
    customer: AdminCustomerListItem
  ): void {
    this.selectedCustomer.set(null);
    this.detailsErrorMessage.set('');
    this.isDetailsOpen.set(true);
    this.isDetailsLoading.set(true);

    this.customerService
      .getCustomerById(
        customer.customerId
      )
      .pipe(
        finalize(() =>
          this.isDetailsLoading.set(false)
        )
      )
      .subscribe({
        next: customerDetail => {
          this.selectedCustomer.set(
            customerDetail
          );
        },
        error: (
          error: HttpErrorResponse
        ) => {
          this.detailsErrorMessage.set(
            this.getErrorMessage(
              error,
              'Unable to load customer details.'
            )
          );
        }
      });
  }

  closeDetails(): void {
    if (this.isUpdatingStatus()) {
      return;
    }

    this.isDetailsOpen.set(false);
    this.selectedCustomer.set(null);
    this.detailsErrorMessage.set('');
  }

  requestStatusChange(
    customer: AdminCustomerListItem
  ): void {
    this.actionErrorMessage.set('');
    this.pendingCustomer.set(customer);
  }

  cancelStatusChange(): void {
    if (this.isUpdatingStatus()) {
      return;
    }

    this.pendingCustomer.set(null);
    this.actionErrorMessage.set('');
  }

  confirmStatusChange(): void {
    const customer = this.pendingCustomer();

    if (!customer) {
      return;
    }

    const shouldDeactivate =
      this.isActive(customer);

    const statusRequest$ =
      shouldDeactivate
        ? this.customerService
            .deactivateCustomer(
              customer.customerId
            )
        : this.customerService
            .reactivateCustomer(
              customer.customerId
            );

    this.actionErrorMessage.set('');
    this.isUpdatingStatus.set(true);

    statusRequest$
      .pipe(
        finalize(() =>
          this.isUpdatingStatus.set(false)
        )
      )
      .subscribe({
        next: updatedCustomer => {
          this.updateCustomerState(
            updatedCustomer
          );

          this.successMessage.set(
            `${customer.fullName} was ${
              shouldDeactivate
                ? 'deactivated'
                : 'reactivated'
            } successfully.`
          );

          this.pendingCustomer.set(null);
        },
        error: (
          error: HttpErrorResponse
        ) => {
          this.actionErrorMessage.set(
            this.getErrorMessage(
              error,
              shouldDeactivate
                ? 'Unable to deactivate customer.'
                : 'Unable to reactivate customer.'
            )
          );
        }
      });
  }

  dismissSuccessMessage(): void {
    this.successMessage.set('');
  }

  isActive(
    customer: AdminCustomerListItem
  ): boolean {
    return (
      customer.status.toLowerCase() ===
      'active'
    );
  }

  getInitials(fullName: string): string {
    const names = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (names.length === 0) {
      return 'CU';
    }

    return names
      .slice(0, 2)
      .map(name =>
        name.charAt(0).toUpperCase()
      )
      .join('');
  }

  private updateCustomerState(
    updatedCustomer: AdminCustomerDetail
  ): void {
    this.customers.update(customers =>
      customers.map(customer =>
        customer.customerId ===
        updatedCustomer.customerId
          ? {
              ...customer,
              fullName:
                updatedCustomer.fullName,
              email: updatedCustomer.email,
              phoneNumber:
                updatedCustomer.phoneNumber,
              role: updatedCustomer.role,
              status:
                updatedCustomer.status,
              emailVerified:
                updatedCustomer.emailVerified,
              createdAt:
                updatedCustomer.createdAt
            }
          : customer
      )
    );

    this.selectedCustomer.update(
      currentCustomer => {
        if (
          !currentCustomer ||
          currentCustomer.customerId !==
            updatedCustomer.customerId
        ) {
          return currentCustomer;
        }

        return {
          ...currentCustomer,
          ...updatedCustomer,
          bookingSummary:
            currentCustomer.bookingSummary
        };
      }
    );
  }

  private getErrorMessage(
    error: HttpErrorResponse,
    fallbackMessage: string
  ): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Check whether the backend is running.';
    }

    const response = error.error as {
      message?: string;
      title?: string;
      errors?: Record<string, string[]>;
    } | null;

    const validationMessage =
      response?.errors
        ? Object.values(response.errors)
            .flat()
            .at(0)
        : undefined;

    return (
      response?.message ??
      validationMessage ??
      response?.title ??
      fallbackMessage
    );
  }
}