import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from 'src/app/Models/movie';
import { MovieService } from 'src/app/Service/movie.service';
import { TimeoutService } from 'src/app/Service/timeout.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  movies: Movie[] = [];

  constructor(
    private movieService: MovieService,
    private router: Router,
    private timeoutService: TimeoutService
  ) {}

  ngOnInit(): void {
    // Load movies when the component initializes
    this.movieService.loadMovies().subscribe(movies => {
      this.movies = movies;
    });
  }

  /**
   * Navigates to the ticket component with the specified movie ID as a route parameter.
   * @param movieId The ID of the selected movie.
   */
  bookTicket(movieId: string) {
    this.router.navigate(['/ticket', movieId]);
  }

  /**
   * Cleans up event listeners to prevent memory leaks when the component is destroyed.
   */
  ngOnDestroy() {
    window.removeEventListener('mousemove', () => this.resetTimeout());
    window.removeEventListener('keydown', () => this.resetTimeout());
  }

  /**
   * Resets the user timeout by invoking the resetTimer() method from TimeoutService.
   */
  resetTimeout(): void {
    this.timeoutService.resetTimer();
  }
}
