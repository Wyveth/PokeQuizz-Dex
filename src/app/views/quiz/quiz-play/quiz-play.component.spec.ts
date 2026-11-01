import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { vi } from 'vitest';
import { Question } from 'src/app/api/models/concretes/quizz';
import { AuthService } from 'src/app/api/services/auth.service';
import { QuizzService } from 'src/app/api/services/quizz.service';
import { AppConfig } from 'src/app/app.config';
import { AuthInterceptor } from 'src/app/shared/interceptor/AuthInterceptor';
import { testProviders } from 'src/testing/test-providers';
import { QuizPlayComponent } from './quiz-play.component';

describe('QuizPlayComponent', () => {
  it('sélectionne une réponse sans appliquer le style qui déplace les cartes', async () => {
    const question: Question = {
      quizzId: 'quiz', order: 2, total: 10, code: 'Pokemon', label: 'Quel est ce Pokémon ?',
      difficultyCode: 'Easy', isMultipleAnswers: false, isBlurred: false, isGrayscale: false,
      isHide: false, subject: { kind: 'Pokemon', name: null, description: null, hasImage: false, hasSound: false },
      answers: [{ id: 1, order: 1, label: 'Solochi' }, { id: 2, order: 2, label: 'Haydaim' }],
      done: false, result: null
    };

    await TestBed.configureTestingModule({
      imports: [QuizPlayComponent],
      providers: [
        ...testProviders(),
        { provide: ActivatedRoute, useValue: { params: of({ loc: 'FR', id: 'quiz', order: '2' }) } },
        { provide: QuizzService, useValue: { getQuestion: () => of(question) } }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(QuizPlayComponent);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('[role="group"] button')[1];
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.classList.contains('card-interactive')).toBe(false);

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.classList.contains('border-brand-500')).toBe(true);
    expect(button.classList.contains('card-interactive')).toBe(false);
  });

  it.each([
    { name: 'connecté', token: 'test-token', authorization: 'Bearer test-token' },
    { name: 'invité', token: null, authorization: null }
  ])('charge et affiche l’image du quiz pour un joueur $name', async ({ token, authorization }) => {
    const question: Question = {
      quizzId: 'quiz', order: 2, total: 10, code: 'Pokemon', label: 'Quel est ce Pokémon ?',
      difficultyCode: 'Easy', isMultipleAnswers: false, isBlurred: false, isGrayscale: false,
      isHide: false, subject: { kind: 'Pokemon', name: null, description: null, hasImage: true, hasSound: false },
      answers: [{ id: 1, order: 1, label: 'Solochi' }], done: false, result: null
    };
    const OriginalURL = URL;
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', class extends OriginalURL {
      static createObjectURL = vi.fn(() => 'blob:http://localhost/image');
      static revokeObjectURL = revokeObjectURL;
    });

    try {
      await TestBed.configureTestingModule({
        imports: [QuizPlayComponent],
        providers: [
          ...testProviders(),
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          { provide: AppConfig, useValue: { getConfig: (key: string) => key === 'api_root' ? 'http://localhost/api/v1.0' : null } },
          { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
          { provide: ActivatedRoute, useValue: { params: of({ loc: 'FR', id: 'quiz', order: '2' }) } }
        ]
      }).compileComponents();
      vi.spyOn(TestBed.inject(AuthService), 'token', 'get').mockReturnValue(token);
      const fixture = TestBed.createComponent(QuizPlayComponent);
      const http = TestBed.inject(HttpTestingController);
      fixture.detectChanges();
      const questionRequest = http.expectOne(request => request.url === 'http://localhost/api/v1.0/Play/quiz/questions/2');
      questionRequest.flush(question);
      const imageRequest = http.expectOne('http://localhost/api/v1.0/Play/quiz/questions/2/image');
      expect(imageRequest.request.headers.get('Authorization')).toBe(authorization);
      expect(imageRequest.request.responseType).toBe('blob');
      imageRequest.flush(new Blob(['image'], { type: 'image/png' }));
      fixture.detectChanges();

      const image: HTMLImageElement = fixture.nativeElement.querySelector('img[alt="Image à identifier"]');
      expect(image.getAttribute('src')).toBe('blob:http://localhost/image');
      fixture.destroy();
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/image');
      http.verify();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('annule une ancienne image et libère l’image précédente au changement de question', async () => {
    const params = new BehaviorSubject({ loc: 'FR', id: 'quiz', order: '1' });
    const images = [new Subject<Blob>(), new Subject<Blob>(), new Subject<Blob>()];
    const question = (order: number): Question => ({
      quizzId: 'quiz', order, total: 3, code: 'Pokemon', label: 'Question', difficultyCode: 'Easy',
      isMultipleAnswers: false, isBlurred: false, isGrayscale: false, isHide: false,
      subject: { kind: 'Pokemon', name: null, description: null, hasImage: true, hasSound: false },
      answers: [], done: false, result: null
    });
    const OriginalURL = URL;
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', class extends OriginalURL {
      static createObjectURL = vi.fn(() => 'blob:http://localhost/image');
      static revokeObjectURL = revokeObjectURL;
    });
    try {
      await TestBed.configureTestingModule({
        imports: [QuizPlayComponent],
        providers: [
          ...testProviders(),
          { provide: ActivatedRoute, useValue: { params } },
          { provide: QuizzService, useValue: {
            getQuestion: (_id: string, order: number) => of(question(order)),
            image: (_id: string, order: number) => images[order - 1]
          } }
        ]
      }).compileComponents();
      const fixture = TestBed.createComponent(QuizPlayComponent);
      fixture.detectChanges();
      params.next({ loc: 'FR', id: 'quiz', order: '2' });
      expect(images[0].observed).toBe(false);
      images[0].next(new Blob(['ancienne']));
      expect(fixture.componentInstance.imageUrl()).toBeNull();
      images[1].next(new Blob(['actuelle']));
      expect(fixture.componentInstance.imageUrl()).toBe('blob:http://localhost/image');
      params.next({ loc: 'FR', id: 'quiz', order: '3' });
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/image');
      expect(fixture.componentInstance.imageUrl()).toBeNull();
      fixture.destroy();
      expect(images[2].observed).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
