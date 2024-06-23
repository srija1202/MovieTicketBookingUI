import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketService } from './ticket.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Ticket } from '../Models/ticket';
import { ApiResponse } from '../Models/api-response';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['token']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TicketService,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(TicketService);
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

  it('should retrieve all tickets', () => {
    const mockTickets: Ticket[] = [
      {
        ticketId: '1',
        totalCount: 2,
        theatreId: '1',
        theater: { id: '1', theaterName: 'Theatre 1', city: 'City 1', availableSeat: 100, created: new Date(), updated: new Date() },
        movieId: '1',
        movie: { id: '1', movieName: 'Movie 1', moviePoster: 'poster1.jpg', genre: 'Action', description: 'Description 1', languages: 'English', created: new Date(), updated: new Date() },
        userId: '1',
        user: { id: '1', FirstName: 'John', LastName: 'Doe', EmailAddress: 'john.doe@example.com', Username: 'john.doe', ContactNumber: '1234567890', Password: 'password', IsAdmin: false, Created: new Date(), Updated: new Date() }
      }
    ];

    service.getTickets().subscribe((tickets) => {
      expect(tickets).toEqual(mockTickets);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Booking/All`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer dummy-token');
    req.flush(mockTickets);
  });

  it('should update a ticket', () => {
    const updatePayload = { ticketId: '1', totalCount: 3 };
    const mockResponse: ApiResponse = { isSuccess: true, message: 'Ticket updated successfully' };

    service.updateTicket(updatePayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Booking/Update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer dummy-token');
    expect(req.request.body).toEqual(updatePayload);
    req.flush(mockResponse);
  });
});
