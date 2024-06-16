import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from 'src/app/Models/api-response';
import { Movie } from 'src/app/Models/movie';
import { Theatre } from 'src/app/Models/theatre';
import { MovieService } from 'src/app/Service/movie.service'; // Create a service for movies
import { TheatreService } from 'src/app/Service/theatre.service'; // Create a service for theaters
import { TimeoutService } from 'src/app/Service/timeout.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  movieForm: FormGroup;
  theaterForm: FormGroup;
  movies: Movie[] = [];
  theaters: Theatre[] = [];

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private theaterService: TheatreService,
    public snackBar: MatSnackBar,
    private timeoutService: TimeoutService
  ) {
    // Initialize movieForm and theaterForm with validators
    this.movieForm = this.fb.group({
      movieName: ['', Validators.required],
      moviePoster: ['', Validators.required],
      genre: ['', Validators.required],
      description: ['', Validators.required],
      languages: ['', Validators.required]
    });

    this.theaterForm = this.fb.group({
      theaterName: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load initial data on component initialization
    this.loadMovies();
    this.getTheatre();
  }

  /**
   * Loads movies from the backend.
   */
  loadMovies(): void {
    this.movieService.loadMovies().subscribe({
      next: (response: Movie[]) => {
        this.movies = response;
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Fetches theaters from the backend.
   */
  getTheatre(): void {
    this.theaterService.getTheatre().subscribe({
      next: (res: Theatre[]) => {
        this.theaters = res;
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Handles form submission for adding a movie.
   * If the form is valid, sends movie data to the backend.
   */
  onSubmitMovie(): void {
    if (this.movieForm.valid) {
      const movieData = this.movieForm.value;
      this.movieService.addMovie(movieData)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.isSuccess) {
              this.movieForm.reset();
              this.snackBar.open('Movie added successfully!', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.loadMovies(); // Reload movies after successful addition
            } else {
              this.snackBar.open('Failed to add movie', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
            }
          },
          error: (err: HttpErrorResponse) => {
            this.snackBar.open(err.error.message, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.movieForm.markAllAsTouched();
    }
  }

  /**
   * Handles form submission for adding a theater.
   * If the form is valid, sends theater data to the backend.
   */
  onSubmitTheater(): void {
    if (this.theaterForm.valid) {
      const theaterData = this.theaterForm.value;
      this.theaterService.addTheatre(theaterData)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.isSuccess) {
              this.theaterForm.reset();
              this.snackBar.open('Theater added successfully!', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.getTheatre(); // Reload theaters after successful addition
            } else {
              this.snackBar.open('Failed to add theater', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
            }
          },
          error: (err: HttpErrorResponse) => {
            this.snackBar.open(err.error.message, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.theaterForm.markAllAsTouched();
    }
  }

  /**
   * Cleans up event listeners when the component is destroyed.
   */
  ngOnDestroy(): void {
    // Clean up event listeners
    window.removeEventListener('mousemove', () => this.resetTimeout());
    window.removeEventListener('keydown', () => this.resetTimeout());
  }

  /**
   * Resets the session timeout.
   */
  resetTimeout(): void {
    this.timeoutService.resetTimer();
  }
}
