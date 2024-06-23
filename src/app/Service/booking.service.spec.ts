import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './booking.service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../Models/api-response';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService]
    });
    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should book a ticket', () => {
    const mockResponse: ApiResponse = { isSuccess: true, message: '12345' };
    const bookingData = { ticketsCount: 2, movieId: '67890', theaterId: '111213' };

    service.bookTicket(bookingData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Booking/Book`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(bookingData);
    req.flush(mockResponse);
  });
});
