import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: testProviders()
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`should have as title 'PokeQuizz-Dex'`, () => {
    expect(fixture.componentInstance.title).toEqual('PokeQuizz-Dex');
  });
});
