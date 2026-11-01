import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { PokemonEvolutionComponent } from './pokemon-evolution.component';

describe('PokemonEvolutionComponent', () => {
  let fixture: ComponentFixture<PokemonEvolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonEvolutionComponent],
      providers: testProviders()
    }).compileComponents();
    fixture = TestBed.createComponent(PokemonEvolutionComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
