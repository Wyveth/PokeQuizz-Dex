import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AdminService,
  GameDataCounts,
  PURGE_CONFIRMATION
} from 'src/app/api/services/admin.service';
import { AuthService } from 'src/app/api/services/auth.service';
import { LocService } from 'src/app/api/services/loc.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

/** Administration : purge des quiz (hors duels) et des parties de pendu, avec aperçu et confirmation saisie. */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, CommonModule, FormsModule]
})
export class AdminComponent implements OnInit {
  readonly confirmationWord = PURGE_CONFIRMATION;

  counts = signal<GameDataCounts | null>(null);
  result = signal<GameDataCounts | null>(null);
  loading = signal(true);
  purging = signal(false);
  error = signal<string | null>(null);
  confirmText = '';

  private destroyRef = inject(DestroyRef);

  constructor(
    public auth: AuthService,
    private admin: AdminService,
    private locService: LocService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => this.locService.setLoc(params['loc'] || 'FR'));
    this.load();
  }

  canPurge(): boolean {
    const c = this.counts();
    return (
      !this.purging() &&
      this.confirmText.trim().toUpperCase() === PURGE_CONFIRMATION &&
      !!c &&
      c.quizzes + c.hangmanGames > 0
    );
  }

  purge() {
    if (!this.canPurge()) return;
    this.purging.set(true);
    this.error.set(null);
    this.admin.purgeGameData().subscribe({
      next: result => {
        this.purging.set(false);
        this.confirmText = '';
        this.result.set(result);
        this.load();
      },
      error: err => {
        this.purging.set(false);
        this.error.set(err.message);
      }
    });
  }

  private load() {
    this.loading.set(true);
    this.admin.gameData().subscribe({
      next: c => {
        this.counts.set(c);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
