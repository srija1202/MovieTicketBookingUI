import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../Models/movie';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../Models/api-response';
import { AuthService } from './auth.service'; // Import AuthService to access the token

@Injectable({
  providedIn: 'root'
})
export class MovieService {

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

  loadMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.apiBaseUrl}/Movie/Retrieve/All`, { headers: this.getHeaders() }); // Pass headers with the request
  }

  getMovieById(_id: string): Observable<Movie> {
    return this.http.get<Movie>(`${environment.apiBaseUrl}/Movie/Retrieve/${_id}`, { headers: this.getHeaders() }); // Pass headers with the request
  }
  
  addMovie(movieData: Movie): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/Movie/Add`, movieData, { headers: this.getHeaders() }); // Pass headers with the request
  }
}
