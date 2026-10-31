import { TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...testProviders(), ThemeService] });
  });

  it('should be created', () => {
    expect(TestBed.inject(ThemeService)).toBeTruthy();
  });
});
