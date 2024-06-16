import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/register/register.component';
import { WelcomePageComponent } from './component/welcome-page/welcome-page.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AdminComponent } from './component/admin/admin.component';
import { UserComponent } from './component/user/user.component';
import { TicketComponent } from './component/ticket/ticket.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ForgetPasswordComponent } from './component/forget-password/forget-password.component';
import { TicketPopupComponent } from './component/ticket-popup/ticket-popup.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        RegisterComponent,
        WelcomePageComponent,
        AdminComponent,
        UserComponent,
        TicketComponent,
        ForgetPasswordComponent,
        TicketPopupComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FormsModule,
        FontAwesomeModule,
        MatSnackBarModule,
        NgbModalModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
