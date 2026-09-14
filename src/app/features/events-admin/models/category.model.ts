export interface Category {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string | null;
}
