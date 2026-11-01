import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: testProviders()
    }).compileComponents();
    fixture = TestBed.createComponent(LayoutComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
