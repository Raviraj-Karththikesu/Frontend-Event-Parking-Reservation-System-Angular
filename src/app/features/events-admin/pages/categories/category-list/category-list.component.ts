import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {

  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

  categories: Category[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },

      error: () => {
        this.errorMessage =
          'Unable to load categories. Please try again.';

        this.isLoading = false;
      }
    });
  }

  addCategory(): void {
    this.router.navigate([
      '/admin/categories/new'
    ]);
  }

  editCategory(id: number): void {
    this.router.navigate([
      '/admin/categories',
      id,
      'edit'
    ]);
  }

  deleteCategory(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this category?'
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.categories =
          this.categories.filter(
            category => category.id !== id
          );
      },

      error: () => {
        this.errorMessage =
          'Unable to delete category. It may be linked to an event.';
      }
    });
  }
}
