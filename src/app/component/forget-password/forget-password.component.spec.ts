import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ForgetPasswordComponent } from './forget-password.component';
import { AuthService } from '../../Service/auth.service';
import { ApiResponse } from 'src/app/Models/api-response';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('ForgetPasswordComponent', () => {
  let component: ForgetPasswordComponent;
  let fixture: ComponentFixture<ForgetPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['updatePassword']);

    TestBed.configureTestingModule({
      declarations: [ ForgetPasswordComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  }));

  beforeEach(() => {
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with validators', () => {
    expect(component.resetPasswordForm).toBeDefined();
    expect(component.resetPasswordForm.controls['username']).toBeDefined();
    expect(component.resetPasswordForm.controls['oldPassword']).toBeDefined();
    expect(component.resetPasswordForm.controls['newPassword']).toBeDefined();
    expect(component.resetPasswordForm.controls['confirmPassword']).toBeDefined();
    expect(component.resetPasswordForm.validator).toBeTruthy();
  });

  it('should invalidate form when passwords do not match', () => {
    const newPasswordControl = component.resetPasswordForm.get('newPassword');
    const confirmPasswordControl = component.resetPasswordForm.get('confirmPassword');

    newPasswordControl?.setValue('newpassword');
    confirmPasswordControl?.setValue('differentpassword');

    expect(component.resetPasswordForm.valid).toBeFalse();
    expect(confirmPasswordControl?.hasError('mustMatch')).toBeTrue();
  });

  it('should validate form when passwords match', () => {
    const newPasswordControl = component.resetPasswordForm.get('newPassword');
    const confirmPasswordControl = component.resetPasswordForm.get('confirmPassword');

    newPasswordControl?.setValue('password');
    confirmPasswordControl?.setValue('password');

    expect(component.resetPasswordForm.valid).toBeFalse();
    expect(confirmPasswordControl?.hasError('mustMatch')).toBeFalse();
  });

  it('should call AuthService.updatePassword and navigate on successful password update', () => {
    const passwordData = {
      username: 'testuser',
      oldPassword: 'oldpass',
      newPassword: 'newpass',
      confirmPassword: 'newpass'
    };

    const mockResponse: ApiResponse = { isSuccess: true, message: 'Password updated successfully' };
    authService.updatePassword.and.returnValue(of(mockResponse));

    spyOn(component.router, 'navigate').and.stub();

    component.resetPasswordForm.setValue(passwordData);
    component.onSubmit();

    expect(authService.updatePassword).toHaveBeenCalledWith(passwordData);
    expect(component.submitted).toBeTrue();
    expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error from AuthService.updatePassword', () => {
    const passwordData = {
      username: 'testuser',
      oldPassword: 'oldpass',
      newPassword: 'newpass',
      confirmPassword: 'newpass'
    };

    const errorMessage = 'Error updating password';
    const errorResponse = new HttpErrorResponse({ error: { message: errorMessage }, status: 500 });
    authService.updatePassword.and.returnValue(throwError(errorResponse));

    spyOn(window, 'alert').and.stub();

    component.resetPasswordForm.setValue(passwordData);
    component.onSubmit();

    expect(authService.updatePassword).toHaveBeenCalledWith(passwordData);
    expect(component.submitted).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith(errorMessage);
  });
});
