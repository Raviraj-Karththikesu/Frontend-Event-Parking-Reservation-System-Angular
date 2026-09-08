import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Observable<T> {
    return this.http.get<T>(
      this.buildUrl(endpoint),
      { params }
    );
  }

  post<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody
  ): Observable<TResponse> {
    return this.http.post<TResponse>(
      this.buildUrl(endpoint),
      body
    );
  }

  put<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody
  ): Observable<TResponse> {
    return this.http.put<TResponse>(
      this.buildUrl(endpoint),
      body
    );
  }

  patch<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody
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
    const cleanEndpoint =
      endpoint.replace(/^\/+/, '');

    return `${this.apiUrl}/${cleanEndpoint}`;
  }
}