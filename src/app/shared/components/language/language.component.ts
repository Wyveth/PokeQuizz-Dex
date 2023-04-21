import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { AppResource } from 'src/app/app.resource';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent extends BaseComponent implements OnInit {
  location!: any;
  url: string = this.router.url;

  constructor(
    resources: AppResource,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(resources);
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  public navigateTo(language: string): void {
    this.location = this.router.url.split('/')[1];
    this.url = this.router.url.replace(this.location, language);
    this.router.navigate([this.url]);
  }
}
