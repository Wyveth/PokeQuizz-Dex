import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, catchError, finalize, forkJoin, map, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { I18nService } from 'src/app/i18n/i18n.service';

export interface AuthUser {
  id: string;
  userName: string | null;
  email: string | null;
  /** Compte administrateur (listé dans Jwt:AdminUserIds côté API). */
  isAdmin?: boolean;
}

interface TokenResponse {
  token: string;
  refreshToken: string;
  tokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

const TOKEN_KEY = 'token';
const REFRESH_KEY = 'refreshToken';
const GUEST_QUIZZ_KEY = 'pqd.guestQuizz';

/**
 * Compte du joueur : connexion, inscription, déconnexion et renouvellement du jeton (JWT de 30 min + refresh token de 7 jours).
 * Le jeton est lu par AuthInterceptor ; les quiz joués en invité sont rattachés au compte à la connexion.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<AuthUser | null>(null);
  readonly isLoggedIn = computed(() => this.user() !== null);

  private refreshInFlight?: Observable<string>;

  // Pas d'accès à la configuration dans le constructeur : le service peut être créé par l'intercepteur
  // pendant le chargement même de la configuration (APP_INITIALIZER).
  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private i18n: I18nService
  ) {}

  private get apiRoot(): string {
    return this.config.getConfig('api_root');
  }

  private get apiAuth(): string {
    return this.apiRoot + (this.config.getConfig('authenticate_api') ?? '/Authenticate');
  }

  /** Recharge le profil si un jeton est déjà présent (appelé au démarrage par l'en-tête). */
  restoreSession() {
    if (this.token && !this.user()) this.loadMe().subscribe();
  }

  get token(): string | null {
    return read(TOKEN_KEY);
  }

  login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<TokenResponse>(`${this.apiAuth}/login`, { email, password, userName: null })
      .pipe(switchMap(tokens => this.onAuthenticated(tokens)), catchError(this.toError));
  }

  register(userName: string, email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<TokenResponse>(`${this.apiAuth}/register`, { userName, email, password })
      .pipe(switchMap(tokens => this.onAuthenticated(tokens)), catchError(this.toError));
  }

  /** Mot de passe oublié : l'API envoie un lien par e-mail (réponse identique que le compte existe ou non). */
  forgotPassword(email: string, lang: string): Observable<void> {
    return this.http
      .post(`${this.apiAuth}/forgot-password`, { email, lang })
      .pipe(map(() => undefined), catchError(this.toError));
  }

  /** Nouveau mot de passe à partir du lien reçu par e-mail. */
  resetPassword(email: string, token: string, newPassword: string): Observable<void> {
    return this.http
      .post(`${this.apiAuth}/reset-password`, { email, token, newPassword })
      .pipe(map(() => undefined), catchError(this.toError));
  }

  logout(): Observable<void> {
    const body = { token: this.token ?? '', refreshToken: read(REFRESH_KEY) ?? '' };
    this.clear();
    if (!body.refreshToken) return of(undefined);
    // La révocation côté serveur est « au mieux » : on est déconnecté localement dans tous les cas
    return this.http.post(`${this.apiAuth}/logout`, body).pipe(
      map(() => undefined),
      catchError(() => of(undefined))
    );
  }

  /** Renouvelle le JWT (un seul appel à la fois, partagé entre les requêtes en échec). */
  refresh(): Observable<string> {
    const refreshToken = read(REFRESH_KEY);
    const token = this.token;
    if (!refreshToken || !token) return throwError(() => new Error('no refresh token'));

    if (!this.refreshInFlight) {
      this.refreshInFlight = this.http
        .post<TokenResponse>(`${this.apiAuth}/refresh`, { token, refreshToken })
        .pipe(
          tap(tokens => this.store(tokens)),
          map(tokens => tokens.token),
          catchError(error => {
            this.clear();
            return throwError(() => error);
          }),
          finalize(() => (this.refreshInFlight = undefined)),
          shareReplay(1)
        );
    }
    return this.refreshInFlight;
  }

  /** Vrai pour les appels d'authentification eux-mêmes (pas de renouvellement automatique sur ceux-là). */
  isAuthUrl(url: string): boolean {
    return url.startsWith(this.apiAuth);
  }

  private onAuthenticated(tokens: TokenResponse): Observable<AuthUser> {
    this.store(tokens);
    return this.loadMe().pipe(
      switchMap(user => (user ? this.claimGuestQuizz().pipe(map(() => user)) : throwError(() => new Error('me')))),
      catchError(() => throwError(() => ({ message: this.i18n.t('error.unreachable') })))
    );
  }

  private loadMe(): Observable<AuthUser | null> {
    return this.http.get<AuthUser>(`${this.apiAuth}/me`).pipe(
      tap(user => this.user.set(user)),
      catchError(() => {
        // Jeton refusé et non renouvelable : session terminée
        if (!this.token) this.user.set(null);
        return of(null);
      })
    );
  }

  /** Rattache au compte les quiz joués en invité dans ce navigateur. */
  private claimGuestQuizz(): Observable<unknown> {
    let ids: string[] = [];
    try {
      ids = JSON.parse(read(GUEST_QUIZZ_KEY) ?? '[]');
    } catch {
      ids = [];
    }
    if (!Array.isArray(ids) || ids.length === 0) return of(null);

    const play = this.apiRoot + '/Play';
    return forkJoin(ids.map(id => this.http.post(`${play}/${id}/claim`, {}).pipe(catchError(() => of(null))))).pipe(
      tap(() => write(GUEST_QUIZZ_KEY, null))
    );
  }

  private store(tokens: TokenResponse) {
    write(TOKEN_KEY, tokens.token);
    write(REFRESH_KEY, tokens.refreshToken);
  }

  private clear() {
    write(TOKEN_KEY, null);
    write(REFRESH_KEY, null);
    this.user.set(null);
  }

  private toError = (error: HttpErrorResponse | { message: string }) => {
    if (!(error instanceof HttpErrorResponse)) return throwError(() => error);
    const body = error.error;
    const message =
      body?.error ??
      (Array.isArray(body?.errors) ? body.errors.join(' ') : null) ??
      body?.message ??
      (error.status === 0 ? this.i18n.t('error.unreachable') : this.i18n.t('error.http', error.status));
    return throwError(() => ({ status: error.status, message }));
  };
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Stockage indisponible : la session ne survivra pas au rechargement
  }
}
