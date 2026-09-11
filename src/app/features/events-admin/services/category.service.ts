import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly api = inject(ApiService);
  private readonly endpoint = 'Categories';

  getAll(): Observable<Category[]> {
    return this.api.get<Category[]>(
      this.endpoint
    );
  }

  getById(id: number): Observable<Category> {
    return this.api.get<Category>(
      `${this.endpoint}/${id}`
    );
  }

  create(
    request: CreateCategoryRequest
  ): Observable<Category> {
    return this.api.post<
      Category,
      CreateCategoryRequest
    >(
      this.endpoint,
      request
    );
  }

  update(
    id: number,
    request: UpdateCategoryRequest
  ): Observable<Category> {
    return this.api.put<
      Category,
      UpdateCategoryRequest
    >(
      `${this.endpoint}/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(
      `${this.endpoint}/${id}`
    );
  }
}

