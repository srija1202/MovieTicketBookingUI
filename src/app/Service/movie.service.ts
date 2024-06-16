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

  /**
   * Retrieves all movies from the server.
   * @returns Observable<Movie[]> with an array of movies.
   */
  loadMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.apiBaseUrl}/Movie/Retrieve/All`, { headers: this.getHeaders() });
  }

  /**
   * Retrieves a specific movie by its ID from the server.
   * @param _id ID of the movie to retrieve.
   * @returns Observable<Movie> with the retrieved movie.
   */
  getMovieById(_id: string): Observable<Movie> {
    return this.http.get<Movie>(`${environment.apiBaseUrl}/Movie/Retrieve/${_id}`, { headers: this.getHeaders() });
  }
  
  /**
   * Adds a new movie to the server.
   * @param movieData Movie object containing details of the movie to be added.
   * @returns Observable<ApiResponse> indicating success or failure of the operation.
   */
  addMovie(movieData: Movie): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/Movie/Add`, movieData, { headers: this.getHeaders() });
  }
}
