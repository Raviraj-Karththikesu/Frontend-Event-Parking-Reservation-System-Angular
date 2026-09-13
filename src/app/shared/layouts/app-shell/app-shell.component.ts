import {
  Component
} from '@angular/core';
import {
  RouterOutlet
} from '@angular/router';

import {
  FooterComponent
} from '../../components/footer/footer.component';
import {
  NavbarComponent
} from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {}