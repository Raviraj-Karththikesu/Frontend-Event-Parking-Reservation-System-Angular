import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import(
        './features/auth/pages/login/login.component'
      ).then(component => component.LoginComponent),
    title: 'Login | Event Parking'
  },
  {
    path: 'register',
    loadComponent: () =>
      import(
        './features/auth/pages/register/register.component'
      ).then(component => component.RegisterComponent),
    title: 'Register | Event Parking'
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        './features/auth/pages/forgot-password/forgot-password.component'
      ).then(
        component => component.ForgotPasswordComponent
      ),
    title: 'Forgot Password | Event Parking'
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import(
        './features/auth/pages/reset-password/reset-password.component'
      ).then(
        component => component.ResetPasswordComponent
      ),
    title: 'Reset Password | Event Parking'
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import(
        './features/auth/pages/verify-email/verify-email.component'
      ).then(
        component => component.VerifyEmailComponent
      ),
    title: 'Verify Email | Event Parking'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

