import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { AppResource } from 'src/app/app.resource';
import { CommonModule } from '@angular/common';
import { LocService } from 'src/app/api/services/loc.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LanguageComponent extends BaseComponent implements OnInit, OnDestroy {
  loc = 'FR';
  open = false;

  languages = [
    { code: 'FR', label: 'Français' },
    { code: 'EN', label: 'English' },
    { code: 'ES', label: 'Español' },
    { code: 'IT', label: 'Italiano' },
    { code: 'DE', label: 'Deutsch' }
  ];

  private locSub?: Subscription;

  constructor(
    resources: AppResource,
    private router: Router,
    private locService: LocService,
    private elementRef: ElementRef<HTMLElement>
  ) {
    super(resources);
  }

  override ngOnInit(): void {
    // récupère la langue courante depuis l'URL, puis suit les changements
    const fromUrl = this.router.url.split('/')[1];
    if (fromUrl) this.loc = fromUrl;
    this.locSub = this.locService.loc$.subscribe(loc => (this.loc = loc));
  }

  ngOnDestroy(): void {
    this.locSub?.unsubscribe();
  }

  /** Retourne le chemin vers le drapeau d'une langue */
  public getHref(language: string): string {
    return '/assets/Images/Location/' + language + '.png';
  }

  public toggle(event: Event): void {
    event.stopPropagation();
    this.open = !this.open;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.open && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open = false;
  }

  /** Change la langue de l'application */
  public navigateTo(language: string): void {
    this.open = false;
    this.locService.setLoc(language);

    const segments = this.router.url.split('/');
    if (segments.length > 1) segments[1] = language;
    const newUrl = segments.join('/');

    this.router.navigateByUrl(newUrl);
  }
}
