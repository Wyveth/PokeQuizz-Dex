import { TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { AuthGuardService } from './auth-guard.service';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...testProviders(), AuthGuardService] });
  });

  it('should be created', () => {
    expect(TestBed.inject(AuthGuardService)).toBeTruthy();
  });
});
