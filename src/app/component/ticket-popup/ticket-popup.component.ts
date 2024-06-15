import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TicketService } from 'src/app/Service/ticket.service';
import { Ticket } from 'src/app/Models/ticket';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from 'src/app/Models/api-response';

@Component({
  selector: 'app-ticket-popup',
  templateUrl: './ticket-popup.component.html',
  styleUrls: ['./ticket-popup.component.css']
})
export class TicketPopupComponent implements OnInit {
  tickets: Ticket[] = [];
  selectedTicket?: Ticket;
  newTicketCount?: number;

  @ViewChild('editTicketModal', { static: true }) editTicketModal!: TemplateRef<any>;

  constructor(
    private ticketService: TicketService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getTickets().subscribe(
      tickets => {
        this.tickets = tickets;
      },
      error => {
        console.error('Error fetching tickets:', error);
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
          }
        },
        error: (error: any) => {
          console.error('Ticket update failed:', error);
        }
      });
    } else {
      alert('Invalid input. Please enter a valid number.');
    }
  }
}
