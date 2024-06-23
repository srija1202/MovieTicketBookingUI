import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { TicketComponent } from './ticket.component';
import { MovieService } from 'src/app/Service/movie.service';
import { TheatreService } from 'src/app/Service/theatre.service';
import { TimeoutService } from 'src/app/Service/timeout.service';
import { Movie } from 'src/app/Models/movie';
import { Theatre } from 'src/app/Models/theatre';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from 'src/app/Models/api-response';

describe('TicketComponent', () => {
  let component: TicketComponent;
  let fixture: ComponentFixture<TicketComponent>;
  let movieService: jasmine.SpyObj<MovieService>;
  let theatreService: jasmine.SpyObj<TheatreService>;
  let timeoutService: jasmine.SpyObj<TimeoutService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['getMovieById']);
    const theatreServiceSpy = jasmine.createSpyObj('TheatreService', ['getTheatre', 'bookTicket']);
    const timeoutServiceSpy = jasmine.createSpyObj('TimeoutService', ['resetTimer']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [TicketComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: TheatreService, useValue: theatreServiceSpy },
        { provide: TimeoutService, useValue: timeoutServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    theatreService = TestBed.inject(TheatreService) as jasmine.SpyObj<TheatreService>;
    timeoutService = TestBed.inject(TimeoutService) as jasmine.SpyObj<TimeoutService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    // Mocking movie data
    const movie: Movie = { id: '1', movieName: 'Test Movie', moviePoster: 'test.jpg', genre: 'Action', description: 'Test Description', languages: 'English', created : new Date(Date.now()),updated : new Date(Date.now()) };
    movieService.getMovieById.and.returnValue(of(movie));

    // Mocking theater data
    const theaters: Theatre[] = [{
      id: '1', theaterName: 'Test Theatre', city: 'Test City',
      availableSeat: 0,
      created: new Date(Date.now()),
      updated: new Date(Date.now())
    }];
    theatreService.getTheatre.and.returnValue(of(theaters));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selected movie and theaters', () => {
    fixture.detectChanges();
    expect(component.selectedMovie).toEqual(jasmine.objectContaining({ id: '1' }));
    expect(component.theaters.length).toBeGreaterThan(0);
  });

  it('should reset timeout on user activity', () => {
    spyOn(component, 'resetTimeout').and.callThrough();

    // Trigger user activity
    window.dispatchEvent(new Event('mousemove'));
    window.dispatchEvent(new Event('keydown'));

    expect(component.resetTimeout).toHaveBeenCalledTimes(2);
    expect(timeoutService.resetTimer).toHaveBeenCalled();
  });

  it('should increment and decrement ticket count', () => {
    component.incrementTicketCount();
    expect(component.ticketCount).toBe(2);

    component.decrementTicketCount();
    expect(component.ticketCount).toBe(1);

    component.decrementTicketCount();
    expect(component.ticketCount).toBe(1); // Ticket count should not go below 1
  });

  it('should validate ticket booking', () => {
    component.selectedTheater = '1';
    expect(component.isTicketBookingValid()).toBeTrue();

    component.selectedTheater = undefined;
    expect(component.isTicketBookingValid()).toBeFalse();
  });

  it('should book ticket successfully', () => {
    const ApiResponse = {isSuccess : true } as ApiResponse
    component.selectedTheater = '1';
    component.selectedMovie = { id: '1', movieName: 'Test Movie', moviePoster: 'test.jpg', genre: 'Action', description: 'Test Description', languages: 'English', created : new Date(Date.now()),updated : new Date(Date.now()) };
    theatreService.bookTicket.and.returnValue(of(ApiResponse));

    component.bookTicket();

    expect(theatreService.bookTicket).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Ticket booked successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle ticket booking failure', () => {
    component.selectedTheater = '1';
    component.selectedMovie = { id: '1', movieName: 'Test Movie', moviePoster: 'test.jpg', genre: 'Action', description: 'Test Description', languages: 'English', created : new Date(Date.now()),updated : new Date(Date.now()) };
    const errorResponse = new HttpErrorResponse({ error: { message: 'Booking failed' } });
    theatreService.bookTicket.and.returnValue(throwError(() => errorResponse));

    component.bookTicket();

    expect(theatreService.bookTicket).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Booking failed', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  });

  it('should show validation error if ticket booking details are invalid', () => {
    component.selectedTheater = undefined;
    component.bookTicket();

    expect(snackBar.open).toHaveBeenCalledWith('Please select a theater and ensure ticket count is valid.', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  });
});
