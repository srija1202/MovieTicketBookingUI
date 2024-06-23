import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../Models/api-response';
import { User } from '../Models/user';
import { password } from '../Models/update-password';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login the user', () => {
    const mockResponse: ApiResponse = { isSuccess: true, message: 'dummy-token' };
    const loginData = { username: 'testuser', password: 'password' };

    service.login(loginData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Authentication/Login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update the user password', () => {
    const mockResponse: ApiResponse = {  isSuccess: true, message: 'dummy-token' };
    const passwordData: password = { username : 'ABC',oldPassword: 'oldPass', newPassword: 'newPass', confirmPassword: 'newPass' };

    service.updatePassword(passwordData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Customer/update/password`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

  it('should logout the user', () => {
    spyOn(localStorage, 'removeItem');
    spyOn(service['router'], 'navigate');

    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
    expect(service.loggedIn).toBe(false);
    expect(service['router'].navigate).toHaveBeenCalledWith(['']);
  });

  it('should register a new user', () => {
    const mockResponse = { success: true };
    const newUser: User = {
      Username: 'newuser', Password: 'password', FirstName: 'ABC', LastName: 'DEF', EmailAddress: 'test@gmail.com',
      id: '4253',
      ContactNumber: '4243489527',
      IsAdmin: true,
      Created: new Date(Date.now()),
      Updated: new Date(Date.now())
    };

    service.registerUser(true, newUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Customer/Register?isAdmin=true`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get user role from token', () => {
    const mockToken = 'dummy-token';
    const mockPayload = { AccessLevel: 'admin' };
    localStorage.setItem('accessToken', mockToken);
    spyOn(service, 'token').and.returnValue(mockToken);
    spyOn(service, 'getUserRole').and.callFake(() => mockPayload.AccessLevel);

    const role = service.getUserRole();
    expect(role).toBe('admin');
  });

  it('should return null if no token is found', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const role = service.getUserRole();
    expect(role).toBeNull();
  });  
});
