import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { ThemeSwitchComponent } from './theme-switch.component';

describe('ThemeSwitchComponent', () => {
  let fixture: ComponentFixture<ThemeSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSwitchComponent],
      providers: testProviders()
    }).compileComponents();
    fixture = TestBed.createComponent(ThemeSwitchComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
