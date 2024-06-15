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
  isAdmin: boolean = false; // Initialize isAdmin based on the user's role

  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    // Check user role when component initializes
    const userRole = this.authService.getUserRole();
    this.isAdmin = userRole === 'Admin'; // Adjust based on your actual role value
  }

  // Example method to check if user is logged in
  isLoggedIn(): boolean {
    return this.authService.loggedIn;
  }

  logout(): void {
    this.authService.logout();
  }

  openTicketPopup() {
    const modalRef = this.modalService.open(TicketPopupComponent, { size: 'lg' }); // 'lg' for large size, adjust as needed
    // Pass any necessary data to the popup component here if needed
  }
}
