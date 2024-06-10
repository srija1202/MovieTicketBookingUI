import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  user : User | undefined;
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }
  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      contactNumber: ['', Validators.required],
      isAdmin: [false]
    });
  }
  
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    if (this.signupForm.valid) {
      this.user = {
        FirstName: this.signupForm.get('firstName')?.value,
        LastName: this.signupForm.get('lastName')?.value,
        EmailAddress: this.signupForm.get('emailAddress')?.value,
        Username: this.signupForm.get('username')?.value,
        Password: this.signupForm.get('password')?.value,
        ContactNumber: this.signupForm.get('contactNumber')?.value,
        IsAdmin: this.signupForm.get('isAdmin')?.value
      } as unknown as User;
      const IsAdmin = this.signupForm.get('isAdmin')?.value;

      this.authService.registerUser(IsAdmin, this.user).subscribe({
        next: (response: ApiResponse) => {
          if (response.isSuccess) {
            console.log('User registered successfully', response);
            this.signupForm.reset();
            this.submitted = false;
            this.router.navigate(['/home']);
          } else {
            alert(response.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.submitted = false;
          console.error('Error registering user', err);
          alert(err.error.message);
        }
      });
    }
  }
}