import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TheatreService } from './theatre.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Theatre } from '../Models/theatre';
import { ApiResponse } from '../Models/api-response';

describe('TheatreService', () => {
  let service: TheatreService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['token']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TheatreService,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(TheatreService);
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

  it('should retrieve all theatres', () => {
    const mockTheatres: Theatre[] = [
      { id: '1', theaterName: 'Theatre 1', city: 'City 1', availableSeat: 100, created: new Date(), updated: new Date() },
      { id: '2', theaterName: 'Theatre 2', city: 'City 2', availableSeat: 200, created: new Date(), updated: new Date() }
    ];

    service.getTheatre().subscribe((theatres) => {
      expect(theatres).toEqual(mockTheatres);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Theater/Get/All`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer dummy-token');
    req.flush(mockTheatres);
  });

  it('should retrieve a theatre by id', () => {
    const mockTheatre: Theatre = { id: '1', theaterName: 'Theatre 1', city: 'City 1', availableSeat: 100, created: new Date(), updated: new Date() };

    service.getTheatreById('1').subscribe((theatre) => {
      expect(theatre).toEqual(mockTheatre);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Theater/Get/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer dummy-token');
    req.flush(mockTheatre);
  });

  it('should add a new theatre', () => {
    const newTheatre: Theatre = { id: '3', theaterName: 'Theatre 3', city: 'City 3', availableSeat: 300, created: new Date(), updated: new Date() };
    const mockResponse: ApiResponse = { isSuccess: true, message: 'Theatre added successfully' };

    service.addTheatre(newTheatre).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Theater/Add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer dummy-token');
    expect(req.request.body).toEqual(newTheatre);
    req.flush(mockResponse);
  });

  it('should book tickets for a movie', () => {
    const bookingPayload = { ticketsCount: 2, movieId: '1', theatreId: '1' };
    const mockResponse: ApiResponse = { isSuccess: true, message: 'Tickets booked successfully' };

    service.bookTicket(bookingPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Booking/Book`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer dummy-token');
    expect(req.request.body).toEqual(bookingPayload);
    req.flush(mockResponse);
  });
});
