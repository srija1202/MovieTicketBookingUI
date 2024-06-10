import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/Models/api-response';
import { Movie } from 'src/app/Models/movie';
import { Theatre } from 'src/app/Models/theatre';
import { MovieService } from 'src/app/Service/movie.service'; // Create a service for movies
import { TheatreService } from 'src/app/Service/theatre.service'; // Create a service for theaters

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  movieForm: FormGroup;
  theaterForm: FormGroup;
  movies: Movie[] = [];
  theaters: Theatre[] = []; // Add theaters array
  isAddingMovie: boolean = false; // Flag for movie addition loading state
  isAddingTheater: boolean = false; // Flag for theater addition loading state


  constructor(private fb: FormBuilder, private movieService: MovieService, private theaterService : TheatreService) {
    this.movieForm = this.fb.group({
      movieName: [''],
      moviePoster: [''],
      genre: [''],
      description: [''],
      languages: ['']
    });
    this.theaterForm = this.fb.group({
      theaterName: [''],
      city: ['']
    });
  }

  ngOnInit() {
    this.loadMovies();
    this.getTheatre();
  }

  loadMovies(): void {
    this.movieService.loadMovies().subscribe({
      next: (response: Movie[]) => {
        this.movies = response;
        console.log(this.movies);
        this.isAddingMovie = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isAddingMovie = false;
      }
    })
  }

  getTheatre(): void {
    this.theaterService.getTheatre().subscribe({
      next: (res: Theatre[]) => {
        this.theaters = res;
        console.log(this.theaters)
        this.isAddingTheater = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isAddingTheater = false;
      }
    });
  }

  onSubmitMovie() {
    this.isAddingMovie = true; // Show loader
    const movieData = this.movieForm.value;
    this.movieService.addMovie(movieData)
      .subscribe({
        next: (response : ApiResponse) => {
          if(response.isSuccess)
            {
              this.movieForm.reset();
              this.isAddingMovie = false;
            }
            else {
              alert(response.message);
            }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error adding movie:', err);
          this.isAddingMovie = false; // Hide loader
        }
      });
  }

  onSubmitTheater() {
    this.isAddingTheater = true; // Show loader
    const theaterData = this.theaterForm.value;
    this.theaterService.addTheatre(theaterData)
    .subscribe({
      next: (response : ApiResponse) => {
        if(response.isSuccess)
          {
            this.theaterForm.reset();
            this.isAddingTheater = false;
          }
          else {
            alert(response.message);
          }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error adding movie:', err);
        this.isAddingTheater = false; // Hide loader
      }
    });
  }
}
