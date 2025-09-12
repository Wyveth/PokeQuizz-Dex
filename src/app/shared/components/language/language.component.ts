import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
export class LanguageComponent extends BaseComponent implements OnInit {
  loc!: string;

  constructor(
    resources: AppResource,
    private router: Router,
    private locService: LocService
  ) {
    super(resources);
  }

  ngOnInit(): void {
    // récupère la langue courante depuis l'URL
    this.loc = this.router.url.split('/')[1];
  }

  /** Retourne le chemin vers le drapeau d'une langue */
  public getHref(language: string): string {
    return '/assets/Images/Location/' + language + '.png';
  }

  /** Change la langue de l'application */
  public navigateTo(language: string): void {
    this.locService.setLoc(language);

    const segments = this.router.url.split('/');
    if (segments.length > 1) segments[1] = language;
    const newUrl = segments.join('/');

    this.router.navigateByUrl(newUrl);
  }
}
