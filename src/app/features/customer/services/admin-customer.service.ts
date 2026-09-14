import {
  inject,
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs';

import {
  API_ENDPOINTS
} from '../../../core/constants/api-endpoints';
import {
  ApiService
} from '../../../core/services/api.service';
import {
  AdminCustomerDetail,
  AdminCustomerListItem,
  CustomerAccountStatus,
  UpdateCustomerStatusRequest
} from '../models/admin-customer.model';

@Injectable({
  providedIn: 'root'
})
export class AdminCustomerService {
  private readonly apiService =
    inject(ApiService);

  getCustomers(
    search = ''
  ): Observable<AdminCustomerListItem[]> {
    const normalizedSearch = search.trim();

    return this.apiService.get<
      AdminCustomerListItem[]
    >(
      API_ENDPOINTS.customers.root,
      normalizedSearch
        ? { search: normalizedSearch }
        : undefined
    );
  }

  getCustomerById(
    customerId: number
  ): Observable<AdminCustomerDetail> {
    return this.apiService.get<
      AdminCustomerDetail
    >(
      API_ENDPOINTS.customers.byId(
        customerId
      )
    );
  }

  updateStatus(
    customerId: number,
    status: CustomerAccountStatus
  ): Observable<AdminCustomerDetail> {
    const request: UpdateCustomerStatusRequest = {
      status
    };

    return this.apiService.patch<
      AdminCustomerDetail,
      UpdateCustomerStatusRequest
    >(
      API_ENDPOINTS.customers.status(
        customerId
      ),
      request
    );
  }

  deactivateCustomer(
    customerId: number
  ): Observable<AdminCustomerDetail> {
    return this.apiService.delete<
      AdminCustomerDetail
    >(
      API_ENDPOINTS.customers.byId(
        customerId
      )
    );
  }

  reactivateCustomer(
    customerId: number
  ): Observable<AdminCustomerDetail> {
    return this.apiService.post<
      AdminCustomerDetail,
      Record<string, never>
    >(
      API_ENDPOINTS.customers.reactivate(
        customerId
      ),
      {}
    );
  }
}