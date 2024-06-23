import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from 'src/app/Service/ticket.service';
import { Ticket } from 'src/app/Models/ticket';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from 'src/app/Models/api-response';
import { TimeoutService } from 'src/app/Service/timeout.service';

@Component({
  selector: 'app-ticket-popup',
  templateUrl: './ticket-popup.component.html',
  styleUrls: ['./ticket-popup.component.css']
})
export class TicketPopupComponent implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  selectedTicket?: Ticket;
  newTicketCount?: number;

  @ViewChild('editTicketModal', { static: true }) editTicketModal!: TemplateRef<any>;

  constructor(
    private ticketService: TicketService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private snackBar: MatSnackBar,
    private timeoutService: TimeoutService
  ) {}

  ngOnInit(): void {
    this.loadTickets();

    // Add event listeners to reset timeout on user activity
    window.addEventListener('mousemove', this.resetTimeout.bind(this));
    window.addEventListener('keydown', this.resetTimeout.bind(this));
  }

  loadTickets() {
    this.ticketService.getTickets().subscribe(
      tickets => {
        this.tickets = tickets;
      },
      error => {
        this.snackBar.open('Failed to load tickets', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  editTicketCount(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.newTicketCount = ticket.totalCount;
    this.modalService.open(this.editTicketModal);
  }

  saveTicketCount() {
    if (this.selectedTicket && this.newTicketCount !== undefined && !isNaN(this.newTicketCount) && this.newTicketCount >= 0) {
      const updatePayload = {
        ticketsCount: this.newTicketCount,
        movieId: this.selectedTicket.movie.id,
        theaterId: this.selectedTicket.theater.id,
        ticketId: this.selectedTicket.ticketId
      };

      this.ticketService.updateTicket(updatePayload).subscribe({
        next: (response: ApiResponse) => {
          if (response.isSuccess) {
            this.loadTickets();
            this.modalService.dismissAll();
            this.snackBar.open('Ticket count updated successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            this.snackBar.open('Failed to update ticket count', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error: any) => {
          this.snackBar.open('An error occurred while updating the ticket count', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('Please enter a valid ticket count', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  ngOnDestroy() {
    // Clean up event listeners
    window.removeEventListener('mousemove', this.resetTimeout.bind(this));
    window.removeEventListener('keydown', this.resetTimeout.bind(this));
  }

  resetTimeout(): void {
    this.timeoutService.resetTimer();
  }
}
