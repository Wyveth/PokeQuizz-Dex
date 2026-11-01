import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Subject, of } from 'rxjs';
import { vi } from 'vitest';
import { Duel, DuelResult } from 'src/app/api/models/concretes/duel';
import { AnswerResult, Question } from 'src/app/api/models/concretes/quizz';
import { DuelService } from 'src/app/api/services/duel.service';
import { testProviders } from 'src/testing/test-providers';
import { DuelPlayComponent } from './duel-play.component';

describe('DuelPlayComponent', () => {
  let fixture: ComponentFixture<DuelPlayComponent>;
  let duelResponses: Subject<Duel>;
  let questionResponses: Subject<Question>;
  let answerResponses: Subject<AnswerResult>;

  const question: Question = {
    quizzId: 'quiz', order: 10, total: 10, code: 'Pokemon', label: 'Dernière question',
    difficultyCode: 'Easy', isMultipleAnswers: false, isBlurred: false, isGrayscale: false,
    isHide: false, subject: { kind: 'Pokemon', name: null, description: null, hasImage: false, hasSound: false },
    answers: [{ id: 1, order: 1, label: 'Réponse' }], done: false, result: null
  };

  function duel(status: Duel['status'], result: DuelResult | null = null): Duel {
    const now = Date.now();
    return {
      id: 'duel', mode: 'Live', status, difficulty: 'Easy', generations: [], isPrivate: false,
      isChallenger: true, me: { userName: 'Moi', score: 1305, answered: 9, done: false },
      opponent: { userName: 'Adversaire', score: 1333, answered: 10, done: false },
      total: 10, nextOrder: 10, canPlay: true, currentOrder: 10,
      questionStartsAt: new Date(now - 1000).toISOString(),
      questionEndsAt: new Date(now + 14000).toISOString(), questionSeconds: 15,
      serverTime: new Date(now).toISOString(), result, forfeit: false,
      createdAt: new Date(now).toISOString(), startedAt: new Date(now).toISOString(), finishedAt: null
    };
  }

  beforeEach(async () => {
    duelResponses = new Subject<Duel>();
    questionResponses = new Subject<Question>();
    answerResponses = new Subject<AnswerResult>();
    await TestBed.configureTestingModule({
      imports: [DuelPlayComponent],
      providers: [
        ...testProviders(),
        { provide: ActivatedRoute, useValue: { params: of({ loc: 'FR', id: 'duel' }), snapshot: { queryParamMap: convertToParamMap({}) } } },
        { provide: DuelService, useValue: {
          duelUpdated$: new Subject<string>(), get: vi.fn(() => duelResponses),
          getQuestion: vi.fn(() => questionResponses), answer: vi.fn(() => answerResponses)
        } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DuelPlayComponent);
    fixture.detectChanges();
  });

  it('sélectionne une réponse sans appliquer le style qui déplace les cartes', () => {
    duelResponses.next(duel('InProgress'));
    questionResponses.next(question);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[role="group"] button');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.classList.contains('card-interactive')).toBe(false);

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.classList.contains('border-brand-500')).toBe(true);
    expect(button.classList.contains('card-interactive')).toBe(false);
  });

  it.each(['Loss', 'Win', 'Draw'] as DuelResult[])(
    'ne réaffiche pas la dernière question après le résultat %s, même si sa réponse arrive en retard',
    result => {
      duelResponses.next(duel('InProgress'));
      questionResponses.next(question);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Dernière question');

      fixture.componentInstance.toggle(question.answers[0]);
      fixture.componentInstance.submit();
      answerResponses.next({ isCorrect: true, alreadyAnswered: false, correctAnswerIds: [1], selectedAnswerIds: [1], quizzDone: true, nextOrder: null });
      duelResponses.next(duel('Finished', result));
      questionResponses.next({ ...question, done: true, result: { isCorrect: true, alreadyAnswered: true, correctAnswerIds: [1], selectedAnswerIds: [1], quizzDone: true, nextOrder: null } });
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Score final');
      expect(fixture.nativeElement.textContent).not.toContain('Dernière question');
      expect(fixture.componentInstance.question()).toBeNull();
    }
  );

  it('ignore une question initiale chargée après la fin du duel', () => {
    duelResponses.next(duel('InProgress'));
    duelResponses.next(duel('Finished', 'Loss'));
    questionResponses.next(question);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Score final');
    expect(fixture.nativeElement.textContent).not.toContain('Dernière question');
    expect(fixture.componentInstance.question()).toBeNull();
  });
});
