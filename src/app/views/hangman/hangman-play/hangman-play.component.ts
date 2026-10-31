import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { Hangman } from 'src/app/api/models/concretes/hangman';
import { generationLabel } from 'src/app/api/models/concretes/quizz';
import { DuelService } from 'src/app/api/services/duel.service';
import { HangmanService } from 'src/app/api/services/hangman.service';
import { LocService } from 'src/app/api/services/loc.service';
import { TranslationKey } from 'src/app/i18n/fr';
import { I18nService } from 'src/app/i18n/i18n.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/** Une case du mot : lettre (trouvée ou non) ou séparateur affiché tel quel (espace, tiret, point…). */
interface Cell {
  char: string;
  hidden: boolean;
  letter: boolean;
}

/** Partie de pendu : on enchaîne les Pokémon tant qu'il reste des vies (rechargées à chaque Pokémon trouvé). */
@Component({
  selector: 'app-hangman-play',
  templateUrl: './hangman-play.component.html',
  imports: [TranslatePipe, CommonModule, RouterModule]
})
export class HangmanPlayComponent implements OnInit, OnDestroy {
  readonly alphabet = ALPHABET;
  readonly imgRoot: string = this.config.getConfig('img_root');

  loc = 'FR';
  id = '';

  game = signal<Hangman | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  sending = signal(false);
  silhouetteUrl = signal<string | null>(null);
  /** Pokémon révélé à l'instant (affiché brièvement au-dessus du mot suivant). */
  showLast = signal(false);

  /** Le mot, découpé en mots (pour les retours à la ligne) puis en cases. */
  words = computed<Cell[][]>(() => {
    const mask = this.game()?.mask;
    if (!mask) return [];
    return mask.split(' ').map(word =>
      [...word].map(char => ({ char: char === '_' ? '' : char, hidden: char === '_', letter: char === '_' || /\p{L}/u.test(char) }))
    );
  });

  guessed = computed(() => new Map((this.game()?.letters ?? []).map(l => [l.letter, l.correct])));
  hearts = computed(() => {
    const g = this.game();
    return g ? Array.from({ length: g.maxLives }, (_, i) => i < g.lives) : [];
  });
  canPlay = computed(() => {
    const g = this.game();
    return !!g && g.status === 'InProgress' && g.isMyTurn && !this.sending();
  });
  hasHints = computed(() => {
    const h = this.game()?.hints;
    return !!h && (!!h.types?.length || h.generation !== null || !!h.description || h.silhouette);
  });

  private destroyRef = inject(DestroyRef);
  private poll?: Subscription;
  private silhouetteFor: string | null = null;
  private lastTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private hangman: HangmanService,
    private duels: DuelService,
    private locService: LocService,
    private i18n: I18nService,
    private config: AppConfig,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.loc = params['loc'] || 'FR';
      this.locService.setLoc(this.loc);
      if (params['id'] !== this.id) {
        this.id = params['id'];
        this.game.set(null);
        this.loading.set(true);
        this.load();
      }
    });

    // Coop : le partenaire a joué (SignalR), avec une relecture régulière en secours
    this.duels.hangmanUpdated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(id => {
        if (id === this.id) this.load();
      });
  }

  ngOnDestroy() {
    this.poll?.unsubscribe();
    clearTimeout(this.lastTimer);
    this.revokeSilhouette();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase();
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      this.guess(key);
      event.preventDefault();
    }
  }

  state(letter: string): 'correct' | 'wrong' | 'free' {
    const value = this.guessed().get(letter);
    return value === undefined ? 'free' : value ? 'correct' : 'wrong';
  }

  guess(letter: string) {
    if (!this.canPlay() || this.state(letter) !== 'free') return;
    this.sending.set(true);
    this.error.set(null);
    this.hangman.guess(this.id, letter).subscribe({
      next: game => {
        this.sending.set(false);
        this.apply(game);
      },
      error: err => {
        this.sending.set(false);
        this.error.set(err.message);
        this.load();
      }
    });
  }

  accept() {
    this.hangman.accept(this.id).subscribe({ next: g => this.apply(g), error: err => this.error.set(err.message) });
  }

  decline() {
    this.hangman.decline(this.id).subscribe({ next: () => this.backHome(), error: err => this.error.set(err.message) });
  }

  quit() {
    const g = this.game();
    if (g && (g.status === 'InProgress' || g.status === 'Invited')) {
      this.hangman.quit(this.id).subscribe({ next: game => this.apply(game), error: err => this.error.set(err.message) });
    } else this.backHome();
  }

  replay() {
    const g = this.game();
    if (!g) return;
    if (g.mode === 'Coop') {
      this.backHome();
      return;
    }
    this.hangman.createSolo(g.generations, this.loc).subscribe({
      next: game => this.router.navigate(['/', this.loc, 'hangman', game.id]),
      error: err => this.error.set(err.message)
    });
  }

  backHome() {
    this.router.navigate(['/', this.loc, 'hangman']);
  }

  statusKey(game: Hangman): TranslationKey {
    return `hangman.status.${game.status}` as TranslationKey;
  }

  generationName(value: number) {
    return generationLabel(this.i18n, value);
  }

  private load() {
    this.hangman.get(this.id).subscribe({
      next: game => {
        this.loading.set(false);
        this.apply(game);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err.message);
      }
    });
  }

  private apply(game: Hangman) {
    const previous = this.game();
    this.game.set(game);

    // Un Pokémon vient d'être trouvé (ou la partie vient de se terminer) : on montre qui c'était
    if (previous && game.last && (game.found !== previous.found || game.status !== previous.status)) {
      this.showLast.set(true);
      clearTimeout(this.lastTimer);
      if (game.status === 'InProgress') this.lastTimer = setTimeout(() => this.showLast.set(false), 4000);
    } else if (!previous && game.status !== 'InProgress') {
      this.showLast.set(true);
    }

    this.updateSilhouette(game);
    this.updatePolling(game);
  }

  /** Silhouette : téléchargée une fois par Pokémon, dès que l'indice est débloqué. */
  private updateSilhouette(game: Hangman) {
    const key = game.hints.silhouette && game.status === 'InProgress' ? `${game.id}:${game.found}` : null;
    if (key === this.silhouetteFor) return;
    this.revokeSilhouette();
    this.silhouetteFor = key;
    if (!key) return;
    this.hangman.silhouette(game.id).subscribe({
      next: url => {
        if (this.silhouetteFor === key) this.silhouetteUrl.set(url);
        else URL.revokeObjectURL(url);
      },
      error: () => undefined
    });
  }

  private revokeSilhouette() {
    const url = this.silhouetteUrl();
    if (url) URL.revokeObjectURL(url);
    this.silhouetteUrl.set(null);
  }

  /** En coop, on relit l'état toutes les 5 s quand c'est au partenaire (au cas où le temps réel serait coupé). */
  private updatePolling(game: Hangman) {
    const waiting = game.mode === 'Coop' && (game.status === 'Invited' || (game.status === 'InProgress' && !game.isMyTurn));
    if (waiting && !this.poll) this.poll = interval(5000).subscribe(() => this.load());
    else if (!waiting && this.poll) {
      this.poll.unsubscribe();
      this.poll = undefined;
    }
  }
}
