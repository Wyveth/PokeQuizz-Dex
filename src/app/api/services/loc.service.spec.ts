import { TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { LocService } from './loc.service';

describe('LocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...testProviders(), LocService] });
  });

  it('should be created', () => {
    expect(TestBed.inject(LocService)).toBeTruthy();
  });
});
