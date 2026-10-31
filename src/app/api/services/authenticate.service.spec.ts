import { TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { AuthenticateService } from './authenticate.service';

describe('AuthenticateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...testProviders(), AuthenticateService] });
  });

  it('should be created', () => {
    expect(TestBed.inject(AuthenticateService)).toBeTruthy();
  });
});
