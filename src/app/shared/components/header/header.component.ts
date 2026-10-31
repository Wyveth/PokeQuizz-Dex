import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  effect,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/api/services/auth.service';
import { DuelService } from 'src/app/api/services/duel.service';
import { Invitation, InvitationCenterService } from '../../services/invitation-center.service';
import { LocService } from 'src/app/api/services/loc.service';
import { AppResource } from 'src/app/app.resource';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';
import { BaseComponent } from '../base/base.component';
import { LanguageComponent } from '../language/language.component';
import { ThemeSwitchComponent } from '../theme-switch/theme-switch.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, CommonModule, RouterModule, LanguageComponent, ThemeSwitchComponent]
})
export class HeaderComponent extends BaseComponent implements OnInit {
  loc!: string;
  menuOpen = false;

  /** Liste des invitations (cloche) ouverte. */
  bellOpen = false;

  constructor(
    resources: AppResource,
    private locService: LocService,
    public auth: AuthService,
    private duels: DuelService,
    public center: InvitationCenterService,
    private router: Router,
    private elementRef: ElementRef<HTMLElement>
  ) {
    super(resources);

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });

    // Connecté : temps réel des duels et pastille des invitations ; déconnecté : on coupe
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.duels.connect();
        this.center.start();
      } else {
        this.duels.disconnect();
        this.center.stop();
      }
    });
    // Un duel démarre alors qu'on consulte le Pokédex (dans cet onglet ou un autre) : retour au duel
    this.duels.duelUpdated$.subscribe(() => this.leavePokedexIfInDuel());
  }

  override ngOnInit() {
    this.auth.restoreSession();
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
    this.bellOpen = false;
  }

  toggleBell(event: Event) {
    event.stopPropagation();
    this.bellOpen = !this.bellOpen;
    this.menuOpen = false;
  }

  acceptInvitation(item: Invitation) {
    this.bellOpen = false;
    this.center.accept(item);
  }

  logout() {
    this.menuOpen = false;
    this.auth.logout().subscribe(() => this.router.navigate(['/', this.loc, 'pokedex']));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.menuOpen = false;
      this.bellOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.menuOpen = false;
    this.bellOpen = false;
  }

  private leavePokedexIfInDuel() {
    if (!/^\/[A-Za-z]{2}\/(pokedex|pokemon)(\/|$|\?)/.test(this.router.url)) return;
    this.duels.active().subscribe({
      next: duel => {
        if (duel)
          this.router.navigate(['/', this.loc, 'duel', duel.id], { queryParams: { locked: 1 } });
      },
      error: () => undefined
    });
  }
}
