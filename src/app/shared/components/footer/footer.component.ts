import {
  Component,
  inject
} from '@angular/core';
import {
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private readonly authService =
    inject(AuthService);

  readonly isLoggedIn =
    this.authService.isLoggedIn;

  readonly isAdmin =
    this.authService.isAdmin;

  readonly isCustomer =
    this.authService.isCustomer;

  readonly currentYear =
    new Date().getFullYear();
}