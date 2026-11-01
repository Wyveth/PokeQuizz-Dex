import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Duel, DuelSettings, DuelStats } from 'src/app/api/models/concretes/duel';
import {
  DIFFICULTIES,
  DifficultyCode,
  GENERATIONS,
  difficultyKey,
  generationLabel
} from 'src/app/api/models/concretes/quizz';
import { DuelService } from 'src/app/api/services/duel.service';
import { LocService } from 'src/app/api/services/loc.service';
import { TranslationKey } from 'src/app/i18n/fr';
import { I18nService } from 'src/app/i18n/i18n.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

@Component({
  selector: 'app-duel-lobby',
  templateUrl: './duel-lobby.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, CommonModule, FormsModule, RouterModule]
})
export class DuelLobbyComponent implements OnInit {
  readonly difficultyOptions = DIFFICULTIES;
  readonly generationOptions = GENERATIONS;
  readonly difficultyKey = difficultyKey;

  loc = 'FR';

  // Matchmaking
  searchDifficulty = signal<DifficultyCode>('Easy');
  /** Le mode « à son rythme » (Async) est désactivé pour l'instant : toujours en temps réel. */
  searchLive = signal(true);
  searching = signal(false);

  // Défi privé
  friendCode = signal<string | null>(null);
  copied = signal(false);
  challengeCode = '';
  challengeDifficulty = signal<DifficultyCode>('Easy');
  challengeLive = signal(true);
  challengeGenerations = signal<number[]>([]);
  challengeSent = signal<string | null>(null);
  sending = signal(false);

  stats = signal<DuelStats | null>(null);
  settings = signal<DuelSettings | null>(null);
  duels = signal<Duel[] | null>(null);
  error = signal<string | null>(null);

  /** Recherche temps réel en cours (on attend un adversaire sur cet écran). */
  liveSearch = computed(
    () => (this.duels() ?? []).find(d => d.status === 'Searching' && d.mode === 'Live') ?? null
  );
  active = computed(() =>
    (this.duels() ?? []).filter(
      d =>
        d.status === 'InProgress' ||
        d.status === 'Invited' ||
        (d.status === 'Searching' && d.mode === 'Async')
    )
  );
  past = computed(() =>
    (this.duels() ?? [])
      .filter(d => !['InProgress', 'Invited', 'Searching'].includes(d.status))
      .slice(0, 10)
  );

  private destroyRef = inject(DestroyRef);

  constructor(
    private duelService: DuelService,
    private locService: LocService,
    private i18n: I18nService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.loc = params['loc'] || 'FR';
      this.locService.setLoc(this.loc);
    });

    this.duelService
      .friendCode()
      .subscribe({
        next: c => this.friendCode.set(c.code),
        error: err => this.error.set(err.message)
      });
    this.duelService
      .settings()
      .subscribe({ next: s => this.settings.set(s), error: () => undefined });
    this.reload();

    this.duelService.duelUpdated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(id => this.onDuelUpdated(id));
    // Défi reçu, accepté ou refusé (via la cloche) : la liste des duels change
    this.duelService.invitationsChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.reload());
  }

  // ---------- Matchmaking ----------
  search() {
    if (this.searching()) return;
    this.searching.set(true);
    this.error.set(null);
    this.duelService
      .search(this.searchLive() ? 'Live' : 'Async', this.searchDifficulty())
      .subscribe({
        next: duel => {
          this.searching.set(false);
          // Adversaire trouvé, ou mode asynchrone (on peut jouer tout de suite) : direction la partie
          if (duel.status === 'InProgress' || duel.mode === 'Async') this.open(duel);
          else this.reload();
        },
        error: err => {
          this.error.set(err.message);
          this.searching.set(false);
        }
      });
  }

  cancel(duel: Duel, event?: Event) {
    event?.stopPropagation();
    this.duelService
      .cancel(duel.id)
      .subscribe({ next: () => this.reload(), error: err => this.error.set(err.message) });
  }

  /** Secondes par question pour cette difficulté (réglage serveur ; 20 s en attendant la réponse). */
  secondsFor(difficulty: DifficultyCode): number {
    return this.settings()?.questionSeconds?.[difficulty] ?? 20;
  }

  // ---------- Code ami ----------
  copyCode() {
    const code = this.friendCode();
    if (!code) return;
    navigator.clipboard?.writeText(code).then(
      () => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      },
      () => undefined
    );
  }

  regenerateCode() {
    this.duelService
      .regenerateFriendCode()
      .subscribe({
        next: c => this.friendCode.set(c.code),
        error: err => this.error.set(err.message)
      });
  }

  toggleGeneration(value: number) {
    this.challengeGenerations.update(list =>
      list.includes(value) ? list.filter(g => g !== value) : [...list, value]
    );
  }

  generationName(value: number) {
    return generationLabel(this.i18n, value);
  }

  sendChallenge() {
    if (!this.challengeCode.trim() || this.sending()) return;
    this.sending.set(true);
    this.error.set(null);
    this.challengeSent.set(null);
    this.duelService
      .challenge({
        friendCode: this.challengeCode,
        mode: this.challengeLive() ? 'Live' : 'Async',
        difficulty: this.challengeDifficulty(),
        generations: this.challengeGenerations()
      })
      .subscribe({
        next: duel => {
          this.sending.set(false);
          this.challengeCode = '';
          this.challengeSent.set(duel.opponent?.userName ?? '');
          this.reload();
        },
        error: err => {
          this.error.set(err.message);
          this.sending.set(false);
        }
      });
  }

  open(duel: Duel) {
    this.router.navigate(['/', this.loc, 'duel', duel.id]);
  }

  // ---------- Libellés ----------
  statusKey(duel: Duel): TranslationKey {
    if (duel.status === 'Finished' && duel.result)
      return `duel.result.${duel.result}` as TranslationKey;
    return `duel.status.${duel.status}` as TranslationKey;
  }

  modeKey(duel: Duel): TranslationKey {
    return duel.mode === 'Live' ? 'duel.mode.live' : 'duel.mode.async';
  }

  opponentName(duel: Duel): string {
    return duel.opponent?.userName ?? this.i18n.t('duel.waitingOpponent');
  }

  private onDuelUpdated(id: string) {
    const search = this.liveSearch();
    this.reload(list => {
      // Notre recherche temps réel vient de trouver un adversaire : on lance la partie
      const found =
        search && list.find(d => d.id === id && d.id === search.id && d.status === 'InProgress');
      if (found) this.open(found);
    });
  }

  private reload(after?: (list: Duel[]) => void) {
    this.duelService.mine().subscribe({
      next: list => {
        this.duels.set(list);
        after?.(list);
      },
      error: err => this.error.set(err.message)
    });
    this.duelService.stats().subscribe({ next: s => this.stats.set(s), error: () => undefined });
  }
}
