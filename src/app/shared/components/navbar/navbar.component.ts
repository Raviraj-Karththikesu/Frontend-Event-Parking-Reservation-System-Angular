import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  AuthService
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  readonly currentUser =
    this.authService.currentUser;

  readonly isLoggedIn =
    this.authService.isLoggedIn;

  readonly isAdmin =
    this.authService.isAdmin;

  readonly isCustomer =
    this.authService.isCustomer;

  readonly mobileMenuOpen =
    signal(false);

  readonly userInitial = computed(() => {
    const fullName =
      this.currentUser()?.fullName?.trim();

    return fullName
      ? fullName.charAt(0).toUpperCase()
      : 'U';
  });

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(
      isOpen => !isOpen
    );
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  async logout(): Promise<void> {
    this.authService.logout();
    this.closeMobileMenu();

    await this.router.navigate(['/login']);
  }
}