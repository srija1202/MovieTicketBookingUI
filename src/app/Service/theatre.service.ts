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

  /**
   * Retrieves all theatres from the server.
   * @returns Observable<Theatre[]> with an array of theatres.
   */
  getTheatre(): Observable<Theatre[]> {
    return this.http.get<Theatre[]>(`${environment.apiBaseUrl}/Theater/Get/All`, { headers: this.getHeaders() });
  }

  /**
   * Retrieves a specific theatre by its ID from the server.
   * @param _id ID of the theatre to retrieve.
   * @returns Observable<Theatre> with the retrieved theatre.
   */
  getTheatreById(_id: string): Observable<Theatre> {
    return this.http.get<Theatre>(`${environment.apiBaseUrl}/Theater/Get/${_id}`, { headers: this.getHeaders() });
  }

  /**
   * Adds a new theatre to the server.
   * @param theaterData Theatre object containing details of the theatre to be added.
   * @returns Observable<ApiResponse> indicating success or failure of the operation.
   */
  addTheatre(theaterData: Theatre): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/Theater/Add`, theaterData, { headers: this.getHeaders() }); 
  }

  /**
   * Books tickets for a movie in a specific theatre.
   * @param bookingPayload Object containing tickets count, movie ID, and theatre ID for booking.
   * @returns Observable<ApiResponse> indicating success or failure of the ticket booking.
   */
  bookTicket(bookingPayload: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/Booking/Book`, bookingPayload, { headers: this.getHeaders() });
  }
}
