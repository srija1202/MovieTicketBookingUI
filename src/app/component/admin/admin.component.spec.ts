import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminComponent } from './admin.component';
import { MovieService } from 'src/app/Service/movie.service';
import { TheatreService } from 'src/app/Service/theatre.service';
import { TimeoutService } from 'src/app/Service/timeout.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from 'src/app/Models/api-response';
import { Theatre } from 'src/app/Models/theatre';
import { Movie } from 'src/app/Models/movie';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let movieService: jasmine.SpyObj<MovieService>;
  let theatreService: jasmine.SpyObj<TheatreService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let timeoutService: jasmine.SpyObj<TimeoutService>;

  beforeEach(async () => {
    // Create spy objects for services
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['loadMovies', 'addMovie']);
    const theatreServiceSpy = jasmine.createSpyObj('TheatreService', ['getTheatre', 'addTheatre']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const timeoutServiceSpy = jasmine.createSpyObj('TimeoutService', ['resetTimer']);

    await TestBed.configureTestingModule({
      declarations: [ AdminComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: TheatreService, useValue: theatreServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: TimeoutService, useValue: timeoutServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;

    // Assign spy objects for further interaction
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    theatreService = TestBed.inject(TheatreService) as jasmine.SpyObj<TheatreService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    timeoutService = TestBed.inject(TimeoutService) as jasmine.SpyObj<TimeoutService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies successfully', () => {
    const mockMovies: Movie[] = [{
      id: '1', movieName: 'Movie 1',
      moviePoster: 'afs.jpg',
      genre: 'fsda',
      description: 'AFADS',
      languages: 'English',
      created: new Date(Date.now()),
      updated: new Date(Date.now())
    }];
    movieService.loadMovies.and.returnValue(of(mockMovies));

    component.loadMovies();

    expect(movieService.loadMovies).toHaveBeenCalled();
    expect(component.movies).toEqual(mockMovies);
    expect(snackBar.open).not.toHaveBeenCalled(); // Ensure snackbar is not called on success
  });

  it('should handle error while loading movies', () => {
    const errorMessage = 'Error loading movies';
    const errorResponse = new HttpErrorResponse({ error: { message: errorMessage }, status: 500 });
    movieService.loadMovies.and.returnValue(throwError(errorResponse));

    component.loadMovies();

    expect(movieService.loadMovies).toHaveBeenCalled();
    expect(component.movies).toEqual([]);
    expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  });

  it('should fetch theaters successfully', () => {
    const mockTheaters: Theatre[] = [{
      id: '1', theaterName: 'Theater 1', city: 'City',
      availableSeat: 0,
      created: new Date(Date.now()),
      updated: new Date(Date.now())
    }];
    theatreService.getTheatre.and.returnValue(of(mockTheaters));

    component.getTheatre();

    expect(theatreService.getTheatre).toHaveBeenCalled();
    expect(component.theaters).toEqual(mockTheaters);
    expect(snackBar.open).not.toHaveBeenCalled(); // Ensure snackbar is not called on success
  });

  it('should handle error while fetching theaters', () => {
    const errorMessage = 'Error fetching theaters';
    const errorResponse = new HttpErrorResponse({ error: { message: errorMessage }, status: 500 });
    theatreService.getTheatre.and.returnValue(throwError(errorResponse));

    component.getTheatre();

    expect(theatreService.getTheatre).toHaveBeenCalled();
    expect(component.theaters).toEqual([]);
    expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  });

  it('should add a movie successfully', fakeAsync(() => {
    const movieData = { movieName: 'Movie 1', moviePoster: 'poster.png', genre: 'Action', description: 'Description', languages: 'English' } as Movie;
    const mockResponse: ApiResponse = { isSuccess: true, message: 'Movie added successfully' };
    movieService.addMovie.and.returnValue(of(mockResponse));

    component.movieForm.setValue(movieData);
    component.onSubmitMovie();

    tick(); // Simulate passage of time until all pending asynchronous activities complete

    expect(movieService.addMovie).toHaveBeenCalledWith(movieData);
    expect(component.movieForm.valid).toBeTrue();
    expect(component.movieForm.value).toEqual({ movieName: '', moviePoster: '', genre: '', description: '', languages: '' });
    expect(snackBar.open).toHaveBeenCalledWith('Movie added successfully!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
    expect(component.movies.length).toBe(1); // Ensure movies are reloaded
  }));

  it('should handle error while adding a movie', fakeAsync(() => {
    const movieData = { movieName: 'Movie 1', moviePoster: 'poster.png', genre: 'Action', description: 'Description', languages: 'English' } as Movie;
    const errorMessage = 'Error adding movie';
    const errorResponse = new HttpErrorResponse({ error: { message: errorMessage }, status: 500 });
    movieService.addMovie.and.returnValue(throwError(errorResponse));

    component.movieForm.setValue(movieData);
    component.onSubmitMovie();

    tick(); // Simulate passage of time until all pending asynchronous activities complete

    expect(movieService.addMovie).toHaveBeenCalledWith(movieData);
    expect(component.movieForm.valid).toBeTrue(); // Form should remain valid
    expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
    expect(component.movies.length).toBe(0); // Movies should not be updated
  }));

  it('should add a theater successfully', fakeAsync(() => {
    const theaterData = { theaterName: 'Theater 1', city: 'City' } as Theatre;
    const mockResponse = { isSuccess: true, message: 'Theater added successfully' };
    theatreService.addTheatre.and.returnValue(of(mockResponse)); // Mock addTheatre method

    // Mock getTheatre method to return observable
    theatreService.getTheatre.and.returnValue(of([]));

    component.theaterForm.setValue(theaterData);
    component.onSubmitTheater();

    tick(); // Simulate passage of time until all pending asynchronous activities complete

    expect(theatreService.addTheatre).toHaveBeenCalledWith(theaterData);
    expect(component.theaterForm.valid).toBeTrue();
    expect(component.theaterForm.value).toEqual({ theaterName: 'Theater 1', city: 'City' });
    expect(snackBar.open).toHaveBeenCalledWith('Theater added successfully!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
    expect(component.theaters.length).toBe(1); // Ensure theaters are reloaded
  }));

  it('should handle error while adding a theater', fakeAsync(() => {
    const theaterData = { theaterName: 'Theater 1', city: 'City' } as Theatre;
    const errorMessage = 'Error adding theater';
    const errorResponse = new HttpErrorResponse({ error: { message: errorMessage }, status: 500 });
    theatreService.addTheatre.and.returnValue(throwError(errorResponse));

    component.theaterForm.setValue(theaterData);
    component.onSubmitTheater();

    tick(); // Simulate passage of time until all pending asynchronous activities complete

    expect(theatreService.addTheatre).toHaveBeenCalledWith(theaterData);
    expect(component.theaterForm.valid).toBeTrue(); // Form should remain valid
    expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
    expect(component.theaters.length).toBe(0); // Theaters should not be updated
  }));

  it('should reset session timeout', () => {
    component.resetTimeout();
    expect(timeoutService.resetTimer).toHaveBeenCalled();
  });

});
