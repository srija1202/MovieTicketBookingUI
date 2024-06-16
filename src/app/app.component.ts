import { Component } from '@angular/core';
import { AuthService } from './Service/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketPopupComponent } from './component/ticket-popup/ticket-popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MovieTicketBookingUI';

  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal) { }

  /**
   * Checks if the user is logged in.
   * @returns True if the user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return this.authService.loggedIn;
  }

  /**
   * Checks if the logged-in user has admin role.
   * @returns True if the user has admin role, false otherwise.
   */
  isAdmin(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole === 'Admin'; // Adjust based on your actual role value
  }

  /**
   * Logs out the current user.
   * Navigates to the home page after logout.
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Opens a ticket popup modal for booking tickets.
   * Adjusts the modal size as needed ('lg' for large).
   */
  openTicketPopup() {
    const modalRef = this.modalService.open(TicketPopupComponent, { size: 'lg' });
    // Optionally pass any necessary data to the popup component here
  }
}
