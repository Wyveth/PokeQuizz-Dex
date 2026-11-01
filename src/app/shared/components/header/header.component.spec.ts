import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from 'src/app/api/services/auth.service';
import { DuelService } from 'src/app/api/services/duel.service';
import { testProviders } from 'src/testing/test-providers';
import { InvitationCenterService } from '../../services/invitation-center.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        ...testProviders(),
        { provide: DuelService, useValue: { duelUpdated$: new Subject<string>(), connect: vi.fn(), disconnect: vi.fn() } },
        { provide: InvitationCenterService, useValue: { start: vi.fn(), stop: vi.fn(), count: signal(0), items: signal([]) } }
      ]
    }).compileComponents();
    vi.spyOn(TestBed.inject(AuthService), 'restoreSession').mockImplementation(() => {});
    fixture = TestBed.createComponent(HeaderComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('affiche Duel et Classement seulement pendant une session connectée', () => {
    const auth = TestBed.inject(AuthService);
    const link = (title: string) => fixture.nativeElement.querySelector(`a[title="${title}"]`);

    fixture.detectChanges();
    expect(link('Duel')).toBeNull();
    expect(link('Classement')).toBeNull();
    expect(link('Quiz')).not.toBeNull();
    expect(link('Pendu')).not.toBeNull();

    auth.user.set({ id: '1', userName: 'Joueur', email: 'joueur@example.com' });
    fixture.detectChanges();
    expect(link('Duel')).not.toBeNull();
    expect(link('Classement')).not.toBeNull();

    auth.user.set(null);
    fixture.detectChanges();
    expect(link('Duel')).toBeNull();
    expect(link('Classement')).toBeNull();
    expect(link('Quiz')).not.toBeNull();
    expect(link('Pendu')).not.toBeNull();
  });
});
