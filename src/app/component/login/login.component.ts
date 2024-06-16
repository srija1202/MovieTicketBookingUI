import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from 'src/app/Models/api-response';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Initialize the login form with form controls and validation rules
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Handles the login process when the user submits the login form.
   * - Validates the form inputs.
   * - Calls AuthService.login() to authenticate the user.
   * - Handles success and error responses from the authentication service.
   */
  login() {
    this.submitted = true; // Mark the form as submitted

    if (this.loginForm.invalid) {
      return; // If the form is invalid, stop the login process
    }

    // Attempt login with the provided credentials
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: ApiResponse) => {
        if (response.isSuccess) {
          // If login is successful
          localStorage.setItem("accessToken", response.message); // Store the access token in localStorage
          this.loginForm.reset(); // Reset the login form
          this.submitted = false; // Reset the submission flag
          this.authService.loggedIn = true; // Set the logged-in status in AuthService
          this.authService.token = response.message; // Store the token in AuthService
          this.router.navigate(['/home']); // Navigate to the home page
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          }); // Show a success message
        } else {
          // If login fails
          this.snackBar.open('Login failed!', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          }); // Show an error message
        }
      },
      error: (err: HttpErrorResponse) => {
        // If an error occurs during the login API call
        this.snackBar.open(err.error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        }); // Show the error message from the server
        this.submitted = false; // Reset the submission flag
      },
    });
  }
}
