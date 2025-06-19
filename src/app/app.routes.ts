import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContactDetailComponent } from './components/contact-detail/contact-detail.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'contact/new', component: ContactFormComponent, canActivate: [AuthGuard] },
  { path: 'contact/edit/:id', component: ContactFormComponent, canActivate: [AuthGuard] },
  { path: 'contact/:id', component: ContactDetailComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

