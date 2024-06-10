import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TimeoutService {

  constructor(private idle: Idle, private keepalive: Keepalive, private router: Router) { }

  initTimeout() {
    // Set idle timeout to 15 minutes (900 seconds)
    this.idle.setIdle(900);
    // Set timeout warning time to 1 minute (60 seconds)
    this.idle.setTimeout(60);
    // Use default interrupts (mousemove, keydown, scroll)
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // Start watching for user activity
    this.idle.watch();

    // Handle timeout warning
    this.idle.onTimeoutWarning.subscribe((countdown) => {
      console.log('Timeout warning', countdown);
      // You can display a warning to the user here
    });

    // Handle timeout
    this.idle.onTimeout.subscribe(() => {
      console.log('Timeout reached');
      // Perform logout action
      this.logout();
    });
  }

  logout() {
    // Clear any user session data (e.g., token, user info)
    localStorage.removeItem('token');
    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
