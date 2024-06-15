// forget-password.component.ts
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      username: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.mustMatch('newPassword', 'confirmPassword') });
  }

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

  get formControls() {
    return this.resetPasswordForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }
    const passwordData = this.resetPasswordForm.value as password;
    this.authService.updatePassword(passwordData).subscribe({
      next: (response: ApiResponse) => {
        if(response.isSuccess) {
          console.log('Password updated successfully', response);
          this.router.navigate(['/login']);
        }
        else {
          alert(response.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.submitted = false;
        console.error('Error while updating password', err);
        alert(err.error.message);
      }
    });
  }
}
