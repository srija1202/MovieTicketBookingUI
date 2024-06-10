import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    this.submitted = true;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: ApiResponse) => {
          if (response.isSuccess) {
            localStorage.setItem("accessToken", response.message);
            this.loginForm.reset();
            this.submitted = false;
            this.authService.loggedIn = true;
            this.authService.token = response.message;
            this.router.navigate(['/home']);
          }
          else {
            alert(response.message)
          }
        },
        error: (err: HttpErrorResponse) => {
          this.submitted = false;
          console.log(err);
          alert(err.error.message)
        },
      });
    } else {
      this.submitted = false;
    }
  }
}
