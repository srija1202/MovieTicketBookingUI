import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TimeoutService {
  private readonly SESSION_TIMEOUT = 120; // 30 minutes in seconds
  private timeoutTimer$ = timer(this.SESSION_TIMEOUT * 1000);
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private authService: AuthService) {
    this.initTimeout();
  }

  /**
   * Initializes the session timeout timer.
   * When the timer expires, it calls authService.logout() to log the user out.
   */
  private initTimeout(): void {
    this.timeoutTimer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.authService.logout();
      });
  }

  /**
   * Resets the session timeout timer.
   * Stops the current timer, creates a new timer, and initializes it.
   */
  resetTimer(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timeoutTimer$ = timer(this.SESSION_TIMEOUT * 1000);
    this.initTimeout();
  }

  /**
   * Cleans up resources when the service is destroyed.
   * Completes the destroy$ Subject to unsubscribe from the timer observable.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
