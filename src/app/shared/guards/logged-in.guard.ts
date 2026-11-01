import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/api/services/auth.service';

/** Pages réservées aux comptes (duels) : renvoie vers la connexion, puis revient à la page demandée. */
export const loggedInGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  if (auth.token) return true;

  const loc = route.paramMap.get('loc') ?? state.url.split('/')[1] ?? 'FR';
  return inject(Router).createUrlTree(['/', loc, 'login'], { queryParams: { returnUrl: state.url } });
};
