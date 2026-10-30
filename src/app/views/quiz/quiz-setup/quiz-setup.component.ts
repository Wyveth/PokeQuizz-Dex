import { TranslatePipe } from 'src/app/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  DIFFICULTIES,
  DifficultyCode,
  GENERATIONS,
  QuizzSummary,
  generationLabel,
  settingsLabels
} from 'src/app/api/models/concretes/quizz';
import { I18nService } from 'src/app/i18n/i18n.service';
import { LocService } from 'src/app/api/services/loc.service';
import { QuizzService } from 'src/app/api/services/quizz.service';

@Component({
  selector: 'app-quiz-setup',
  templateUrl: './quiz-setup.component.html',
  imports: [TranslatePipe, CommonModule, RouterModule]
})
export class QuizSetupComponent implements OnInit {
  readonly generationOptions = GENERATIONS;
  readonly difficultyOptions = DIFFICULTIES;

  loc = 'FR';
  generations = signal<number[]>([]);
  difficulties = signal<DifficultyCode[]>(['Easy']);

  starting = signal(false);
  error = signal<string | null>(null);

  quizzList = signal<QuizzSummary[] | null>(null);
  unfinished = computed(() => (this.quizzList() ?? []).filter(q => !q.done));
  finished = computed(() => (this.quizzList() ?? []).filter(q => q.done).slice(0, 5));

  /** Nombre de questions : fixé par la difficulté la plus facile cochée, comme dans l'app d'origine. */
  nbQuestions = computed(() => {
    const selected = this.difficulties();
    return this.difficultyOptions.find(d => selected.includes(d.value))?.questions ?? 10;
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
    });
    this.loadList();
  }

  isGenerationSelected(value: number) {
    return this.generations().includes(value);
  }

  toggleGeneration(value: number) {
    this.generations.update(list =>
      list.includes(value) ? list.filter(g => g !== value) : [...list, value]
    );
  }

  selectAllGenerations() {
    this.generations.set([]);
  }

  isDifficultySelected(value: DifficultyCode) {
    return this.difficulties().includes(value);
  }

  toggleDifficulty(value: DifficultyCode) {
    this.difficulties.update(list => {
      const next = list.includes(value) ? list.filter(d => d !== value) : [...list, value];
      // Au moins une difficulté
      return next.length === 0 ? list : next;
    });
  }

  start() {
    if (this.starting()) return;
    this.starting.set(true);
    this.error.set(null);

    this.quizzService
      .create({ generations: this.generations(), difficulties: this.difficulties() })
      .subscribe({
        next: summary => this.router.navigate(['/', this.loc, 'quiz', summary.id, summary.nextOrder ?? 1]),
        error: err => {
          this.error.set(err.message);
          this.starting.set(false);
        }
      });
  }

  resume(quizz: QuizzSummary) {
    if (quizz.done || quizz.nextOrder === null)
      this.router.navigate(['/', this.loc, 'quiz', quizz.id, 'result']);
    else this.router.navigate(['/', this.loc, 'quiz', quizz.id, quizz.nextOrder]);
  }

  remove(quizz: QuizzSummary, event: Event) {
    event.stopPropagation();
    this.quizzService.delete(quizz.id).subscribe({
      next: () => this.quizzList.update(list => (list ?? []).filter(q => q.id !== quizz.id)),
      error: err => this.error.set(err.message)
    });
  }

  generationName(value: number) {
    return generationLabel(this.i18n, value);
  }

  generationLabel(quizz: QuizzSummary) {
    return settingsLabels(this.i18n, quizz).generations;
  }

  difficultyLabel(quizz: QuizzSummary) {
    return settingsLabels(this.i18n, quizz).difficulties;
  }

  private loadList() {
    this.quizzService.listMine().subscribe({
      next: list => this.quizzList.set(list),
      error: () => this.quizzList.set([])
    });
  }
}
