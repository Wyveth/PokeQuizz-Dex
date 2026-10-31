import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, tap, throwError } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { I18nService } from 'src/app/i18n/i18n.service';
import { Hangman } from '../models/concretes/hangman';
import { AuthService } from './auth.service';

/** Parties solo jouées sans compte : leurs identifiants sont gardés dans le navigateur pour les reprendre. */
const GUEST_KEY = 'pqd.guestHangman';
const MAX_GUEST = 10;

/** API du pendu (solo ouvert à tous, coop réservée aux comptes). */
@Injectable({ providedIn: 'root' })
export class HangmanService {
  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private injector: Injector,
    private i18n: I18nService
  ) {}

  private get api(): string {
    return this.config.getConfig('api_root') + (this.config.getConfig('hangman_api') ?? '/Hangman');
  }

  createSolo(generations: number[], lang: string): Observable<Hangman> {
    return this.http.post<Hangman>(this.api, { generations, lang }).pipe(
      tap(game => {
        if (!this.hasToken()) this.rememberGuest(game.id);
      }),
      catchError(this.handleError)
    );
  }

  invite(friendCode: string, generations: number[], lang: string): Observable<Hangman> {
    return this.http.post<Hangman>(`${this.api}/coop`, { friendCode, generations, lang }).pipe(catchError(this.handleError));
  }

  get(id: string): Observable<Hangman> {
    return this.http.get<Hangman>(`${this.api}/${id}`).pipe(catchError(this.handleError));
  }

  guess(id: string, letter: string): Observable<Hangman> {
    return this.http.post<Hangman>(`${this.api}/${id}/guess`, { letter }).pipe(catchError(this.handleError));
  }

  accept(id: string): Observable<Hangman> {
    return this.http.post<Hangman>(`${this.api}/${id}/accept`, {}).pipe(catchError(this.handleError));
  }

  decline(id: string): Observable<Hangman> {
    return this.http.post<Hangman>(`${this.api}/${id}/decline`, {}).pipe(catchError(this.handleError));
  }

  quit(id: string): Observable<Hangman> {
    return this.http.delete<Hangman>(`${this.api}/${id}`).pipe(catchError(this.handleError));
  }

  invitations(): Observable<Hangman[]> {
    return this.http.get<Hangman[]>(`${this.api}/invitations`).pipe(catchError(this.handleError));
  }

  /** Parties du compte, ou parties solo invitées mémorisées dans ce navigateur. */
  mine(): Observable<Hangman[]> {
    if (this.hasToken()) return this.http.get<Hangman[]>(`${this.api}/mine`).pipe(catchError(this.handleError));

    const ids = this.guestIds();
    if (ids.length === 0) return of([]);
    return forkJoin(
      ids.map(id =>
        this.get(id).pipe(
          catchError(() => {
            this.forgetGuest(id);
            return of(null);
          })
        )
      )
    ).pipe(map(list => list.filter((g): g is Hangman => g !== null)));
  }

  /** Silhouette du Pokémon (téléchargée : l'endpoint peut exiger le jeton en coop). */
  silhouette(id: string): Observable<string> {
    return this.http.get(`${this.api}/${id}/silhouette`, { responseType: 'blob' }).pipe(map(blob => URL.createObjectURL(blob)));
  }

  private hasToken(): boolean {
    return this.injector.get(AuthService).isLoggedIn();
  }

  private guestIds(): string[] {
    try {
      const value = JSON.parse(localStorage.getItem(GUEST_KEY) ?? '[]');
      return Array.isArray(value) ? value.filter(v => typeof v === 'string') : [];
    } catch {
      return [];
    }
  }

  private rememberGuest(id: string) {
    try {
      localStorage.setItem(GUEST_KEY, JSON.stringify([id, ...this.guestIds().filter(x => x !== id)].slice(0, MAX_GUEST)));
    } catch {
      // Stockage indisponible : la partie reste jouable via son URL
    }
  }

  private forgetGuest(id: string) {
    try {
      localStorage.setItem(GUEST_KEY, JSON.stringify(this.guestIds().filter(x => x !== id)));
    } catch {
      // ignoré
    }
  }

  private handleError = (error: HttpErrorResponse) => {
    const message =
      error.error?.message ??
      (error.status === 0 ? this.i18n.t('error.unreachable') : this.i18n.t('error.http', error.status));
    return throwError(() => ({ status: error.status, message }));
  };
}
