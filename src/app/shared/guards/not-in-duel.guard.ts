import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/api/services/auth.service';
import { DuelService } from 'src/app/api/services/duel.service';

/**
 * Pendant un duel en cours, le Pokédex et les fiches Pokémon sont inaccessibles (pour ne pas chercher les réponses) :
 * le joueur est renvoyé vers son duel. Sans compte, ou si l'API ne répond pas, la navigation reste libre.
 */
export const notInDuelGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  if (!auth.token) return true;

  const router = inject(Router);
  const loc = route.paramMap.get('loc') ?? state.url.split('/')[1] ?? 'FR';
  return inject(DuelService)
    .active()
    .pipe(
      map(duel => (duel ? router.createUrlTree(['/', loc, 'duel', duel.id], { queryParams: { locked: 1 } }) : true)),
      catchError(() => of(true))
    );
};
