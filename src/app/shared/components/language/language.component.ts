import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { AppResource } from 'src/app/app.resource';
import { CommonModule } from '@angular/common';
import { LocService } from 'src/app/api/services/loc.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LanguageComponent extends BaseComponent implements OnInit {
  loc!: any;
  url: string = this.router.url;

  constructor(
    resources: AppResource,
    private router: Router,
    private locService: LocService,
    private activatedRoute: ActivatedRoute
  ) {
    super(resources);
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  public getHref(language: string): string {
    return '/assets/Images/Location/' + language + '.png';
  }

  public navigateTo(language: string): void {
    this.loc = this.router.url.split('/')[1];
    this.locService.setLoc(language);
    this.url = this.router.url.replace(this.loc, language);
    this.router.navigate([this.url]);
  }
}
