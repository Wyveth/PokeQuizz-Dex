import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  AnswerResult,
  Question,
  QuizzCreate,
  QuizzResult,
  QuizzSummary
} from '../models/concretes/quizz';
import { AbstractService } from './abstract/abstract.service';

/** Quiz joués sans compte : seuls leurs identifiants sont gardés dans le navigateur. */
const GUEST_STORAGE_KEY = 'pqd.guestQuizz';
const MAX_GUEST_QUIZZ = 20;

@Injectable({
  providedIn: 'root'
})
export class QuizzService extends AbstractService {
  private apiPlay: string;

  constructor(config: AppConfig, httpClient: HttpClient) {
    super(config, httpClient);
    this.apiPlay = this.basePath + (config.getConfig('play_api') ?? '/Play');
  }

  get isLoggedIn(): boolean {
    return !!this.readStorage('token');
  }

  create(options: QuizzCreate): Observable<QuizzSummary> {
    return this.httpClient.post<QuizzSummary>(this.apiPlay, options).pipe(
      map(summary => {
        if (!summary.isOwned) this.rememberGuest(summary.id);
        return summary;
      }),
      catchError(this.handleError)
    );
  }

  get(id: string): Observable<QuizzSummary> {
    return this.httpClient
      .get<QuizzSummary>(`${this.apiPlay}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /** Quiz du compte connecté, ou quiz invités mémorisés dans ce navigateur. */
  listMine(): Observable<QuizzSummary[]> {
    if (this.isLoggedIn) {
      return this.httpClient
        .get<QuizzSummary[]>(`${this.apiPlay}/mine`)
        .pipe(catchError(this.handleError));
    }

    const ids = this.guestIds();
    if (ids.length === 0) return of([]);

    return forkJoin(
      ids.map(id =>
        this.get(id).pipe(
          catchError(() => {
            // Quiz supprimé ou introuvable : on l'oublie
            this.forgetGuest(id);
            return of(null);
          })
        )
      )
    ).pipe(map(list => list.filter((q): q is QuizzSummary => q !== null)));
  }

  getQuestion(id: string, order: number, lang: string): Observable<Question> {
    const params = new HttpParams().set('lang', lang);
    return this.httpClient
      .get<Question>(`${this.apiPlay}/${id}/questions/${order}`, { params })
      .pipe(catchError(this.handleError));
  }

  answer(id: string, order: number, answerIds: number[]): Observable<AnswerResult> {
    return this.httpClient
      .post<AnswerResult>(`${this.apiPlay}/${id}/questions/${order}/answer`, { answerIds })
      .pipe(catchError(this.handleError));
  }

  getResult(id: string, lang: string): Observable<QuizzResult> {
    const params = new HttpParams().set('lang', lang);
    return this.httpClient
      .get<QuizzResult>(`${this.apiPlay}/${id}/result`, { params })
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiPlay}/${id}`).pipe(
      map(() => this.forgetGuest(id)),
      catchError(this.handleError)
    );
  }

  imageUrl(id: string, order: number): string {
    return `${this.apiPlay}/${id}/questions/${order}/image`;
  }

  soundUrl(id: string, order: number): string {
    return `${this.apiPlay}/${id}/questions/${order}/sound`;
  }

  // ---------- Stockage invité ----------
  guestIds(): string[] {
    try {
      const value = JSON.parse(this.readStorage(GUEST_STORAGE_KEY) ?? '[]');
      return Array.isArray(value) ? value.filter(v => typeof v === 'string') : [];
    } catch {
      return [];
    }
  }

  private rememberGuest(id: string) {
    const ids = [id, ...this.guestIds().filter(x => x !== id)].slice(0, MAX_GUEST_QUIZZ);
    this.writeStorage(GUEST_STORAGE_KEY, JSON.stringify(ids));
  }

  private forgetGuest(id: string) {
    this.writeStorage(GUEST_STORAGE_KEY, JSON.stringify(this.guestIds().filter(x => x !== id)));
  }

  private readStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeStorage(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Stockage indisponible (navigation privée) : le quiz reste jouable via son URL
    }
  }

  private handleError(error: HttpErrorResponse) {
    const message =
      error.error?.message ??
      (error.status === 0
        ? "Impossible de joindre l'API."
        : `Erreur ${error.status} lors de l'appel à l'API.`);
    return throwError(() => ({ status: error.status, message }));
  }
}
