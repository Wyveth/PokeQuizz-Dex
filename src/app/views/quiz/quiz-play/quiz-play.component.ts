import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnswerChoice, AnswerResult, Question } from 'src/app/api/models/concretes/quizz';
import { LocService } from 'src/app/api/services/loc.service';
import { QuizzService } from 'src/app/api/services/quizz.service';

@Component({
  selector: 'app-quiz-play',
  templateUrl: './quiz-play.component.html',
  imports: [CommonModule, RouterModule]
})
export class QuizPlayComponent implements OnInit, OnDestroy {
  loc = 'FR';
  quizzId = '';
  order = 1;

  question = signal<Question | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  selected = signal<number[]>([]);
  submitting = signal(false);

  /** Correction de la question affichée (après réponse). */
  result = computed<AnswerResult | null>(() => this.question()?.result ?? null);
  answered = computed(() => this.result() !== null);

  progress = computed(() => {
    const q = this.question();
    return q ? Math.round(((q.order - (this.answered() ? 0 : 1)) / q.total) * 100) : 0;
  });

  /** Les réponses longues (descriptions) s'affichent sur une colonne. */
  longAnswers = computed(() =>
    (this.question()?.answers ?? []).some(a => (a.label?.length ?? 0) > 40)
  );

  /** Effets de la difficulté sur l'image, retirés une fois la question répondue. */
  imageFilter = computed(() => {
    const q = this.question();
    if (!q || this.answered()) return 'none';
    const filters: string[] = [];
    if (q.isHide) filters.push('brightness(0)');
    if (q.isBlurred) filters.push('blur(10px)');
    if (q.isGrayscale) filters.push('grayscale(1)');
    return filters.length ? filters.join(' ') : 'none';
  });

  private subscription?: Subscription;
  private audio?: HTMLAudioElement;

  constructor(
    private quizzService: QuizzService,
    private locService: LocService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Le composant est réutilisé d'une question à l'autre : on suit les paramètres de route
    this.subscription = this.route.params.subscribe(params => {
      this.loc = params['loc'] || 'FR';
      this.locService.setLoc(this.loc);
      this.quizzId = params['id'];
      this.order = Number(params['order']) || 1;
      this.load();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.audio?.pause();
  }

  get imageUrl(): string {
    return this.quizzService.imageUrl(this.quizzId, this.order);
  }

  isSelected(answer: AnswerChoice) {
    return this.selected().includes(answer.id);
  }

  isCorrect(answer: AnswerChoice) {
    return this.result()?.correctAnswerIds.includes(answer.id) ?? false;
  }

  answerClass(answer: AnswerChoice): string {
    const selected = this.isSelected(answer);
    if (!this.answered())
      return selected ? 'card-interactive border-brand-500' : 'card-interactive border-transparent';
    if (this.isCorrect(answer)) return 'border-emerald-500 bg-emerald-500/10';
    if (selected) return 'border-red-500 bg-red-500/10';
    return 'border-transparent opacity-60';
  }

  toggle(answer: AnswerChoice) {
    const q = this.question();
    if (!q || this.answered() || this.submitting()) return;

    if (q.isMultipleAnswers) {
      this.selected.update(list =>
        list.includes(answer.id) ? list.filter(id => id !== answer.id) : [...list, answer.id]
      );
    } else {
      this.selected.set([answer.id]);
    }
  }

  submit() {
    if (this.answered() || this.submitting() || this.selected().length === 0) return;
    this.submitting.set(true);
    this.error.set(null);

    this.quizzService.answer(this.quizzId, this.order, this.selected()).subscribe({
      // On recharge la question : l'API révèle alors le sujet (nom du Pokémon, etc.)
      next: () => this.load(true),
      error: err => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }

  next() {
    const result = this.result();
    if (!result) return;
    if (result.quizzDone || result.nextOrder === null)
      this.router.navigate(['/', this.loc, 'quiz', this.quizzId, 'result']);
    else this.router.navigate(['/', this.loc, 'quiz', this.quizzId, result.nextOrder]);
  }

  playSound() {
    this.audio?.pause();
    this.audio = new Audio(this.quizzService.soundUrl(this.quizzId, this.order));
    this.audio.play().catch(() => this.error.set('Lecture du cri impossible sur ce navigateur.'));
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

    if (event.key === 'Enter') {
      if (this.answered()) this.next();
      else this.submit();
      event.preventDefault();
      return;
    }

    // Raccourcis A, B, C… pour choisir une réponse (jusqu'à 18 réponses en Difficile)
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
    const index = event.key.toUpperCase().charCodeAt(0) - 65;
    const answers = this.question()?.answers ?? [];
    if (index >= 0 && index < answers.length && index < 26) {
      this.toggle(answers[index]);
      event.preventDefault();
    }
  }

  /** Lettre affichée devant la réponse (A pour la première). */
  letter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  private load(keepSelection = false) {
    this.loading.set(!keepSelection);
    if (!keepSelection) {
      this.question.set(null);
      this.selected.set([]);
    }

    this.quizzService.getQuestion(this.quizzId, this.order, this.loc).subscribe({
      next: question => {
        this.question.set(question);
        if (question.result) this.selected.set(question.result.selectedAnswerIds);
        this.loading.set(false);
        this.submitting.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
        this.submitting.set(false);
      }
    });
  }
}
