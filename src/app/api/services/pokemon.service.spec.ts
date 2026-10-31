import { TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...testProviders(), PokemonService] });
  });

  it('should be created', () => {
    expect(TestBed.inject(PokemonService)).toBeTruthy();
  });
});
