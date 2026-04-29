import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('authGuard', () => {
  let authGuard: AuthGuard;

  const executeGuard: CanActivateFn = () =>
    TestBed.runInInjectionContext(() => authGuard.canActivate());

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard]
    });
    authGuard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
