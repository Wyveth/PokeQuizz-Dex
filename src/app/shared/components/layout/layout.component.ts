import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbsComponent, FooterComponent]
})
export class LayoutComponent implements OnInit, OnDestroy {
  /** Écran plein (route avec data.immersive) : en-tête et pied de page masqués sur mobile. */
  immersive = false;

  private subscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.updateImmersive();
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateImmersive());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private updateImmersive() {
    let current = this.route;
    while (current.firstChild) current = current.firstChild;
    this.immersive = current.snapshot.data['immersive'] === true;
  }
}
