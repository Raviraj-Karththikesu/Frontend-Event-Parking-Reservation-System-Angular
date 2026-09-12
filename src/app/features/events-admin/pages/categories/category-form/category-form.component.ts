import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';


import {
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../../../models/category.model';

import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {

  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  category: CreateCategoryRequest = {
    name: '',
    description: ''
  };

  categoryId: number | null = null;

  isEditMode = false;
  isLoading = false;
  isSubmitting = false;

  successMessage = '';
  errorMessage = '';


  goBack(): void {
    this.router.navigate(['/admin/categories']);
  }

  ngOnInit(): void {
    const idParam =
      this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage =
        'Invalid category ID.';
      return;
    }

    this.categoryId = id;
    this.isEditMode = true;

    this.loadCategory(id);
  }

  private loadCategory(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getById(id).subscribe({
      next: (category) => {
        this.category = {
          name: category.name,
          description: category.description ?? ''
        };

        this.isLoading = false;
      },

      error: () => {
        this.errorMessage =
          'Unable to load category details. Please try again.';

        this.isLoading = false;
      }
    });
  }

  submit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (
      this.isEditMode &&
      this.categoryId !== null
    ) {
      this.updateCategory();
      return;
    }

    this.createCategory(form);
  }

  private createCategory(form: NgForm): void {
    this.categoryService
      .create(this.category)
      .subscribe({
        next: () => {
          this.successMessage =
            'Category created successfully.';

          this.isSubmitting = false;

          form.resetForm({
            name: '',
            description: ''
          });
        },

        error: () => {
          this.errorMessage =
            'Unable to create category. Please try again.';

          this.isSubmitting = false;
        }
      });
  }

  private updateCategory(): void {
    if (this.categoryId === null) {
      return;
    }

    const request: UpdateCategoryRequest = {
      name: this.category.name,
      description: this.category.description
    };

    this.categoryService
      .update(this.categoryId, request)
      .subscribe({
        next: () => {
          this.successMessage =
            'Category updated successfully.';

          this.isSubmitting = false;
        },

        error: () => {
          this.errorMessage =
            'Unable to update category. Please try again.';

          this.isSubmitting = false;
        }
      });
  }
}
