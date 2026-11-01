import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: testProviders()
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
