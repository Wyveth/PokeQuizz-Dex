import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Hangman } from 'src/app/api/models/concretes/hangman';
import { GENERATIONS, generationLabel } from 'src/app/api/models/concretes/quizz';
import { AuthService } from 'src/app/api/services/auth.service';
import { DuelService } from 'src/app/api/services/duel.service';
import { HangmanService } from 'src/app/api/services/hangman.service';
import { LocService } from 'src/app/api/services/loc.service';
import { TranslationKey } from 'src/app/i18n/fr';
import { I18nService } from 'src/app/i18n/i18n.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

/** Accueil du pendu : partie solo (sans compte), invitation coop par code ami, parties en cours et terminées. */
@Component({
  selector: 'app-hangman-home',
  templateUrl: './hangman-home.component.html',
  imports: [TranslatePipe, CommonModule, FormsModule, RouterModule]
})
export class HangmanHomeComponent implements OnInit {
  readonly generationOptions = GENERATIONS;

  loc = 'FR';

  soloGenerations = signal<number[]>([]);
  starting = signal(false);

  friendCode = '';
  coopGenerations = signal<number[]>([]);
  sending = signal(false);
  inviteSent = signal<string | null>(null);

  games = signal<Hangman[] | null>(null);
  error = signal<string | null>(null);

  active = computed(() => (this.games() ?? []).filter(g => g.status === 'InProgress' || g.status === 'Invited'));
  past = computed(() => (this.games() ?? []).filter(g => g.status === 'Finished').slice(0, 10));
  best = computed(() => {
    const scores = (this.games() ?? []).filter(g => g.status === 'Finished').map(g => g.found);
    return scores.length ? Math.max(...scores) : null;
  });

  private destroyRef = inject(DestroyRef);

  constructor(
    public auth: AuthService,
    private hangman: HangmanService,
    private duels: DuelService,
    private locService: LocService,
    private i18n: I18nService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // La session est restaurée après l'affichage : on recharge dès qu'on sait si le joueur est connecté
    effect(() => {
      this.auth.isLoggedIn();
      untracked(() => this.reload());
    });
  }

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.loc = params['loc'] || 'FR';
      this.locService.setLoc(this.loc);
    });

    this.duels.hangmanUpdated$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.reload());
    this.duels.invitationsChanged$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.reload());
  }

  toggle(list: 'solo' | 'coop', value: number) {
    const target = list === 'solo' ? this.soloGenerations : this.coopGenerations;
    target.update(current => (current.includes(value) ? current.filter(g => g !== value) : [...current, value]));
  }

  generationName(value: number) {
    return generationLabel(this.i18n, value);
  }

  generationsText(game: Hangman): string {
    return game.generations.length ? game.generations.map(g => this.generationName(g)).join(', ') : this.i18n.t('hangman.allGenerations');
  }

  startSolo() {
    if (this.starting()) return;
    this.starting.set(true);
    this.error.set(null);
    this.hangman.createSolo(this.soloGenerations(), this.loc).subscribe({
      next: game => this.open(game),
      error: err => {
        this.error.set(err.message);
        this.starting.set(false);
      }
    });
  }

  invite() {
    if (!this.friendCode.trim() || this.sending()) return;
    this.sending.set(true);
    this.error.set(null);
    this.inviteSent.set(null);
    this.hangman.invite(this.friendCode, this.coopGenerations(), this.loc).subscribe({
      next: game => {
        this.sending.set(false);
        this.friendCode = '';
        this.inviteSent.set(game.partner ?? '');
        this.reload();
      },
      error: err => {
        this.error.set(err.message);
        this.sending.set(false);
      }
    });
  }

  open(game: Hangman) {
    this.router.navigate(['/', this.loc, 'hangman', game.id]);
  }

  statusKey(game: Hangman): TranslationKey {
    if (game.status === 'Invited') return game.isInviter ? 'hangman.waitingPartner' : 'hangman.status.Invited';
    if (game.status === 'InProgress' && game.mode === 'Coop') return game.isMyTurn ? 'hangman.yourTurn' : 'hangman.partnerTurn';
    return `hangman.status.${game.status}` as TranslationKey;
  }

  private reload() {
    this.hangman.mine().subscribe({ next: list => this.games.set(list), error: err => this.error.set(err.message) });
  }
}
