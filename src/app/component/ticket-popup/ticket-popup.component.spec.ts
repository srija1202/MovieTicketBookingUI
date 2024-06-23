import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { TicketPopupComponent } from './ticket-popup.component';
import { TicketService } from 'src/app/Service/ticket.service';
import { TimeoutService } from 'src/app/Service/timeout.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ticket } from 'src/app/Models/ticket';
import { ApiResponse } from 'src/app/Models/api-response';
import { Movie } from 'src/app/Models/movie';
import { Theatre } from 'src/app/Models/theatre';

fdescribe('TicketPopupComponent', () => {
  let component: TicketPopupComponent;
  let fixture: ComponentFixture<TicketPopupComponent>;
  let ticketService: jasmine.SpyObj<TicketService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let timeoutService: jasmine.SpyObj<TimeoutService>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    const ticketServiceSpy = jasmine.createSpyObj('TicketService', [
      'getTickets',
      'updateTicket',
    ]);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', [
      'open',
      'dismissAll',
    ]);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const timeoutServiceSpy = jasmine.createSpyObj('TimeoutService', [
      'resetTimer',
    ]);
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [TicketPopupComponent],
      providers: [
        { provide: TicketService, useValue: ticketServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: TimeoutService, useValue: timeoutServiceSpy },
        { provide: NgbActiveModal, useValue: activeModalSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketPopupComponent);
    component = fixture.componentInstance;
    ticketService = TestBed.inject(
      TicketService
    ) as jasmine.SpyObj<TicketService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    timeoutService = TestBed.inject(
      TimeoutService
    ) as jasmine.SpyObj<TimeoutService>;
    activeModal = TestBed.inject(
      NgbActiveModal
    ) as jasmine.SpyObj<NgbActiveModal>;

    // Mock ticket data
    const tickets = [
      {
        ticketId: '1',
        totalCount: 2,
        movie: { id: '1', movieName: 'Test Movie' } as Movie,
        theater: { id: '1', theaterName: 'Test Theatre' } as Theatre,
      },
    ] as Ticket[];
    ticketService.getTickets.and.returnValue(of(tickets));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tickets on initialization', () => {
    fixture.detectChanges();
    expect(component.tickets.length).toBe(1);
    expect(ticketService.getTickets).toHaveBeenCalled();
  });

  it('should open modal to edit ticket count', () => {
    const ticket = {
      ticketId: '1',
      totalCount: 2,
      movie: { id: '1', name: 'Test Movie' },
      theater: { id: '1', name: 'Test Theatre' },
    } as unknown as Ticket;
    component.editTicketCount(ticket);
    expect(component.selectedTicket).toEqual(ticket);
    expect(component.newTicketCount).toBe(ticket.totalCount);
    expect(modalService.open).toHaveBeenCalledWith(component.editTicketModal);
  });

  it('should successfully save the updated ticket count', () => {
    const ticket = {
      ticketId: '1',
      totalCount: 2,
      movie: { id: '1', movieName: 'Test Movie' } as Movie,
      theater: { id: '1', theaterName: 'Test Theatre' } as Theatre,
    } as Ticket;
    component.selectedTicket = ticket;
    component.newTicketCount = 3;

    const apiResponse: ApiResponse = { isSuccess: true, message: 'Success' };
    ticketService.updateTicket.and.returnValue(of(apiResponse));

    component.saveTicketCount();

    expect(ticketService.updateTicket).toHaveBeenCalled();
    expect(modalService.dismissAll).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Ticket count updated successfully!',
      'Close',
      {
        duration: 3000,
        panelClass: ['success-snackbar'],
      }
    );
  });

  it('should handle ticket update failure', () => {
    const ticket = {
      ticketId: '1',
      totalCount: 2,
      movie: { id: '1', movieName: 'Test Movie' } as Movie,
      theater: { id: '1', theaterName: 'Test Theatre' } as Theatre,
    } as Ticket;
    component.selectedTicket = ticket;
    component.newTicketCount = 3;

    ticketService.updateTicket.and.returnValue(
      throwError(() => new Error('Update failed'))
    );

    component.saveTicketCount();

    expect(ticketService.updateTicket).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'An error occurred while updating the ticket count',
      'Close',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
      }
    );
  });

  it('should show validation error for invalid ticket count', () => {
    component.saveTicketCount();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Please enter a valid ticket count',
      'Close',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
      }
    );
  });

  it('should reset timeout on user activity', () => {
    // Call ngOnInit explicitly to trigger event listener attachment
    fixture.detectChanges();
  
    spyOn(component, 'resetTimeout').and.callThrough();
  
    // Trigger user activity events
    const mouseEvent = new MouseEvent('mousemove');
    const keyEvent = new KeyboardEvent('keydown');
    
    window.dispatchEvent(mouseEvent);
    window.dispatchEvent(keyEvent);
  
    // Expect resetTimeout to be called twice
    expect(component.resetTimeout).toHaveBeenCalledTimes(2);
    expect(timeoutService.resetTimer).toHaveBeenCalled();
  });

  it('should clean up event listeners on destroy', () => {
    spyOn(window, 'removeEventListener');
    component.ngOnDestroy();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'mousemove',
      jasmine.any(Function)
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'keydown',
      jasmine.any(Function)
    );
  });
});
