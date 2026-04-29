import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { NoAuthGuard } from './no-auth.guard';

describe('noAuthGuard', () => {
  let noAuthGuard: NoAuthGuard;

  const executeGuard: CanActivateFn = () => 
    TestBed.runInInjectionContext(() => noAuthGuard.canActivate());

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [NoAuthGuard]});
      noAuthGuard = TestBed.inject(NoAuthGuard);
  
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
