import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/api/services/auth.service';

/**
 * Ajoute le JWT aux requêtes et, sur un 401, renouvelle le jeton une fois puis rejoue la requête.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  // AuthService utilise HttpClient : injection paresseuse pour éviter une dépendance circulaire
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.injector.get(AuthService);
    const token = auth.token;
    const request = token ? withToken(req, token) : req;

    return next.handle(request).pipe(
      catchError((error: unknown) => {
        const canRefresh =
          error instanceof HttpErrorResponse && error.status === 401 && !!token && !auth.isAuthUrl(req.url);
        if (!canRefresh) return throwError(() => error);

        return auth.refresh().pipe(
          switchMap(newToken => next.handle(withToken(req, newToken))),
          catchError(() => throwError(() => error))
        );
      })
    );
  }
}

function withToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
}
