import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { ApiResponse } from 'src/app/Models/api-response';
import { HttpErrorResponse } from '@angular/common/http';
import { password } from 'src/app/Models/update-password';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form with validators for username, oldPassword, newPassword, and confirmPassword
    this.resetPasswordForm = this.formBuilder.group({
      username: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.mustMatch('newPassword', 'confirmPassword') });
  }

  /**
   * Custom validator function to ensure newPassword and confirmPassword fields match.
   * @param controlName The name of the newPassword form control.
   * @param matchingControlName The name of the confirmPassword form control.
   * @returns Validator function for newPassword and confirmPassword match.
   */
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  /**
   * Getter for easy access to form control fields.
   * Helps in accessing form controls in the template.
   * @returns Object containing form control fields.
   */
  get formControls() {
    return this.resetPasswordForm.controls;
  }

  /**
   * Handles form submission for updating the password.
   * Submits the form data to AuthService for password update.
   * Navigates to login page upon successful password update.
   * Displays error message if password update fails.
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    const passwordData = this.resetPasswordForm.value as password;

    this.authService.updatePassword(passwordData).subscribe({
      next: (response: ApiResponse) => {
        if (response.isSuccess) {
          console.log('Password updated successfully', response);
          this.router.navigate(['/login']);
        } else {
          alert(response.message); // Display alert with error message from response
        }
      },
      error: (err: HttpErrorResponse) => {
        this.submitted = false;
        console.error('Error while updating password', err);
        alert(err.error.message); // Display alert with error message from HTTP response
      }
    });
  }
}
