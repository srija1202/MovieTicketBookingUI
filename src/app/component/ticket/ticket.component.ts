import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Movie } from 'src/app/Models/movie';
import { Theatre } from 'src/app/Models/theatre';
import { MovieService } from 'src/app/Service/movie.service';
import { TheatreService } from 'src/app/Service/theatre.service';
import { TimeoutService } from 'src/app/Service/timeout.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit, OnDestroy {
  selectedMovie: Movie | undefined;
  theaters: Theatre[] = [];
  selectedTheater: string | undefined;
  ticketCount: number = 1;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private theatreService: TheatreService,
    private snackBar: MatSnackBar,
    private timeoutService: TimeoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetches the selected movie details and available theaters when component initializes
    const movieId = this.route.snapshot.paramMap.get('id') || '';
    this.movieService.getMovieById(movieId).subscribe(movie => {
      this.selectedMovie = movie;
    });
    this.theatreService.getTheatre().subscribe(theaters => {
      this.theaters = theaters;
    });
    // Sets up event listeners to reset timeout on user activity
    window.addEventListener('mousemove', () => this.resetTimeout());
    window.addEventListener('keydown', () => this.resetTimeout());
  }

  ngOnDestroy(): void {
    // Cleans up event listeners to prevent memory leaks when component is destroyed
    window.removeEventListener('mousemove', () => this.resetTimeout());
    window.removeEventListener('keydown', () => this.resetTimeout());
  }

  /**
   * Resets the user timeout by invoking the timeout service.
   */
  resetTimeout(): void {
    this.timeoutService.resetTimer();
  }

  /**
   * Increments the ticket count for booking.
   */
  incrementTicketCount(): void {
    this.ticketCount++;
  }

  /**
   * Decrements the ticket count for booking, ensuring it doesn't go below 1.
   */
  decrementTicketCount(): void {
    if (this.ticketCount > 1) {
      this.ticketCount--;
    }
  }

  /**
   * Checks if the current ticket booking details are valid.
   * Valid if a theater is selected and ticket count is greater than 0.
   * @returns True if ticket booking is valid, otherwise false.
   */
  isTicketBookingValid(): boolean {
    return !!this.selectedTheater && this.ticketCount > 0;
  }

  /**
   * Attempts to book tickets for the selected movie and theater.
   * Displays success or error messages based on the booking result.
   */
  bookTicket(): void {
    if (this.isTicketBookingValid()) {
      const bookingPayload = {
        ticketsCount: this.ticketCount,
        movieId: this.selectedMovie?.id,
        theaterId: this.selectedTheater,
      };

      this.theatreService.bookTicket(bookingPayload).subscribe({
        next: (response) => {
          this.snackBar.open('Ticket booked successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/home']); // Navigate to home after successful booking
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open(err.error.message || 'Failed to book ticket', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('Please select a theater and ensure ticket count is valid.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
