import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  DIFFICULTIES,
  DifficultyCode,
  GENERATIONS,
  QuizzSummary
} from 'src/app/api/models/concretes/quizz';
import { LocService } from 'src/app/api/services/loc.service';
import { QuizzService } from 'src/app/api/services/quizz.service';

@Component({
  selector: 'app-quiz-setup',
  templateUrl: './quiz-setup.component.html',
  imports: [CommonModule, RouterModule]
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
    private router: Router
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

  generationLabel(quizz: QuizzSummary) {
    if (quizz.generations.length === 0) return 'Toutes générations';
    return GENERATIONS.filter(g => quizz.generations.includes(g.value))
      .map(g => g.label)
      .join(', ');
  }

  difficultyLabel(quizz: QuizzSummary) {
    return DIFFICULTIES.filter(d => quizz.difficulties.includes(d.value))
      .map(d => d.label)
      .join(' + ');
  }

  private loadList() {
    this.quizzService.listMine().subscribe({
      next: list => this.quizzList.set(list),
      error: () => this.quizzList.set([])
    });
  }
}
