import {
  CommonModule
} from '@angular/common';

import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  Category
} from '../../../models/category.model';

import {
  CategoryService
} from '../../../services/category.service';


@Component({
  selector: 'app-category-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './category-list.component.html',

  styleUrl:
    './category-list.component.scss'
})
export class CategoryListComponent
  implements OnInit {

  private readonly categoryService =
    inject(CategoryService);

  private readonly router =
    inject(Router);


  categories: Category[] = [];


  searchTerm = '';


  isLoading = false;

  errorMessage = '';

  successMessage = '';


  ngOnInit(): void {

    this.loadCategories();

  }


  get filteredCategories(): Category[] {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    if (!term) {

      return this.categories;

    }


    return this.categories.filter(
      category => {

        const searchableText =
          [
            category.id,
            category.name,
            category.description ?? ''
          ]
            .join(' ')
            .toLowerCase();


        return searchableText.includes(
          term
        );

      }
    );

  }


  get describedCount(): number {

    return this.categories.filter(
      category =>
        Boolean(
          category.description?.trim()
        )
    ).length;

  }


  get recentCount(): number {

    const now =
      Date.now();


    const thirtyDays =
      30 *
      24 *
      60 *
      60 *
      1000;


    return this.categories.filter(
      category => {

        const created =
          new Date(
            category.createdAt
          ).getTime();


        if (
          Number.isNaN(created)
        ) {

          return false;

        }


        return (
          now - created <= thirtyDays
        );

      }
    ).length;

  }


  get latestCategory():
    Category | null {

    if (
      this.categories.length === 0
    ) {

      return null;

    }


    return this.categories.reduce(
      (
        latest,
        current
      ) => {

        const latestDate =
          new Date(
            latest.createdAt
          ).getTime();


        const currentDate =
          new Date(
            current.createdAt
          ).getTime();


        if (
          Number.isNaN(currentDate)
        ) {

          return latest;

        }


        if (
          Number.isNaN(latestDate)
        ) {

          return current;

        }


        return (
          currentDate > latestDate
            ? current
            : latest
        );

      }
    );

  }


  loadCategories(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.categoryService
      .getAll()
      .subscribe({

        next: categories => {

          this.categories =
            Array.isArray(categories)
              ? categories
              : [];


          this.isLoading = false;

        },


        error: error => {

          console.error(
            'Unable to load categories:',
            error
          );


          this.errorMessage =
            'Unable to load categories. Please try again.';


          this.isLoading = false;

        }

      });

  }


  clearSearch(): void {

    this.searchTerm = '';

  }


  getCategoryInitial(
    category: Category
  ): string {

    const name =
      category.name?.trim();


    if (!name) {

      return 'C';

    }


    return name
      .charAt(0)
      .toUpperCase();

  }


  getCategoryColorClass(
    category: Category
  ): string {

    const index =
      Math.abs(
        Number(category.id)
      ) % 4;


    switch (index) {

      case 0:
        return 'avatar-blue';

      case 1:
        return 'avatar-green';

      case 2:
        return 'avatar-purple';

      default:
        return 'avatar-orange';

    }

  }


  addCategory(): void {

    void this.router.navigate([
      '/admin/categories/new'
    ]);

  }


  editCategory(
    id: number
  ): void {

    void this.router.navigate([
      '/admin/categories',
      id,
      'edit'
    ]);

  }


  deleteCategory(
    category: Category
  ): void {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${category.name}"?`
      );


    if (!confirmed) {

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';


    this.categoryService
      .delete(category.id)
      .subscribe({

        next: () => {

          this.categories =
            this.categories.filter(
              item =>
                item.id !== category.id
            );


          this.successMessage =
            'Category deleted successfully.';

        },


        error: error => {

          console.error(
            'Unable to delete category:',
            error
          );


          this.errorMessage =
            'Unable to delete category. It may be linked to an event.';

        }

      });

  }

}