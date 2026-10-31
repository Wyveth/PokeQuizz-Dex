import { CommonModule } from '@angular/common';
import { Component, OnDestroy, effect, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';
import { InvitationCenterService } from '../../services/invitation-center.service';

/** Durée d'affichage du toast avant qu'il ne se range dans la cloche. */
const TOAST_MS = 15000;

/** Toast d'invitation (duel ou pendu coop) affiché sur toutes les pages, sauf pendant un duel en cours. */
@Component({
  selector: 'app-invitation-toast',
  templateUrl: './invitation-toast.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, TranslatePipe]
})
export class InvitationToastComponent implements OnDestroy {
  /** Pendant un duel, le toast ne doit pas gêner la réponse : l'invitation reste dans la cloche. */
  inDuel = false;

  private timer?: ReturnType<typeof setTimeout>;
  private subscription: Subscription;

  constructor(
    public center: InvitationCenterService,
    router: Router
  ) {
    const update = () => (this.inDuel = /^\/[A-Za-z]{2}\/duel\/[^/?]+/.test(router.url));
    update();
    this.subscription = router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(update);

    effect(() => {
      const toast = this.center.toast();
      clearTimeout(this.timer);
      if (toast) this.timer = setTimeout(() => this.center.dismissToast(), TOAST_MS);
    });
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    this.subscription.unsubscribe();
  }
}
