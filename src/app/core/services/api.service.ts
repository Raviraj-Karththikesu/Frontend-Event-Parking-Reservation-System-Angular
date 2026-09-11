import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export type ApiQueryParams = Record<
  string,
  string | number | boolean
>;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    environment.apiUrl.replace(/\/+$/, '');

  get<TResponse>(
    endpoint: string,
    params?: ApiQueryParams
  ): Observable<TResponse> {
    return this.http.get<TResponse>(
      this.buildUrl(endpoint),
      { params }
    );
  }

  post<TResponse, TRequest = unknown>(
    endpoint: string,
    body: TRequest
  ): Observable<TResponse> {
    return this.http.post<TResponse>(
      this.buildUrl(endpoint),
      body
    );
  }

  put<TResponse, TRequest = unknown>(
    endpoint: string,
    body: TRequest
  ): Observable<TResponse> {
    return this.http.put<TResponse>(
      this.buildUrl(endpoint),
      body
    );
  }

  patch<TResponse, TRequest = unknown>(
    endpoint: string,
    body: TRequest
  ): Observable<TResponse> {
    return this.http.patch<TResponse>(
      this.buildUrl(endpoint),
      body
    );
  }

  delete<TResponse = void>(
    endpoint: string
  ): Observable<TResponse> {
    return this.http.delete<TResponse>(
      this.buildUrl(endpoint)
    );
  }

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint
      .trim()
      .replace(/^\/+/, '');

    return cleanEndpoint
      ? `${this.baseUrl}/${cleanEndpoint}`
      : this.baseUrl;
  }
}