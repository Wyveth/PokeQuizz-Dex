import { TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { AbstractService } from './abstract.service';

describe('AbstractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...testProviders(), AbstractService] });
  });

  it('should be created', () => {
    expect(TestBed.inject(AbstractService)).toBeTruthy();
  });
});
