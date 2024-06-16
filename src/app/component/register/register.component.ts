import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from 'src/app/Models/api-response';
import { User } from 'src/app/Models/user';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  signupForm!: FormGroup;
  submitted = false;
  user: User | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Initialize the signup form with form controls and validation rules
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      contactNumber: ['', Validators.required],
      isAdmin: [false] // Optional field for admin status, default to false
    });
  }

  // Getter to easily access form controls in the template
  get f() { return this.signupForm.controls; }

  /**
   * Handles the submission of the signup form to register a new user.
   * - Validates the form inputs.
   * - Constructs a User object from the form values.
   * - Calls AuthService.registerUser() to attempt user registration.
   * - Handles success and error responses from the registration service.
   */
  onSubmit() {
    this.submitted = true; // Mark the form as submitted

    if (this.signupForm.invalid) {
      return; // If the form is invalid, stop the registration process
    }

    // Construct User object from form values
    this.user = {
      FirstName: this.signupForm.get('firstName')?.value,
      LastName: this.signupForm.get('lastName')?.value,
      EmailAddress: this.signupForm.get('emailAddress')?.value,
      Username: this.signupForm.get('username')?.value,
      Password: this.signupForm.get('password')?.value,
      ContactNumber: this.signupForm.get('contactNumber')?.value,
      IsAdmin: this.signupForm.get('isAdmin')?.value // Optional admin status
    } as unknown as User;

    // Extract IsAdmin status from form (optional)
    const IsAdmin = this.signupForm.get('isAdmin')?.value;

    // Attempt user registration
    this.authService.registerUser(IsAdmin, this.user).subscribe({
      next: (response: ApiResponse) => {
        if (response.isSuccess) {
          // If registration is successful
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          }); // Show a success message
          this.signupForm.reset(); // Reset the signup form
          this.submitted = false; // Reset the submission flag
          this.router.navigate(['/home']); // Navigate to the home page
        } else {
          // If registration fails
          this.snackBar.open('Registration failed!', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          }); // Show an error message
        }
      },
      error: (err: HttpErrorResponse) => {
        // If an error occurs during registration
        this.snackBar.open(err.error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        }); // Show the error message from the server
        this.submitted = false; // Reset the submission flag
      }
    });
  }
}
