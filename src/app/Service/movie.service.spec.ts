import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Movie } from '../Models/movie';
import { ApiResponse } from '../Models/api-response';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['token']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MovieService,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.token = 'dummy-token'; // Set a dummy token for testing
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all movies', () => {
    const mockMovies: Movie[] = [
      { id: '1', movieName: 'Movie 1', moviePoster: 'poster1.jpg', genre: 'Action', description: 'Description 1', languages: 'English', created: new Date(), updated: new Date() },
      { id: '2', movieName: 'Movie 2', moviePoster: 'poster2.jpg', genre: 'Comedy', description: 'Description 2', languages: 'Spanish', created: new Date(), updated: new Date() }
    ];

    service.loadMovies().subscribe((movies) => {
      expect(movies).toEqual(mockMovies);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Movie/Retrieve/All`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer dummy-token');
    req.flush(mockMovies);
  });

  it('should retrieve a movie by id', () => {
    const mockMovie: Movie = { id: '1', movieName: 'Movie 1', moviePoster: 'poster1.jpg', genre: 'Action', description: 'Description 1', languages: 'English', created: new Date(), updated: new Date() };

    service.getMovieById('1').subscribe((movie) => {
      expect(movie).toEqual(mockMovie);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Movie/Retrieve/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer dummy-token');
    req.flush(mockMovie);
  });

  it('should add a new movie', () => {
    const newMovie: Movie = { id: '3', movieName: 'Movie 3', moviePoster: 'poster3.jpg', genre: 'Drama', description: 'Description 3', languages: 'French', created: new Date(), updated: new Date() };
    const mockResponse: ApiResponse = { isSuccess: true, message: 'Movie added successfully' };

    service.addMovie(newMovie).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Movie/Add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer dummy-token');
    expect(req.request.body).toEqual(newMovie);
    req.flush(mockResponse);
  });
});
