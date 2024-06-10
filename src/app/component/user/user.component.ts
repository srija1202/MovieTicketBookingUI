import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router from Angular core
import { Movie } from 'src/app/Models/movie';
import { MovieService } from 'src/app/Service/movie.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService, private router: Router) { }

  ngOnInit(): void {
    this.movieService.loadMovies().subscribe(movies => {
      this.movies = movies;
    });
  }

  bookTicket(movieId: string) {
    // Navigate to ticket component with movie ID as a parameter
    this.router.navigate(['/ticket', movieId]);
  }
}
