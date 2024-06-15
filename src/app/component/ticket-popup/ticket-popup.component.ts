import { Component, OnInit } from '@angular/core';
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
  tickets: Ticket[] = []; // Define Ticket model as per your API response

  constructor(private ticketService: TicketService,  private modalService: NgbModal, public activeModal: NgbActiveModal,) {}

  ngOnInit(): void {
    this.loadTickets();
  }
  loadTickets() {
    // Fetch tickets from service
    this.ticketService.getTickets().subscribe(
      tickets => {
        this.tickets = tickets;
      },
      error => {
        console.error('Error fetching tickets:', error);
        // Handle error appropriately
      }
    );
  }

  editTicketCount(ticket: Ticket) {
    const newTicketCount = prompt(`Enter new ticket count for ${ticket.movie.movieName}:`, ticket.totalCount.toString());
    if (newTicketCount !== null) {
      const parsedCount = parseInt(newTicketCount, 10);
      if (!isNaN(parsedCount) && parsedCount >= 0) {
        const updatePayload = {
          ticketsCount: parsedCount,
          movieId: ticket.movieId,
          theaterId: ticket.theatreId,
          ticketId: ticket.ticketId
        };
  
        this.ticketService.updateTicket(updatePayload).subscribe({
          next: (response: ApiResponse) => {
            if (response.isSuccess) {
              console.log('Ticket update successful:', response);
              this.loadTickets();
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
  
}
