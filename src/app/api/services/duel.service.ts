import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, Injector, NgZone } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Observable, Subject, catchError, map, throwError } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { I18nService } from 'src/app/i18n/i18n.service';
import {
  Duel,
  DuelChallenge,
  DuelMode,
  DuelSettings,
  DuelStats,
  FriendCode,
  Leaderboard,
  LeaderboardPeriod,
  LeaderboardSort
} from '../models/concretes/duel';
import { AnswerResult, DifficultyCode, Question } from '../models/concretes/quizz';
import { AuthService } from './auth.service';

/**
 * API des duels (compte obligatoire) et canal temps réel SignalR (/hubs/duel).
 * Les événements ne portent que l'identifiant du duel : l'écran relit l'état via l'API.
 */
@Injectable({ providedIn: 'root' })
export class DuelService {
  /** Un duel a changé (adversaire trouvé, question suivante, réponse de l'adversaire, fin…). */
  readonly duelUpdated$ = new Subject<string>();
  /** Les défis reçus ont changé. */
  readonly invitationsChanged$ = new Subject<void>();
  /** Une partie de pendu coop a changé (le partenaire a joué, invitation acceptée…). */
  readonly hangmanUpdated$ = new Subject<string>();

  private connection?: HubConnection;

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private injector: Injector,
    private zone: NgZone,
    private i18n: I18nService
  ) {}

  private get api(): string {
    return this.config.getConfig('api_root') + (this.config.getConfig('duel_api') ?? '/Duel');
  }

  /** Adresse du hub : configurée (duel_hub) ou déduite de l'origine de l'API. */
  private get hubUrl(): string {
    const configured = this.config.getConfig('duel_hub');
    if (configured) return configured;
    return new URL(this.config.getConfig('api_root')).origin + '/hubs/duel';
  }

  // ---------- Temps réel ----------
  connect() {
    if (this.connection) return;
    const auth = this.injector.get(AuthService);

    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => auth.token ?? '',
        // L'API autorise toutes les origines (CORS sans cookies) : pas d'identifiants côté navigateur
        withCredentials: false
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.on('duelUpdated', (id: string) => this.zone.run(() => this.duelUpdated$.next(id)));
    this.connection.on('invitationsChanged', () => this.zone.run(() => this.invitationsChanged$.next()));
    this.connection.on('hangmanUpdated', (id: string) => this.zone.run(() => this.hangmanUpdated$.next(id)));
    this.connection.start().catch(() => {
      // Hors ligne ou jeton expiré : les écrans relisent aussi l'état régulièrement
    });
  }

  disconnect() {
    this.connection?.stop().catch(() => undefined);
    this.connection = undefined;
  }

  // ---------- Réglages ----------
  settings(): Observable<DuelSettings> {
    return this.http.get<DuelSettings>(`${this.api}/settings`).pipe(catchError(this.handleError));
  }

  // ---------- Classement (public) ----------
  leaderboard(period: LeaderboardPeriod, sort: LeaderboardSort, top = 50): Observable<Leaderboard> {
    const params = new HttpParams().set('period', period).set('sort', sort).set('top', top);
    return this.http.get<Leaderboard>(`${this.api}/leaderboard`, { params }).pipe(catchError(this.handleError));
  }

  // ---------- Code ami ----------
  friendCode(): Observable<FriendCode> {
    return this.http.get<FriendCode>(`${this.api}/code`).pipe(catchError(this.handleError));
  }

  regenerateFriendCode(): Observable<FriendCode> {
    return this.http.post<FriendCode>(`${this.api}/code/regenerate`, {}).pipe(catchError(this.handleError));
  }

  // ---------- Duels ----------
  search(mode: DuelMode, difficulty: DifficultyCode): Observable<Duel> {
    return this.http.post<Duel>(`${this.api}/search`, { mode, difficulty }).pipe(catchError(this.handleError));
  }

  challenge(challenge: DuelChallenge): Observable<Duel> {
    return this.http.post<Duel>(`${this.api}/challenge`, challenge).pipe(catchError(this.handleError));
  }

  mine(): Observable<Duel[]> {
    return this.http.get<Duel[]>(`${this.api}/mine`).pipe(catchError(this.handleError));
  }

  /** Duel en cours (null s'il n'y en a pas) : bloque le Pokédex pendant un duel. */
  active(): Observable<Duel | null> {
    return this.http
      .get<Duel | null>(`${this.api}/active`, { observe: 'response' })
      .pipe(
        map(response => (response.status === 204 ? null : response.body)),
        catchError(this.handleError)
      );
  }

  invitations(): Observable<Duel[]> {
    return this.http.get<Duel[]>(`${this.api}/invitations`).pipe(catchError(this.handleError));
  }

  stats(): Observable<DuelStats> {
    return this.http.get<DuelStats>(`${this.api}/stats`).pipe(catchError(this.handleError));
  }

  get(id: string): Observable<Duel> {
    return this.http.get<Duel>(`${this.api}/${id}`).pipe(catchError(this.handleError));
  }

  accept(id: string): Observable<Duel> {
    return this.http.post<Duel>(`${this.api}/${id}/accept`, {}).pipe(catchError(this.handleError));
  }

  decline(id: string): Observable<Duel> {
    return this.http.post<Duel>(`${this.api}/${id}/decline`, {}).pipe(catchError(this.handleError));
  }

  cancel(id: string): Observable<Duel> {
    return this.http.delete<Duel>(`${this.api}/${id}`).pipe(catchError(this.handleError));
  }

  forfeit(id: string): Observable<Duel> {
    return this.http.post<Duel>(`${this.api}/${id}/forfeit`, {}).pipe(catchError(this.handleError));
  }

  // ---------- Questions ----------
  getQuestion(id: string, order: number, lang: string): Observable<Question> {
    const params = new HttpParams().set('lang', lang);
    return this.http
      .get<Question>(`${this.api}/${id}/questions/${order}`, { params })
      .pipe(catchError(this.handleError));
  }

  answer(id: string, order: number, answerIds: number[]): Observable<AnswerResult> {
    return this.http
      .post<AnswerResult>(`${this.api}/${id}/questions/${order}/answer`, { answerIds })
      .pipe(catchError(this.handleError));
  }

  /**
   * Image ou cri du sujet. Le endpoint exige le jeton : une balise img ne peut pas l'envoyer,
   * on télécharge donc le fichier et on renvoie une URL locale (à libérer avec URL.revokeObjectURL).
   */
  media(id: string, order: number, kind: 'image' | 'sound'): Observable<string> {
    return this.http
      .get(`${this.api}/${id}/questions/${order}/${kind}`, { responseType: 'blob' })
      .pipe(map(blob => URL.createObjectURL(blob)));
  }

  private handleError = (error: HttpErrorResponse) => {
    const message =
      error.error?.message ??
      (error.status === 0 ? this.i18n.t('error.unreachable') : this.i18n.t('error.http', error.status));
    return throwError(() => ({ status: error.status, message }));
  };
}
