import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Duel } from 'src/app/api/models/concretes/duel';
import { AnswerChoice, Question, difficultyKey } from 'src/app/api/models/concretes/quizz';
import { DuelService } from 'src/app/api/services/duel.service';
import { LocService } from 'src/app/api/services/loc.service';
import { TranslationKey } from 'src/app/i18n/fr';
import { I18nService } from 'src/app/i18n/i18n.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

/** Partie de duel : temps réel (chrono commun piloté par le serveur) ou asynchrone (chacun à son rythme). */
@Component({
  selector: 'app-duel-play',
  templateUrl: './duel-play.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, CommonModule, RouterModule]
})
export class DuelPlayComponent implements OnInit, OnDestroy {
  readonly difficultyKey = difficultyKey;

  loc = 'FR';
  duelId = '';

  duel = signal<Duel | null>(null);
  question = signal<Question | null>(null);
  imageUrl = signal<string | null>(null);
  selected = signal<number[]>([]);
  submitting = signal(false);
  error = signal<string | null>(null);
  confirmForfeit = signal(false);
  /** Arrivée ici depuis le Pokédex bloqué pendant le duel. */
  pokedexLocked = signal(false);

  /** Heure du serveur estimée (corrige le décalage d'horloge du client), rafraîchie 5 fois par seconde. */
  now = signal(Date.now());
  private serverOffset = 0;

  isLive = computed(() => this.duel()?.mode === 'Live');
  answered = computed(() => !!this.question()?.result);
  result = computed(() => this.question()?.result ?? null);

  /** Temps réel : millisecondes avant le début de la question en cours (> 0 pendant le compte à rebours). */
  untilStart = computed(() => {
    const d = this.duel();
    if (!d?.questionStartsAt || d.status !== 'InProgress') return 0;
    return Math.max(0, Date.parse(d.questionStartsAt) - this.now());
  });

  /** Temps réel : secondes restantes et part du chrono restante (0 à 100). */
  remaining = computed(() => {
    const d = this.duel();
    if (!d?.questionEndsAt || this.untilStart() > 0) return d?.questionSeconds ?? 0;
    return Math.max(0, Math.ceil((Date.parse(d.questionEndsAt) - this.now()) / 1000));
  });
  remainingPercent = computed(() => {
    const d = this.duel();
    if (!d?.questionEndsAt) return 100;
    const ms = Date.parse(d.questionEndsAt) - this.now();
    return Math.max(0, Math.min(100, (ms / (d.questionSeconds * 1000)) * 100));
  });

  /** L'adversaire a déjà répondu à la question en cours (temps réel). */
  opponentAnswered = computed(() => {
    const d = this.duel();
    return !!d?.opponent && d.opponent.answered >= d.currentOrder;
  });

  /** Mode asynchrone : j'ai terminé, en attente de l'adversaire. */
  waitingForOpponent = computed(() => {
    const d = this.duel();
    return !!d && d.status !== 'Finished' && d.nextOrder === null && !this.question();
  });

  longAnswers = computed(() =>
    (this.question()?.answers ?? []).some(a => (a.label?.length ?? 0) > 40)
  );

  imageFilter = computed(() => {
    const q = this.question();
    if (!q || this.answered()) return 'none';
    const filters: string[] = [];
    if (q.isHide) filters.push('brightness(0)');
    if (q.isBlurred) filters.push('blur(10px)');
    if (q.isGrayscale) filters.push('grayscale(1)');
    return filters.length ? filters.join(' ') : 'none';
  });

  answersGridClass = computed(() => {
    if (this.longAnswers()) return 'grid-cols-1';
    return (this.question()?.answers.length ?? 0) > 8 ? 'grid-cols-3' : 'grid-cols-2';
  });

  private destroyRef = inject(DestroyRef);
  private clock?: ReturnType<typeof setInterval>;
  private poll?: ReturnType<typeof setInterval>;
  private startTimer?: ReturnType<typeof setTimeout>;
  private audio?: HTMLAudioElement;
  private loadingOrder: number | null = null;

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
      this.duelId = params['id'];
      if (this.route.snapshot.queryParamMap.get('locked')) {
        this.pokedexLocked.set(true);
        setTimeout(() => this.pokedexLocked.set(false), 5000);
      }
      this.resetQuestion();
      this.loadDuel();
    });

    this.duelService.duelUpdated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(id => id === this.duelId && this.loadDuel());

    this.clock = setInterval(() => this.now.set(Date.now() + this.serverOffset), 200);
    // Filet de sécurité si une notification temps réel est perdue
    this.poll = setInterval(() => {
      const d = this.duel();
      if (d && ['Searching', 'Invited', 'InProgress'].includes(d.status)) this.loadDuel();
    }, 4000);
  }

  ngOnDestroy() {
    clearInterval(this.clock);
    clearInterval(this.poll);
    clearTimeout(this.startTimer);
    this.audio?.pause();
    this.revokeImage();
  }

  // ---------- Actions ----------
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

  letter(index: number) {
    return String.fromCharCode(65 + index);
  }

  toggle(answer: AnswerChoice) {
    const q = this.question();
    if (!q || this.answered() || this.submitting() || this.timeUp()) return;
    if (q.isMultipleAnswers)
      this.selected.update(list =>
        list.includes(answer.id) ? list.filter(id => id !== answer.id) : [...list, answer.id]
      );
    else this.selected.set([answer.id]);
  }

  /** Temps réel : chrono écoulé pour la question affichée. */
  timeUp(): boolean {
    return this.isLive() && !this.answered() && this.untilStart() === 0 && this.remaining() === 0;
  }

  submit() {
    const q = this.question();
    if (!q || this.answered() || this.submitting() || this.selected().length === 0 || this.timeUp())
      return;
    this.submitting.set(true);
    this.error.set(null);

    this.duelService.answer(this.duelId, q.order, this.selected()).subscribe({
      next: () => {
        this.reloadQuestion(q.order);
        this.loadDuel();
      },
      error: err => {
        this.error.set(err.message);
        this.submitting.set(false);
        this.loadDuel();
      }
    });
  }

  /** Mode asynchrone : question suivante après la correction. */
  next() {
    const d = this.duel();
    this.resetQuestion();
    if (d?.nextOrder) this.loadQuestion(d.nextOrder);
    else this.loadDuel();
  }

  playSound() {
    const q = this.question();
    if (!q) return;
    this.duelService.media(this.duelId, q.order, 'sound').subscribe({
      next: url => {
        this.audio?.pause();
        this.audio = new Audio(url);
        this.audio.play().catch(() => this.error.set(this.i18n.t('play.soundError')));
      },
      error: () => this.error.set(this.i18n.t('play.soundError'))
    });
  }

  accept() {
    this.duelService
      .accept(this.duelId)
      .subscribe({ next: d => this.applyDuel(d), error: err => this.error.set(err.message) });
  }

  decline() {
    this.duelService
      .decline(this.duelId)
      .subscribe({ next: d => this.applyDuel(d), error: err => this.error.set(err.message) });
  }

  cancel() {
    this.duelService
      .cancel(this.duelId)
      .subscribe({ next: d => this.applyDuel(d), error: err => this.error.set(err.message) });
  }

  forfeit() {
    if (!this.confirmForfeit()) {
      this.confirmForfeit.set(true);
      setTimeout(() => this.confirmForfeit.set(false), 4000);
      return;
    }
    this.duelService
      .forfeit(this.duelId)
      .subscribe({ next: d => this.applyDuel(d), error: err => this.error.set(err.message) });
  }

  backToLobby() {
    this.router.navigate(['/', this.loc, 'duel']);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
    if (event.key === 'Enter') {
      if (!this.answered()) this.submit();
      else if (!this.isLive()) this.next();
      event.preventDefault();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
    const index = event.key.toUpperCase().charCodeAt(0) - 65;
    const answers = this.question()?.answers ?? [];
    if (index >= 0 && index < answers.length) {
      this.toggle(answers[index]);
      event.preventDefault();
    }
  }

  // ---------- Libellés ----------
  opponentName(): string {
    return this.duel()?.opponent?.userName ?? this.i18n.t('duel.anOpponent');
  }

  resultKey(): TranslationKey | null {
    const r = this.duel()?.result;
    return r ? (`duel.result.${r}` as TranslationKey) : null;
  }

  // ---------- Chargement ----------
  private loadDuel() {
    this.duelService.get(this.duelId).subscribe({
      next: d => this.applyDuel(d),
      error: err => this.error.set(err.message)
    });
  }

  private applyDuel(d: Duel) {
    this.serverOffset = Date.parse(d.serverTime) - Date.now();
    this.now.set(Date.now() + this.serverOffset);
    this.duel.set(d);
    clearTimeout(this.startTimer);

    if (
      d.status === 'Finished' ||
      d.status === 'Declined' ||
      d.status === 'Cancelled' ||
      d.status === 'Expired'
    ) {
      this.resetQuestion();
      return;
    }

    if (d.mode === 'Live') {
      if (d.status !== 'InProgress') return;
      const current = this.question();
      const wait = Date.parse(d.questionStartsAt ?? '') - this.now();
      if (wait > 0) {
        // Pause entre deux questions : on laisse la correction affichée, puis on charge la suivante au top départ
        if (current && current.order !== d.currentOrder - 1) this.resetQuestion();
        this.startTimer = setTimeout(() => this.loadQuestion(d.currentOrder), wait + 50);
      } else if (current?.order !== d.currentOrder) {
        this.loadQuestion(d.currentOrder);
      }
      return;
    }

    // Asynchrone : on garde la question affichée (et sa correction) jusqu'au clic sur « Suivante »
    if (!d.canPlay) {
      if (this.question() && !this.question()!.result) this.resetQuestion();
      return;
    }
    if (!this.question() && d.nextOrder) this.loadQuestion(d.nextOrder);
  }

  private loadQuestion(order: number) {
    if (this.loadingOrder === order) return;
    this.loadingOrder = order;
    this.selected.set([]);
    this.duelService.getQuestion(this.duelId, order, this.loc).subscribe({
      next: question => {
        this.loadingOrder = null;
        this.question.set(question);
        this.selected.set(question.result?.selectedAnswerIds ?? []);
        this.submitting.set(false);
        this.loadImage(question);
      },
      error: err => {
        this.loadingOrder = null;
        // Question pas encore ouverte (horloges décalées) : on réessaie un peu plus tard
        if (err.status === 409) setTimeout(() => this.loadDuel(), 1000);
        else this.error.set(err.message);
      }
    });
  }

  /** Après une réponse : recharge la question pour obtenir la correction et le sujet révélé. */
  private reloadQuestion(order: number) {
    this.duelService.getQuestion(this.duelId, order, this.loc).subscribe({
      next: question => {
        this.question.set(question);
        this.selected.set(question.result?.selectedAnswerIds ?? this.selected());
        this.submitting.set(false);
        // Question du cri : l'image du Pokémon n'est disponible qu'après la réponse
        if (question.subject.hasImage && !this.imageUrl()) this.loadImage(question);
      },
      error: () => this.submitting.set(false)
    });
  }

  private loadImage(question: Question) {
    this.revokeImage();
    if (!question.subject.hasImage) return;
    this.duelService.media(this.duelId, question.order, 'image').subscribe({
      next: url => {
        if (this.question()?.order === question.order) this.imageUrl.set(url);
        else URL.revokeObjectURL(url);
      },
      error: () => undefined
    });
  }

  private resetQuestion() {
    this.question.set(null);
    this.selected.set([]);
    this.submitting.set(false);
    this.revokeImage();
  }

  private revokeImage() {
    const url = this.imageUrl();
    if (url) URL.revokeObjectURL(url);
    this.imageUrl.set(null);
  }
}
