import { TranslatePipe } from 'src/app/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuizzResult, settingsLabels } from 'src/app/api/models/concretes/quizz';
import { I18nService } from 'src/app/i18n/i18n.service';
import { TranslationKey } from 'src/app/i18n/fr';
import { LocService } from 'src/app/api/services/loc.service';
import { QuizzService } from 'src/app/api/services/quizz.service';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  imports: [TranslatePipe, CommonModule, RouterModule]
})
export class QuizResultComponent implements OnInit {
  loc = 'FR';
  quizzId = '';

  result = signal<QuizzResult | null>(null);
  error = signal<string | null>(null);
  replaying = signal(false);

  score = computed(() => {
    const summary = this.result()?.summary;
    return summary && summary.nbQuestions > 0
      ? Math.round((summary.nbCorrect / summary.nbQuestions) * 100)
      : 0;
  });

  verdict = computed<TranslationKey>(() => {
    const score = this.score();
    if (score === 100) return 'result.verdict.perfect';
    if (score >= 80) return 'result.verdict.excellent';
    if (score >= 50) return 'result.verdict.good';
    return 'result.verdict.bad';
  });

  constructor(
    private quizzService: QuizzService,
    private locService: LocService,
    private route: ActivatedRoute,
    private router: Router,
    private i18n: I18nService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loc = params['loc'] || 'FR';
      this.locService.setLoc(this.loc);
      this.quizzId = params['id'];
      this.quizzService.getResult(this.quizzId, this.loc).subscribe({
        next: result => this.result.set(result),
        error: err => this.error.set(err.message)
      });
    });
  }

  settingsLabel(): string {
    const summary = this.result()?.summary;
    if (!summary) return '';
    const labels = settingsLabels(this.i18n, summary);
    return `${labels.generations} · ${labels.difficulties}`;
  }

  /** Relance une partie avec les mêmes réglages. */
  replay() {
    const summary = this.result()?.summary;
    if (!summary || this.replaying()) return;
    this.replaying.set(true);
    this.quizzService
      .create({ generations: summary.generations, difficulties: summary.difficulties })
      .subscribe({
        next: created => this.router.navigate(['/', this.loc, 'quiz', created.id, created.nextOrder ?? 1]),
        error: err => {
          this.error.set(err.message);
          this.replaying.set(false);
        }
      });
  }

  resume() {
    const next = this.result()?.summary.nextOrder;
    if (next) this.router.navigate(['/', this.loc, 'quiz', this.quizzId, next]);
  }
}
