import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { PokemonAttackComponent } from './pokemon-attack.component';

describe('PokemonAttackComponent', () => {
  let fixture: ComponentFixture<PokemonAttackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonAttackComponent],
      providers: testProviders()
    }).compileComponents();
    fixture = TestBed.createComponent(PokemonAttackComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
