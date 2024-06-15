import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ticket } from '../Models/ticket';
import { AuthService } from './auth.service';
import { ApiResponse } from '../Models/api-response';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient, private authService: AuthService) { }


  // Helper method to get headers with authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.token; // Retrieve token from AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Include token in the headers
    });
  }
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${environment.apiBaseUrl}/Booking/All`, { headers: this.getHeaders() })
  }

  updateTicket(updatePayload: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.apiBaseUrl}/Booking/Update`, updatePayload, { headers: this.getHeaders() });
  }
}
