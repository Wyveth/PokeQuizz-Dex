import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { I18nService } from 'src/app/i18n/i18n.service';

/** Volumes de données de jeu (aperçu avant purge, ou résultat de la purge). */
export interface GameDataCounts {
  quizzes: number;
  questions: number;
  answers: number;
  hangmanGames: number;
  /** Quiz conservés car utilisés par des duels (le classement en dépend). */
  duelQuizzesKept: number;
}

/** Texte de confirmation attendu par l'API pour la purge. */
export const PURGE_CONFIRMATION = 'PURGE';

/** Administration (comptes listés dans Jwt:AdminUserIds côté API). */
@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private i18n: I18nService
  ) {}

  private get api(): string {
    return this.config.getConfig('api_root') + (this.config.getConfig('admin_api') ?? '/Admin');
  }

  gameData(): Observable<GameDataCounts> {
    return this.http.get<GameDataCounts>(`${this.api}/game-data`).pipe(catchError(this.handleError));
  }

  purgeGameData(): Observable<GameDataCounts> {
    return this.http.post<GameDataCounts>(`${this.api}/game-data/purge`, { confirm: PURGE_CONFIRMATION }).pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse) => {
    const message =
      error.status === 403
        ? this.i18n.t('admin.forbidden')
        : (error.error?.message ?? (error.status === 0 ? this.i18n.t('error.unreachable') : this.i18n.t('error.http', error.status)));
    return throwError(() => ({ status: error.status, message }));
  };
}
