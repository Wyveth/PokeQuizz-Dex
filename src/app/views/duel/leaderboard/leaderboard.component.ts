import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DuelSettings, Leaderboard, LeaderboardPeriod, LeaderboardSort } from 'src/app/api/models/concretes/duel';
import { AuthService } from 'src/app/api/services/auth.service';
import { DuelService } from 'src/app/api/services/duel.service';
import { LocService } from 'src/app/api/services/loc.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

/** Classement des duels : victoires pondérées par la difficulté, puis points marqués ; général ou du mois. */
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  imports: [TranslatePipe, CommonModule, RouterModule]
})
export class LeaderboardComponent implements OnInit {
  loc = 'FR';
  period = signal<LeaderboardPeriod>('month');
  sort = signal<LeaderboardSort>('wins');

  board = signal<Leaderboard | null>(null);
  settings = signal<DuelSettings | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  /** Points par victoire : Facile, Normal, Difficile (réglage serveur ; 1/2/3 en attendant). */
  winPoints = computed(() => {
    const p = this.settings()?.winPoints ?? {};
    return [p['Easy'] ?? 1, p['Normal'] ?? 2, p['Hard'] ?? 3];
  });

  private destroyRef = inject(DestroyRef);

  constructor(
    private duelService: DuelService,
    private locService: LocService,
    public auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.loc = params['loc'] || 'FR';
      this.locService.setLoc(this.loc);
    });
    this.duelService.settings().subscribe({ next: s => this.settings.set(s), error: () => undefined });
    this.load();
    // Présence en ligne : relecture toutes les 30 s (sans indicateur de chargement)
    const refresh = setInterval(() => this.load(true), 30000);
    this.destroyRef.onDestroy(() => clearInterval(refresh));
    // Un duel se termine : le classement peut changer
    this.duelService.duelUpdated$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.load());
  }

  setPeriod(period: LeaderboardPeriod) {
    if (this.period() === period) return;
    this.period.set(period);
    this.load();
  }

  setSort(sort: LeaderboardSort) {
    if (this.sort() === sort) return;
    this.sort.set(sort);
    this.load();
  }

  /** Podium : or, argent, bronze. */
  medalClass(rank: number): string {
    if (rank === 1) return 'bg-amber-400 text-amber-950';
    if (rank === 2) return 'bg-zinc-300 text-zinc-800';
    if (rank === 3) return 'bg-orange-300 text-orange-950';
    return 'bg-black/[0.05] dark:bg-white/10';
  }

  private load(silent = false) {
    if (!silent) this.loading.set(true);
    this.error.set(null);
    this.duelService.leaderboard(this.period(), this.sort()).subscribe({
      next: board => {
        this.board.set(board);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
