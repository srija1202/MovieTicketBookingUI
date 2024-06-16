import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../Models/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  /**
   * Sends a POST request to book tickets for a movie.
   * @param data Object containing booking details such as ticketsCount, movieId, and theaterId.
   * @returns Observable<ApiResponse> with booking response data.
   */
  bookTicket(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/Booking/Book`, data);
  }
}
