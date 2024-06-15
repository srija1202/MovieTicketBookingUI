import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './Guard/auth.guard';
import { WelcomePageComponent } from './component/welcome-page/welcome-page.component';
import { AdminComponent } from './component/admin/admin.component'; // Import AdminComponent for admin route
import { TicketComponent } from './component/ticket/ticket.component';
import { ForgetPasswordComponent } from './component/forget-password/forget-password.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard] // Protect home route with AuthGuard
  },
  {
    path: 'admin', // Add admin route
    component: AdminComponent,
    canActivate: [AuthGuard] // Protect admin route with AuthGuard
  },
  { 
    path: 'ticket/:id',
    component: TicketComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'ticket/:userId',
    component: TicketComponent,
    canActivate: [AuthGuard]
  },
  {
    path : 'forget-password',
    component : ForgetPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
