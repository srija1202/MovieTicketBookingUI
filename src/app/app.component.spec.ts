import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AuthService } from './Service/auth.service';
import { TicketPopupComponent } from './component/ticket-popup/ticket-popup.component';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let modalService: NgbModal;

  beforeEach(async () => {
    // Create a spy object for AuthService
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'loggedIn', 'getUserRole']);
    authServiceSpy.loggedIn = true; // Mock logged in status
    authServiceSpy.getUserRole.and.returnValue('Admin'); // Mock admin role

    // Configure TestBed with necessary dependencies
    await TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        NgbModal
      ]
    }).compileComponents();

    // Create fixture and component instance
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Get the mocked services for further interaction
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    modalService = TestBed.inject(NgbModal);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should check if user is logged in', () => {
    expect(component.isLoggedIn()).toBeTrue();
  });

  it('should check if user is admin', () => {
    expect(component.isAdmin()).toBeTrue();
  });

  it('should call AuthService.logout() on logout()', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should open ticket popup modal', () => {
    const modalRef = jasmine.createSpyObj({ componentInstance: {} });
    spyOn(modalService, 'open').and.returnValue({ componentInstance: modalRef } as any);

    component.openTicketPopup();

    expect(modalService.open).toHaveBeenCalledWith(TicketPopupComponent, { size: 'lg' });
    // Optionally, you can further test interactions with the modalRef if needed
  });
});
