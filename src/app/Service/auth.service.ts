import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../Models/api-response';
import { jwtDecode, JwtDecodeOptions } from 'jwt-decode';
import { JwtPayload } from '../Models/jwt-payload';
import { User } from '../Models/user';
import { password } from '../Models/update-password';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = environment.apiBaseUrl;
  token: any = localStorage.getItem("accessToken");
  loggedIn: boolean = localStorage.getItem("accessToken") != null ? true : false;

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Helper method to retrieve HTTP headers with authorization token.
   * @returns HttpHeaders object with 'Content-Type' and 'Authorization' headers.
   */
  private getHeaders(): HttpHeaders {
    const token = this.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Include token in the headers
    });
  }

  /**
   * Sends a POST request to authenticate user login.
   * @param data Object containing username and password for login.
   * @returns Observable ApiResponse with login response data.
   */
  login(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/Authentication/Login`, data);
  }

  /**
   * Sends a PATCH request to update user password.
   * @param data Object containing oldPassword, newPassword, and confirmPassword.
   * @returns Observable ApiResponse with password update response data.
   */
  updatePassword(data: password): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.baseUrl}/Customer/update/password`, data, { headers: this.getHeaders() });
  }

  /**
   * Logs out the user by removing access token from localStorage and navigating to the home page.
   */
  logout(): void {
    localStorage.removeItem("accessToken");
    this.loggedIn = false;
    this.router.navigate(['']);
  }

  /**
   * Registers a new user with optional admin privilege.
   * @param isAdmin Boolean flag indicating if the user should have admin rights.
   * @param user Object containing user details for registration.
   * @returns Observable<any> representing the registration response.
   */
  registerUser(isAdmin: boolean, user: User): Observable<any> {
    const params = new HttpParams().set('isAdmin', isAdmin.toString());
    return this.http.post<any>(`${this.baseUrl}/Customer/Register`, user, { params });
  }

  /**
   * Retrieves the access level (role) of the logged-in user from the JWT token.
   * @returns String representing the access level of the user.
   *          Returns null if no token is found.
   */
  getUserRole(): string | null {
    if (this.token != null) {
      let decodedToken: JwtPayload = jwtDecode(this.token);
      return decodedToken.AccessLevel;
    }
    return null;
  }
}
