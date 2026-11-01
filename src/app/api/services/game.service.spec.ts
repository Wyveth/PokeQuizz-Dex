import { TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { GameService } from './game.service';

describe('GameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...testProviders(), GameService] });
  });

  it('should be created', () => {
    expect(TestBed.inject(GameService)).toBeTruthy();
  });
});
