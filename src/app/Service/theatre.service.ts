import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Theatre } from '../Models/theatre';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../Models/api-response';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TheatreService {

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) { }

  // Helper method to get headers with authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.token; // Retrieve token from AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Include token in the headers
    });
  }

  getTheatre(): Observable<Theatre[]> {
    return this.http.get<Theatre[]>(`${environment.apiBaseUrl}/Theater/Get/All`, { headers: this.getHeaders() });
  }
  getTheatreById(_id: string): Observable<Theatre> {
    return this.http.get<Theatre>(`${environment.apiBaseUrl}/Theater/Get/${_id}`, { headers: this.getHeaders() });
  }

  addTheatre(theaterData: Theatre): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/Theater/Add`, theaterData, { headers: this.getHeaders() }); 
  }

  bookTicket(bookingPayload: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/Booking/Book`, bookingPayload, { headers: this.getHeaders() });
  }
}
