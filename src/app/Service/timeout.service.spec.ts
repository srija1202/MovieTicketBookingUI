import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TimeoutService } from './timeout.service';

describe('TimeoutService', () => {
  let service: TimeoutService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockDestroy$: Subject<void>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        TimeoutService,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(TimeoutService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock the destroy$ subject to control timer cancellation in tests
    mockDestroy$ = new Subject<void>();
    (service as any).destroy$ = mockDestroy$;
  });

  afterEach(() => {
    mockDestroy$.next();
    mockDestroy$.complete();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
 
  it('should reset the timer', () => {
    const destroySpy = spyOn((service as any).destroy$, 'next');
    const initTimeoutSpy = spyOn(service as any, 'initTimeout').and.callThrough();

    service.resetTimer();

    expect(destroySpy).toHaveBeenCalled();
    expect(initTimeoutSpy).toHaveBeenCalled();
  });

  it('should clean up resources on destroy', () => {
    const destroySpy = spyOn((service as any).destroy$, 'next');
    const completeSpy = spyOn((service as any).destroy$, 'complete');

    service.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
