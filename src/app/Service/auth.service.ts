import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../Models/api-response';
import { jwtDecode, JwtDecodeOptions } from 'jwt-decode';
import { JwtPayload } from '../Models/jwt-payload';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = environment.apiBaseUrl;
  token: any = localStorage.getItem("accessToken");
  loggedIn: boolean = localStorage.getItem("accessToken") != null ? true : false;

  constructor(private http: HttpClient) { }

  login(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/Authentication/Login`, data);
  }

  logout() {
    localStorage.removeItem("accessToken");
    this.loggedIn = false;
    location.reload();
  }

  registerUser(isAdmin: boolean, user: User): Observable<any> {
    const params = new HttpParams().set('isAdmin', isAdmin.toString());
    return this.http.post<any>(`${this.baseUrl}/Customer/Register`, user, { params });
  }

  getUserRole() {
    if (this.token != null) {
      let decodedToken: JwtPayload = jwtDecode(this.token)
      return decodedToken.AccessLevel;
    }
    return null;
  }
}