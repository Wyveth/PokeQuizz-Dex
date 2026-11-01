import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { PokemonItemComponent } from './pokemon-item.component';

describe('PokemonItemComponent', () => {
  let fixture: ComponentFixture<PokemonItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonItemComponent],
      providers: testProviders()
    }).compileComponents();
    fixture = TestBed.createComponent(PokemonItemComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
