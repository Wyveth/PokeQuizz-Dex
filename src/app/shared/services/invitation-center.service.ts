import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Duel } from 'src/app/api/models/concretes/duel';
import { Hangman } from 'src/app/api/models/concretes/hangman';
import { difficultyKey } from 'src/app/api/models/concretes/quizz';
import { DuelService } from 'src/app/api/services/duel.service';
import { HangmanService } from 'src/app/api/services/hangman.service';
import { LocService } from 'src/app/api/services/loc.service';
import { TranslationKey } from 'src/app/i18n/fr';

/** Invitation reçue, duel ou pendu coop, présentée de la même façon dans la cloche et le toast. */
export interface Invitation {
  kind: 'duel' | 'hangman';
  id: string;
  from: string | null;
  /** Clé du libellé principal (« X vous défie », « X vous invite… »). */
  titleKey: TranslationKey;
  /** Clé du détail (difficulté du duel, ou « Pendu coop »). */
  detailKey: TranslationKey;
  createdAt: string;
}

/**
 * Centre des invitations : liste les défis et invitations au pendu en attente,
 * et signale les nouvelles (toast) à partir de l'événement temps réel invitationsChanged.
 */
@Injectable({ providedIn: 'root' })
export class InvitationCenterService {
  readonly items = signal<Invitation[]>([]);
  readonly count = computed(() => this.items().length);
  /** Invitation arrivée à l'instant, affichée en toast. */
  readonly toast = signal<Invitation | null>(null);

  private known = new Set<string>();
  private started = false;
  private loc = 'FR';

  constructor(
    private duels: DuelService,
    private hangman: HangmanService,
    private locService: LocService,
    private router: Router
  ) {
    this.locService.loc$.subscribe((loc: string) => (this.loc = loc || 'FR'));
    this.duels.invitationsChanged$.subscribe(() => {
      if (this.started) this.refresh(true);
    });
  }

  /** Connexion : premier chargement, sans toast pour les invitations déjà en attente. */
  start() {
    this.started = true;
    this.refresh(false);
  }

  /** Déconnexion. */
  stop() {
    this.started = false;
    this.known.clear();
    this.items.set([]);
    this.toast.set(null);
  }

  refresh(notify: boolean) {
    forkJoin({
      duels: this.duels.invitations().pipe(catchError(() => of([] as Duel[]))),
      hangmans: this.hangman.invitations().pipe(catchError(() => of([] as Hangman[])))
    }).subscribe(({ duels, hangmans }) => {
      if (!this.started) return;
      const list = [...duels.map(d => this.fromDuel(d)), ...hangmans.map(h => this.fromHangman(h))].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );
      const fresh = list.filter(i => !this.known.has(this.key(i)));
      this.known = new Set(list.map(i => this.key(i)));
      this.items.set(list);

      const current = this.toast();
      if (notify && fresh.length > 0) this.toast.set(fresh[0]);
      // Invitation traitée ailleurs (autre onglet, annulée par l'expéditeur) : le toast disparaît
      else if (current && !this.known.has(this.key(current))) this.toast.set(null);
    });
  }

  dismissToast() {
    this.toast.set(null);
  }

  accept(item: Invitation) {
    this.toast.set(null);
    const call: Observable<{ id: string }> = item.kind === 'duel' ? this.duels.accept(item.id) : this.hangman.accept(item.id);
    call.subscribe({
      next: game => {
        this.remove(item);
        this.router.navigate(['/', this.loc, item.kind, game.id]);
      },
      error: () => this.refresh(false)
    });
  }

  decline(item: Invitation) {
    this.toast.set(null);
    const call: Observable<unknown> = item.kind === 'duel' ? this.duels.decline(item.id) : this.hangman.decline(item.id);
    call.subscribe({ next: () => this.remove(item), error: () => this.refresh(false) });
  }

  private remove(item: Invitation) {
    this.items.update(list => list.filter(i => this.key(i) !== this.key(item)));
  }

  private key(item: Invitation) {
    return `${item.kind}:${item.id}`;
  }

  private fromDuel(duel: Duel): Invitation {
    return {
      kind: 'duel',
      id: duel.id,
      from: duel.opponent?.userName ?? null,
      titleKey: 'duel.invitedBy',
      detailKey: difficultyKey(duel.difficulty),
      createdAt: duel.createdAt
    };
  }

  private fromHangman(game: Hangman): Invitation {
    return {
      kind: 'hangman',
      id: game.id,
      from: game.partner,
      titleKey: 'hangman.invitedBy',
      detailKey: 'notif.hangmanCoop',
      createdAt: game.createdAt
    };
  }
}
