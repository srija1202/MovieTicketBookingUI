import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/Service/auth.service';
import { ApiResponse } from 'src/app/Models/api-response';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    component.ngOnInit();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['username']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should mark form as submitted and invalid when form is invalid', () => {
    component.ngOnInit();
    component.loginForm.controls['username'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.login();
    expect(component.submitted).toBeTrue();
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should login successfully', () => {
    const mockResponse: ApiResponse = { isSuccess: true, message: 'token' };
    authService.login.and.returnValue(of(mockResponse));

    component.ngOnInit();
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('testpassword');
    component.login();

    expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'testpassword' });
    expect(localStorage.getItem('accessToken')).toBe('token');
    expect(component.authService.loggedIn).toBeTrue();
    expect(component.authService.token).toBe('token');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(snackBar.open).toHaveBeenCalledWith('Login successful!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  });

  it('should handle login failure', () => {
    const mockResponse: ApiResponse = { isSuccess: false, message: 'Login failed' };
    authService.login.and.returnValue(of(mockResponse));

    component.ngOnInit();
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('testpassword');
    component.login();

    expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'testpassword' });
    expect(snackBar.open).toHaveBeenCalledWith('Login failed!', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  });

  it('should handle login error', () => {
    const errorResponse = new HttpErrorResponse({ error: { message: 'Error occurred' } });
    authService.login.and.returnValue(throwError(() => errorResponse));

    component.ngOnInit();
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('testpassword');
    component.login();

    expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'testpassword' });
    expect(snackBar.open).toHaveBeenCalledWith('Error occurred', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
    expect(component.submitted).toBeFalse();
  });
});
