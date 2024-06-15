import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from 'src/app/Models/movie';
import { Theatre } from 'src/app/Models/theatre';
import { MovieService } from 'src/app/Service/movie.service';
import { TheatreService } from 'src/app/Service/theatre.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  selectedMovie: Movie | undefined;
  theaters: Theatre[] = [];
  selectedTheater: string | undefined;
  ticketCount: number = 1;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private theatreService: TheatreService
  ) { }

  ngOnInit(): void {
    // Get the movie ID from the route parameter
    const movieId = this.route.snapshot.paramMap.get('id') || '';
    // Fetch the movie details
    this.movieService.getMovieById(movieId).subscribe(movie => {
      this.selectedMovie = movie;
    });
    // Fetch the theater details
    this.theatreService.getTheatre().subscribe(theaters => {
      this.theaters = theaters;
    });
  }

  incrementTicketCount(): void {
    // Increment ticket count
    this.ticketCount++;
  }

  decrementTicketCount(): void {
    // Decrement ticket count, ensuring it doesn't go below 1
    if (this.ticketCount > 1) {
      this.ticketCount--;
    }
  }

  isTicketBookingValid(): boolean {
    // Implement logic to determine if ticket booking is valid
    // For example, check if a theater is selected and ticket count is not zero
    return !!this.selectedTheater && this.ticketCount > 0;
  }

  bookTicket(): void {
    if (this.isTicketBookingValid()) {
      const bookingPayload = {
        ticketsCount: this.ticketCount,
        movieId: this.selectedMovie?.id,
        theaterId: this.selectedTheater,
      };
  
      this.theatreService.bookTicket(bookingPayload).subscribe({
        next: (response) => {
          console.log('Booking successful:', response);
          // Add any additional logic or user feedback here
        },
        error: (err: HttpErrorResponse) => {
          console.error('Booking failed:', err);
          // Handle the error, e.g., show an error message to the user
        }
      });
    } else {
      console.log('Invalid booking attempt');
      // Optionally, show a validation error message to the user
    }
  }
  
}
