import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from 'src/testing/test-providers';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: testProviders()
    }).compileComponents();
    fixture = TestBed.createComponent(SearchComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
