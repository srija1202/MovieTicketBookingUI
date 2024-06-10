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

  onTheaterChange(): void {
    // Implement logic when theater selection changes
    // For example, you can fetch additional information about the selected theater
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
    // Implement logic to book the ticket
    console.log('Ticket booked for movie:', this.selectedMovie, 'at theater:', this.selectedTheater, 'with ticket count:', this.ticketCount);
    // You can add further logic here, such as sending a request to a backend API to book the ticket
  }
}
